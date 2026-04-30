import os
import json
import io
from PIL import Image
import google.generativeai as genai

class ReportAnalyzer:
    def __init__(self):
        # Configure Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            print("WARNING: GEMINI_API_KEY not found in environment. NLP features will fail.")
            self.model = None

    async def analyze_file(self, file_bytes: bytes):
        try:
            # Try to open as image for Gemini Vision
            img = Image.open(io.BytesIO(file_bytes))
            return await self._analyze_with_gemini(img)
        except Exception as e:
            # If not an image, try as text or PDF
            print(f"File is not an image, trying as text: {e}")
            
            # Check for PDF magic bytes
            if file_bytes.startswith(b'%PDF'):
                print("File identified as PDF, sending to Gemini as application/pdf")
                return await self._analyze_with_gemini({"mime_type": "application/pdf", "data": file_bytes})
                
            try:
                text = file_bytes.decode('utf-8')
                return await self.analyze_text(text)
            except Exception as inner_e:
                raise ValueError(f"Could not extract text from the provided file: {inner_e}. Please upload an image, a PDF, or a plain text file.")

    async def analyze_text(self, text: str):
        return await self._analyze_with_gemini(text)

    async def _analyze_with_gemini(self, input_data):
        if not self.model:
            return {"disease": "Unknown", "severity": "Unknown", "observations": ["Gemini API not configured"]}
            
        prompt = """
        Extract the following structured information from the medical report provided.
        Return ONLY a JSON object with this exact structure:
        {
            "disease": "primary diagnosis or disease name",
            "severity": "mild, moderate, or severe",
            "observations": ["key finding 1", "key finding 2"],
            "report_date": "YYYY-MM-DD or Unknown (extract the date the report was written/issued)",
            "internal_consistency": "Consistent / Inconsistent: [Reason] (Evaluate if the observations described match the final conclusion/diagnosis. Output 'Consistent' if they match, or 'Inconsistent: <reason>' if there is a contradiction)"
        }
        """
        
        try:
            response = self.model.generate_content(
                [prompt, input_data],
                generation_config={"response_mime_type": "application/json"}
            )
            # Clean up the response to extract JSON
            response_text = response.text
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
                
            data = json.loads(response_text.strip())
            return data
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return {"disease": "Error parsing", "severity": "Unknown", "observations": [str(e)]}
