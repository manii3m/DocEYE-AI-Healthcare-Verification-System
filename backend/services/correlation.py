class CorrelationEngine:
    def __init__(self):
        # Mapping common terms to standardize comparisons
        self.disease_synonyms = {
            "pneumonia": ["pneumonia", "consolidation", "infiltrate"],
            "cardiomegaly": ["cardiomegaly", "enlarged heart"],
            "effusion": ["effusion", "pleural effusion"],
            "normal": ["normal", "no abnormality", "clear"]
        }

    def _normalize_disease(self, disease_str: str):
        if not disease_str:
            return "unknown"
        ds = disease_str.lower()
        for key, synonyms in self.disease_synonyms.items():
            if any(syn in ds for syn in synonyms):
                return key
        return ds

    def correlate(self, image_data: dict, report_data: dict):
        img_disease = self._normalize_disease(image_data.get("predicted_disease", ""))
        img_severity = image_data.get("severity", "unknown")
        
        rep_disease = self._normalize_disease(report_data.get("disease", ""))
        rep_severity = report_data.get("severity", "unknown").lower()
        
        img_date = image_data.get("image_date", "Unknown")
        rep_date = report_data.get("report_date", "Unknown")
        internal_consistency = report_data.get("internal_consistency", "Unknown")
        
        match_status = "Mismatch"
        risk_score = 90  # Default high risk
        timeline_status = "Unknown"
        
        if img_date != "Unknown" and rep_date != "Unknown":
            if img_date == rep_date:
                timeline_status = "Match"
            else:
                timeline_status = "Mismatch"
        
        # 1. Check Disease Match
        disease_match = (img_disease == rep_disease) or (img_disease in rep_disease) or (rep_disease in img_disease)
        
        if disease_match:
            # 2. Check Severity Match
            if img_severity == rep_severity:
                match_status = "Match"
                risk_score = 15 # Low risk
            else:
                match_status = "Partial"
                risk_score = 50 # Medium risk
        else:
            match_status = "Mismatch"
            risk_score = 95 # High risk
            
        # Adjust risk score based on timeline and consistency
        if timeline_status == "Mismatch":
            risk_score += 20
        if "Inconsistent" in internal_consistency:
            risk_score += 20
            
        # Cap risk score at 100
        risk_score = min(risk_score, 100)
            
        return {
            "match_status": match_status,
            "risk_score": risk_score,
            "image_normalized_disease": img_disease,
            "report_normalized_disease": rep_disease,
            "timeline_status": timeline_status,
            "internal_consistency": internal_consistency
        }
