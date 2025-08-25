# Python Testing Agent - Modern UI

A state-of-the-art React frontend for the Python Testing Agent, built with modern web technologies.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** for beautiful, responsive styling
- **Framer Motion** for smooth animations
- **Monaco Editor** for advanced code editing
- **React Query** for efficient API state management
- **Dark/Light theme** support
- **Responsive design** for all devices

## 🛠️ Technologies Used

- React 18 with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Monaco Editor (Code editor)
- React Query (API state management)
- Axios (HTTP client)
- Lucide React (Icons)
- React Hot Toast (Notifications)

## 🎨 Design Features

- Glass morphism design elements
- Gradient backgrounds with particle animations
- Smooth transitions and micro-interactions
- Professional code editor with syntax highlighting
- Real-time server status indicator
- Responsive layout that works on all devices

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Development

The UI communicates with the Flask backend via API endpoints:

- `POST /api/grade` - Submit code for grading
- `POST /api/generate-question` - Generate a new question
- `GET /api/health` - Check server status

## 🎯 Usage

1. **Development Mode**: Hot reload with backend proxy
2. **Production Mode**: Built and served by Flask backend
3. **Docker Mode**: Automatically built and served in container

## 🎨 Customization

The UI is highly customizable through:

- Tailwind config for colors and themes
- CSS custom properties for animations
- Component props for behavior
- Environment variables for API endpoints
