# Use a base image with Node.js and Python
FROM ubuntu:22.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY ui/package*.json ./ui/
COPY requirements.txt ./

# Install Python dependencies
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Copy the rest of the project files (excluding node_modules)
WORKDIR /app
COPY . .
# Remove any local node_modules that might have been copied
RUN rm -rf ui/node_modules

# Install Node.js dependencies in the container
WORKDIR /app/ui
RUN npm ci

# Build the React frontend
RUN npm run build

# Go back to main directory
WORKDIR /app

# Expose the port your server runs on
EXPOSE 8080

# Run the server via gunicorn (production WSGI). Two workers is conservative
# for a small Cloud Run instance; each worker is single-threaded and Flask
# routes block on Vertex AI calls. Adjust --workers / --threads to match
# instance CPU once load shape is known.
#   * Honors $PORT (Cloud Run sets it)
#   * --forwarded-allow-ips=* — ProxyFix in server.py reads X-Forwarded-For
#     to key rate limits on the real client IP.
#   * Sensible timeouts so a slow Gemini call doesn't hang the worker forever.
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 2 --threads 4 --timeout 60 --graceful-timeout 30 --forwarded-allow-ips=* --access-logfile - --error-logfile - server:app"]