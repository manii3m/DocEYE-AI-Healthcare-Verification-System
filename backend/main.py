import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from services.unified_analyzer import UnifiedAnalyzer

load_dotenv()

app = FastAPI(title="DocEYE AI API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
unified_analyzer = None

@app.on_event("startup")
async def startup_event():
    global unified_analyzer
    unified_analyzer = UnifiedAnalyzer()

@app.post("/analyze")
async def analyze_medical_data(
    image: UploadFile = File(...),
    report_file: UploadFile = File(None),
    report_text: str = Form(None)
):
    try:
        # 1. Read Inputs
        image_bytes = await image.read()
        
        report_bytes = None
        if report_file:
            report_bytes = await report_file.read()
            
        if not report_bytes and not report_text:
            raise HTTPException(status_code=400, detail="Must provide either report_file or report_text")

        # 2. Unified Analysis (1-Call Strategy)
        result = await unified_analyzer.analyze(
            image_bytes=image_bytes, 
            report_bytes=report_bytes, 
            report_text=report_text
        )
        
        return result

    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
