import os
import google.generativeai as genai

class ExplainabilityEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    async def generate_explanation(self, image_result: dict, report_data: dict, correlation_result: dict):
        if not self.model:
            return "Explainability engine is offline due to missing Gemini API Key."
            
        img_disease = image_result.get("predicted_disease", "Unknown")
        img_conf = image_result.get("confidence", 0.0)
        img_sev = image_result.get("severity", "Unknown")
        img_features = image_result.get("visual_features", "None")
        
        rep_disease = report_data.get("disease", "Unknown")
        rep_sev = report_data.get("severity", "Unknown")
        rep_obs = report_data.get("observations", [])
        
        match_status = correlation_result.get("match_status", "Unknown")
        risk_score = correlation_result.get("risk_score", 0)
        timeline_status = correlation_result.get("timeline_status", "Unknown")
        internal_consistency = correlation_result.get("internal_consistency", "Unknown")
        
        prompt = f"""
        You are an expert AI medical auditor. Your job is to explain the verification result of a medical image against a text report in clear, concise, and professional language understandable by a human auditor.
        
        Verification Result: {match_status}
        Fraud Risk Score: {risk_score}/100
        Timeline Alignment: {timeline_status}
        Report Internal Consistency: {internal_consistency}
        
        --- AI Image Analysis ---
        Predicted Disease: {img_disease} (Confidence: {img_conf:.2%})
        Estimated Severity: {img_sev}
        Visual Features Observed: {img_features}
        
        --- Medical Report Analysis ---
        Reported Disease: {rep_disease}
        Reported Severity: {rep_sev}
        Key Observations: {', '.join(rep_obs)}
        
        Provide a 4-5 sentence explanation. 
        Structure it clearly:
        1. State whether the visual evidence in the image supports the written report's conclusion.
        2. Briefly explain why based on the specific visual features vs the report's observations.
        3. Note any issues with timeline alignment or the report's internal consistency.
        4. Conclude with why the specific risk score makes sense.
        Do NOT include any preamble or extra formatting. Just the explanation.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating explanation: {e}")
            return "An error occurred while generating the explanation."
