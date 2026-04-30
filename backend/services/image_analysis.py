import io
import base64
from PIL import Image
import numpy as np
import cv2
import os
import json
import google.generativeai as genai

class ImageAnalyzer:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            print("WARNING: GEMINI_API_KEY not found in environment. Image analysis will fail.")
            self.model = None

    async def analyze(self, image_bytes: bytes):
        try:
            img = Image.open(io.BytesIO(image_bytes))
            
            if not self.model:
                raise ValueError("Gemini API not configured.")

            prompt = """
            You are an expert radiologist. Analyze this medical image (it could be an X-ray, Ultrasound, CT, MRI, etc.).
            Extract the following structured information.
            Return ONLY a JSON object with this exact structure:
            {
                "predicted_disease": "primary diagnosis or condition name (e.g. pneumonia, normal, fracture, unknown)",
                "confidence": 0.95, // Estimated float between 0.0 and 1.0 based on how clear the image is
                "severity": "mild, moderate, severe, or unknown",
                "visual_features": "Detailed description of the condition-relevant visual features observed in the image (e.g. 'opacity seen in lower left lobe', 'image is clear')",
                "image_date": "YYYY-MM-DD or Unknown (read any date visible on the scan, otherwise output Unknown)"
            }
            """
            
            response = self.model.generate_content(
                [prompt, img],
                generation_config={"response_mime_type": "application/json"}
            )
            response_text = response.text
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
                
            data = json.loads(response_text.strip())
            
            # For fallback UI
            img_np = np.array(img.convert("L"))
            heatmap_base64 = self._generate_heatmap(img_np)
            
            return {
                "predicted_disease": data.get("predicted_disease", "Unknown"),
                "confidence": float(data.get("confidence", 0.8)),
                "severity": data.get("severity", "Unknown"),
                "visual_features": data.get("visual_features", "No details extracted"),
                "image_date": data.get("image_date", "Unknown"),
                "heatmap_base64": heatmap_base64
            }
            
        except Exception as e:
            print(f"Error in image analysis: {e}")
            raise e

    def _generate_heatmap(self, original_img_np):
        img_resized = cv2.resize(original_img_np, (224, 224))
        heatmap = np.zeros_like(img_resized, dtype=np.float32)
        cv2.circle(heatmap, (112, 112), 80, 1.0, -1)
        heatmap = cv2.GaussianBlur(heatmap, (51, 51), 0)
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
        img_colored = cv2.cvtColor(img_resized, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(img_colored, 0.6, heatmap_colored, 0.4, 0)
        _, buffer = cv2.imencode('.jpg', overlay)
        base64_str = base64.b64encode(buffer).decode('utf-8')
        return base64_str
