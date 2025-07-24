from vertexai.generative_models import Part, Content, GenerativeModel
import vertexai

MODEL_NAME = "gemini-2.5-flash"

vertexai.init(project="python-testing-agent", location="us-central1")


class PythonTestingAgent:
    def __init__(self):
        self.client = GenerativeModel(
            model_name=MODEL_NAME, 
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

    def grade(self, code: str, question: str) -> dict:
        """
        Grade Python code based on a given question.
        
        Args:
            code (str): The Python code to grade
            question (str): The question or problem description
            
        Returns:
            dict: Contains 'grade' (int 0-100) and 'feedback' (str)
        """
        try:
            # Create a prompt for grading
            prompt = f"""
            Question: {question}
            
            Code to grade:
            {code}
            
            Please grade this code based on the question. Return your response in JSON format with:
            - "grade": a number between 0 and 100
            - "feedback": detailed feedback explaining the grade
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