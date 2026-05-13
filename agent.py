from vertexai.generative_models import Part, Content, GenerativeModel, GenerationConfig
import vertexai
import random
import json

# Models split by job:
#   - GRADER: needs better reasoning (used by /grade and /youtube-suggestions).
#   - GENERATOR: a creative-but-cheap task; use the lighter, faster flash-lite.
GRADER_MODEL = "gemini-2.5-flash"
GENERATOR_MODEL = "gemini-2.5-flash-lite"

vertexai.init(project="python-testing-agent", location="us-central1")


class PythonTestingAgent:
    def __init__(self):
        # No system instruction on either client. The previous grader-shaped
        # system_instruction conflicted with the new response_schema
        # (it told the model "grade is a string", while the schema says
        # INTEGER) and caused Gemini to wrap the real JSON inside its
        # feedback field. Each method's prompt + schema is fully self-
        # contained now, so a global instruction adds friction not value.
        self.client = GenerativeModel(model_name=GRADER_MODEL)
        # Lighter, faster model used only for question generation.
        self.generator_client = GenerativeModel(model_name=GENERATOR_MODEL)

    def chat(self, message: str, history: list[str]) -> str:
        try:
            input_content = [] 
            
            for role, content in history:
                input_content.append(Content(
                    role=role,
                    parts=[Part.from_text(content)]
                ))
            
            content = Content(
                role="user",
                parts=[Part.from_text(message)]
            )
            input_content.append(content)

            # Generate content using the model
            result = self.client.generate_content(input_content)
            return result.text
        except Exception as e:
            return f"Error generating response: {str(e)}"

    def grade(self, code: str, question: str, lang: str = "en") -> dict:
        """
        Grade Python code against a question using Gemini structured output.
        Returns a guaranteed-shape dict — no regex parsing, no fallback to a
        synthesized "50 / raw exception text" response.

        Args:
            code (str): The Python code to grade
            question (str): The question or problem description
            lang (str): 'en' or 'ko' — language to write the feedback in

        Returns:
            dict: {"grade": int 0-100, "feedback": str (Markdown)}
                  On failure: {"grade": 0, "feedback": <user-friendly error>}
        """
        schema = {
            "type": "OBJECT",
            "properties": {
                "grade": {
                    "type": "INTEGER",
                    "description": "Integer score from 0 to 100 inclusive."
                },
                "feedback": {
                    "type": "STRING",
                    "description": "Markdown-formatted feedback explaining the grade."
                }
            },
            "required": ["grade", "feedback"]
        }

        feedback_lang = (
            "Write the feedback in natural, well-formatted Korean (한국어). "
            "Code identifiers, keywords, and code blocks stay in English; "
            "everything else — explanations, suggestions, headings — in Korean."
            if lang == "ko"
            else "Write the feedback in clear, well-formatted English."
        )

        prompt = f"""Grade this Python code against the question.

Question:
{question}

Code:
{code}

Provide a grade from 0 to 100 and detailed Markdown feedback that explains
the grade — correctness, style, edge cases, and concrete improvements.

{feedback_lang}
"""

        try:
            generation_config = GenerationConfig(
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0.3,
            )
            content = Content(role="user", parts=[Part.from_text(prompt)])
            result = self.client.generate_content(
                [content], generation_config=generation_config
            )
            data = json.loads(result.text)
            # Defensive clamp: Gemini may stray outside 0-100 even with the
            # schema's INTEGER type — keep the score in bounds.
            grade_value = data.get("grade", 0)
            try:
                grade_int = max(0, min(100, int(grade_value)))
            except (TypeError, ValueError):
                grade_int = 0
            return {
                "grade": grade_int,
                "feedback": data.get("feedback", ""),
            }
        except Exception as e:
            # Log the full exception server-side; return a user-safe message.
            print(f"[grade] error: {e}", flush=True)
            return {
                "grade": 0,
                "feedback": (
                    "채점 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                    if lang == "ko"
                    else "Something went wrong while grading. Please try again in a moment."
                ),
            }
    
    def generate_question(self, topic: str, lang: str = "en") -> str:
        """
        Generate a question based on a given topic. Uses the lightweight
        flash-lite model with structured output for fast, deterministic JSON.

        Args:
            topic (str): The topic for the question
            lang (str): 'en' or 'ko' — language the questions should be written in

        Returns:
            str: A randomly selected question from 10 generated questions
        """
        schema = {
            "type": "OBJECT",
            "properties": {
                "questions": {
                    "type": "ARRAY",
                    "min_items": 10,
                    "max_items": 10,
                    "items": {
                        "type": "STRING",
                        "description": "A self-contained Python coding question, under 500 characters."
                    }
                }
            },
            "required": ["questions"]
        }

        lang_directive = (
            "Write every question entirely in natural Korean (한국어). "
            "Python keywords, function names, and any code fragments stay in English; "
            "everything else (prose, examples, instructions) in Korean."
            if lang == "ko"
            else "Write every question in clear English."
        )

        prompt = f"""Generate 10 different Python coding practice questions about the topic below.

Requirements:
- Each question is under 500 characters and self-contained (no external context).
- Vary difficulty: mix easy / medium / harder.
- Vary concepts: avoid all 10 questions testing the same idea.
- {lang_directive}

Topic: {topic}
"""

        try:
            generation_config = GenerationConfig(
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0.9,
            )
            content = Content(role="user", parts=[Part.from_text(prompt)])
            result = self.generator_client.generate_content(
                [content], generation_config=generation_config
            )
            data = json.loads(result.text)
            questions = data.get("questions", []) or []
            if questions:
                return random.choice(questions)
            return "Error: No questions generated"
        except Exception as e:
            return f"Error during question generation: {str(e)}"

    def suggest_youtube_searches(self, question: str, lang: str = "en") -> dict:
        """
        Use Gemini structured output to derive 3 concept-aware YouTube search
        queries for a Python question. Returns smart short queries (3-7 words)
        focused on the underlying concept, not the verbatim question wording.

        Args:
            question: the prompt the learner was graded on
            lang: 'en' or 'ko' — language the queries should be written in

        Returns:
            dict shaped as:
              {
                "topic": "factorial recursion",
                "suggestions": [
                  {"angle": "tutorial",    "query": "python factorial recursion tutorial"},
                  {"angle": "concept",     "query": "recursion vs iteration explained"},
                  {"angle": "walkthrough", "query": "factorial algorithm walkthrough python"},
                ]
              }
        """
        schema = {
            "type": "OBJECT",
            "properties": {
                "topic": {
                    "type": "STRING",
                    "description": "Core programming concept being tested, 2-5 words."
                },
                "suggestions": {
                    "type": "ARRAY",
                    "min_items": 3,
                    "max_items": 3,
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "angle": {
                                "type": "STRING",
                                "enum": ["tutorial", "concept", "walkthrough"],
                                "description": "tutorial = step-by-step intro; concept = explain the idea; walkthrough = solve a similar problem."
                            },
                            "query": {
                                "type": "STRING",
                                "description": "YouTube search query, 3-7 words, focused on the concept not the verbatim prompt."
                            }
                        },
                        "required": ["angle", "query"]
                    }
                }
            },
            "required": ["topic", "suggestions"]
        }

        lang_directive = (
            "Write the queries in Korean (한국어)."
            if lang == "ko"
            else "Write the queries in English."
        )

        prompt = f"""You are helping a learner find YouTube tutorials about a Python problem.

Read the question below and identify the CORE programming concept (e.g., recursion,
binary search, list comprehension, file I/O). Do not echo the verbatim wording —
extract the underlying concept and produce 3 short, search-friendly queries (3-7 words
each), one per angle:

  - tutorial     : a beginner-friendly introduction to the concept
  - concept      : an explainer that builds intuition for why/how it works
  - walkthrough  : a coded walkthrough of a similar problem

{lang_directive}

Question:
{question.strip()}
"""

        try:
            generation_config = GenerationConfig(
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0.4,
            )
            content = Content(role="user", parts=[Part.from_text(prompt)])
            result = self.client.generate_content(
                [content], generation_config=generation_config
            )
            data = json.loads(result.text)
            return data
        except Exception as e:
            # Caller should fall back to client-side templating if this fails.
            return {"error": f"Error generating suggestions: {str(e)}"}