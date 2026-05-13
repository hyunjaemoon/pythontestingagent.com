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
        self.client = GenerativeModel(
            model_name=GRADER_MODEL,
            system_instruction="""
            You are a grader for a python coding test.
            You will be given a python code and a question.
            You will need to grade the code based on the question.
            You will need to return the grade in a json format.
            The json format should be like this:
            {
                "grade": "grade",
                "feedback": "feedback"
            }
            The grade should be a number between 0 and 100.
            The feedback should be a string that explains the grade.
            """
        )
        # Lighter, faster model used only for question generation.
        # No system instruction — the task is fully specified by the prompt
        # and constrained by a response schema.
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
        Grade Python code based on a given question.

        Args:
            code (str): The Python code to grade
            question (str): The question or problem description
            lang (str): 'en' or 'ko' — language to write the feedback in

        Returns:
            dict: Contains 'grade' (int 0-100) and 'feedback' (str)
        """
        try:
            feedback_lang = (
                "Write the feedback in natural, well-formatted Korean (한국어). "
                "Code identifiers, keywords, and code blocks stay in English; "
                "everything else — explanations, suggestions, headings — in Korean."
                if lang == "ko"
                else "Write the feedback in clear, well-formatted English."
            )
            prompt = f"""
            Question: {question}

            Code to grade:
            {code}

            Please grade this code based on the question. Return your response in JSON format with:
            - "grade": a number between 0 and 100
            - "feedback": detailed feedback (Markdown supported) explaining the grade.

            {feedback_lang}
            """
            
            # Use the chat method to get the response
            response = self.chat(prompt, [])
            
            # Try to parse JSON from the response
            import json
            import re
            
            # Look for JSON in the response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                try:
                    result = json.loads(json_match.group())
                    return result
                except json.JSONDecodeError:
                    pass
            
            # If JSON parsing fails, create a structured response
            return {
                "grade": 50,  # Default grade
                "feedback": response
            }
            
        except Exception as e:
            return {
                "grade": 0,
                "feedback": f"Error during grading: {str(e)}"
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