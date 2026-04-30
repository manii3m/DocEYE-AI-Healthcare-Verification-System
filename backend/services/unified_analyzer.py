import os
import io
import json
import base64
from PIL import Image
import numpy as np
import cv2
import google.generativeai as genai

class UnifiedAnalyzer:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            # Using the model that was successfully used earlier
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    async def analyze(self, image_bytes: bytes, report_bytes: bytes = None, report_text: str = None):
        if not self.model:
            return {"error": "Gemini API key not configured."}

        try:
            # 1. Prepare Image
            img = Image.open(io.BytesIO(image_bytes))
            
            # 2. Prepare Report Content
            report_content = []
            if report_bytes:
                if report_bytes.startswith(b'%PDF'):
                    report_content.append({"mime_type": "application/pdf", "data": report_bytes})
                else:
                    try:
                        report_content.append(report_bytes.decode('utf-8'))
                    except:
                        try:
                            report_content.append(Image.open(io.BytesIO(report_bytes)))
                        except:
                            report_content.append("Could not decode report file.")
            elif report_text:
                report_content.append(report_text)

            prompt = """
            You are an expert AI medical auditor for AB PMJAY claims adjudication. 
            Analyze the provided medical image and the medical report together to detect fraud or inconsistencies.
            
            TASKS:
            1. Image Analysis: Detect disease, severity, and specific visual features. Extract any visible date on the scan.
            2. Report Analysis: Extract reported disease, severity, and observations. Extract the report date.
            3. Internal Consistency: Check if the report's observations match its own final conclusion.
            4. Correlation: 
               - Match Status: 'Match', 'Partial', or 'Mismatch'.
               - Timeline Alignment: 'Match' (same date), 'Mismatch' (different dates), or 'Unknown'.
            5. Risk Score: Calculate a fraud risk score from 0 to 100.
            6. Explanation: Provide a 4-5 sentence professional summary for an auditor.

            Return ONLY a JSON object with this EXACT structure:
            {
                "image_analysis": {
                    "predicted_disease": "string",
                    "confidence": float,
                    "severity": "string",
                    "visual_features": "string",
                    "image_date": "string"
                },
                "report_analysis": {
                    "disease": "string",
                    "severity": "string",
                    "observations": ["string"],
                    "report_date": "string",
                    "internal_consistency": "string"
                },
                "correlation": {
                    "match_status": "string",
                    "risk_score": int,
                    "timeline_status": "string",
                    "internal_consistency": "string"
                },
                "explanation": "string"
            }
            """

            response = self.model.generate_content(
                [prompt, img] + (["MEDICAL REPORT:"] + report_content if report_content else []),
                generation_config={"response_mime_type": "application/json"}
            )
            
            data = json.loads(response.text.strip())
            
            # Generate dummy heatmap for UI compatibility
            img_np = np.array(img.convert("L"))
            heatmap_base64 = self._generate_heatmap(img_np)
            data["image_analysis"]["heatmap_base64"] = heatmap_base64
            
            return data

        except Exception as e:
            print(f"Error in Unified Analysis: {e}")
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
        return base64.b64encode(buffer).decode('utf-8')
