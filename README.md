# 🏥 DocEYE AI

<img width="1763" height="1721" alt="image" src="https://github.com/user-attachments/assets/16647f21-dfd1-4e3d-8fd7-f4f6671179e4" />



<p align="center">
  <a href="https://github.com/doceye-ai/doceye-ai/stargazers"><img src="https://img.shields.io/github/stars/doceye-ai/doceye-ai?style=flat&color=00d4ff" alt="GitHub Stars"></a>
  <a href="https://github.com/doceye-ai/doceye-ai/blob/main/LICENSE"><img src="https://img.shields.io/github/license/doceye-ai/doceye-ai?style=flat&color=7c3aed" alt="License"></a>
  <img src="https://img.shields.io/python-version/3.9%2B?color=00d4ff" alt="Python">
  <img src="https://img.shields.io/react-version/18.2?color=00d4ff" alt="React">
  <img src="https://img.shields.io/badge/status-Active-brightgreen?style=flat" alt="Status">
</p>

---

## 🚀 Enterprise-Grade AI for Medical Document Verification

> *"Transforming healthcare fraud detection with intelligent AI analysis — one document at a time."*

DocEYE AI is a cutting-edge artificial intelligence system designed to analyze medical documents (X-rays, reports, scans) and generate intelligent insights, fraud risk assessments, and consistency evaluations. Built for healthcare providers, insurance auditors, and government health schemes like **Ayushman Bharat PMJAY**, DocEYE brings enterprise-grade automation to medical document verification.

---

## 🧠 Why DocEYE AI?

The Indian healthcare ecosystem processes millions of insurance claims annually through schemes like **Ayushman Bharat PMJAY**. Manual verification is:

- ❌ **Time-consuming** — Hours spent per claim
- ❌ **Error-prone** — Human fatigue leads to missed inconsistencies
- ❌ **Inconsistent** — Varying standards across auditors

**DocEYE AI solves this by providing:**

| Capability | Benefit |
|------------|---------|
| ⚡ **Instant Analysis** | Process documents in seconds, not hours |
| 🎯 **Consistent Standards** | AI-driven evaluation eliminates human variability |
| 🛡️ **Fraud Detection** | Identify discrepancies between image and report data |
| 📊 **Risk Scoring** | Quantified fraud risk scores (0-100) |
| 📈 **Timeline Tracking** | Historical analysis with trend visualization |

---

## ✨ Key Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| 🖼️ **Multi-Modal Analysis** | Simultaneously analyze medical images (X-rays, CT scans) and textual reports |
| 🔍 **Fraud Detection Engine** | Detect inconsistencies between visual findings and reported diagnoses |
| 📅 **Timeline Engine** | Track all analysis history with trend visualization and pattern recognition |
| ⚖️ **Consistency Engine** | Real-time anomaly detection with smart alerts and recommendations |
| 🎨 **Interactive Dashboard** | Modern, responsive UI with glassmorphism design and smooth animations |
| 📊 **Risk Scoring** | Quantified fraud risk scores (0-100) with detailed breakdowns |
| 🗺️ **Heatmap Visualization** | Visual overlays on medical images highlighting detected features |
| 🔗 **RESTful API** | FastAPI-powered backend for seamless integration |

### Standout Innovations

- **Unified Analysis Pipeline** — Single endpoint processes both images and reports together
- **Internal Consistency Check** — Validates report observations against final conclusions
- **Timeline Alignment** — Verifies date consistency between scan and report
- **Pattern Recognition** — Identifies recurring fraud patterns across batches

---

## 🧩 Timeline & Consistency Engine

DocEYE's **Timeline & Consistency Engine** is its crown jewel — a premium feature that sets it apart from conventional document analysis tools.

### 📅 Timeline Engine

| Metric | Description |
|--------|-------------|
| 📊 **Analysis History** | Track all document analyses in chronological order |
| 📈 **Risk Trends** | Visualize risk score trends over time |
| 🔄 **Pattern Detection** | Identify patterns in fraud attempts |
| 📤 **Export** | Export historical data for audits |

**Key Metrics:**
- Average Risk Score
- Match/Mismatch Rate
- Confidence Trends
- Volatility Analysis

### ⚖️ Consistency Engine

| Check | Description |
|-------|-------------|
| ✓ **Image-Report Correlation** | Validate findings match claims |
| ✓ **Date Alignment** | Verify scan and report dates match |
| ✓ **Internal Consistency** | Check report observations vs conclusions |
| ✓ **Confidence-Based Alerts** | Recommend manual review when needed |

**Anomaly Types Detected:**
- 🔴 **Critical** — Image findings contradict report claims
- 🟡 **Warning** — Date misalignment between scan and report
- 🟠 **Alert** — Report contains internal contradictions
- 🔵 **Info** — Low AI confidence — manual review recommended

---

## 🏗️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6F61?style=for-the-badge&logo=recharts&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

### Infrastructure

| Component | Technology |
|-----------|------------|
| API Framework | FastAPI (Python) |
| AI Model | Google Gemini 2.5 Flash |
| Image Processing | OpenCV, Pillow, NumPy |
| OCR | Tesseract (optional) |
| Deployment | Docker-ready |

---

## ⚙️ How It Works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   1. UPLOAD  │ →  │   2. PROCESS  │ →  │   3. ANALYZE │ →  │   4. INSIGHTS│
│              │    │              │    │              │    │              │
│  Medical     │    │  AI extracts  │    │  Correlation │    │  Risk Score  │
│  Image +     │    │  features &  │    │  & Consistency│   │  Timeline    │
│  Report      │    │  text data   │    │  Engine      │    │  Dashboard   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Step-by-Step Flow

1. **📤 Upload Document**
   - Drag & drop medical images (X-ray, CT, MRI)
   - Upload supporting reports (PDF, text)
   - Or paste report text directly

2. **🧠 AI Processing**
   - Image analysis using computer vision
   - Text extraction from reports
   - Feature mapping and pattern detection

3. **🔗 Correlation Engine**
   - Match image findings with report claims
   - Verify date alignment
   - Check internal consistency

4. **📊 Generate Insights**
   - Fraud risk score (0-100)
   - Match/Partial/Mismatch status
   - Detailed explanation for auditors

5. **📈 Timeline & Consistency**
   - Add to analysis history
   - Visualize trends
   - Detect anomalies in real-time

---

## 📸 UI Preview

> *Add your screenshots to `/docs/screenshots/` and reference them here*

```text
┌────────────────────────────────────────────────────────────────────────┐
│                         DocEYE AI Dashboard                           │
├────────────────────────────────────────────────────────────────────────┤
│   ┌──────────────────┐    ┌──────────────────┐    ┌────────────────┐ │
│   │   📊 Risk Score  │    │  🔍 Consistency   │    │  📈 Trends     │ │
│   │       67/100     │    │      85%          │    │    ↑ +12      │ │
│   └──────────────────┘    └──────────────────┘    └────────────────┘ │
│   ┌────────────────────────────────────────────────────────────────┐  │
│   │                    Timeline Chart                             │  │
│   │    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     │  │
│   └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+
- Python 3.9+
- Google Gemini API Key

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/doceye-ai/doceye-ai.git
cd doceye-ai

# 2. Backend Setup
cd backend

# Create virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend server
uvicorn main:app --reload --port 8000

# 3. Frontend Setup (new terminal)
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

```env
# Backend (.env)
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Analyze medical image and/or report |
| `GET` | `/health` | Health check endpoint |

---

## 📊 Use Cases

| User | Use Case |
|------|----------|
| 🏥 **Healthcare Providers** | Verify authenticity of patient documents, speed up insurance claim processing |
| 👨‍⚕️ **Medical Auditors** | Get instant fraud risk assessments, focus on high-risk claims |
| 🎓 **Students & Researchers** | Study AI in healthcare applications, explore fraud detection patterns |
| 🏛️ **Government Schemes (PMJAY)** | Scale claim verification efficiently, detect fraudulent submissions |
| 🤖 **AI Enthusiasts** | Learn multi-modal AI implementation, contribute to open-source healthcare AI |

---

## 🌍 SEO Keywords

```
ai healthcare, medical report analysis ai, x-ray ai detection, 
fraud detection healthcare, ai insurance verification, 
ayushman bharat pmjay, medical document automation, 
ai claims adjudication, healthcare ai system, 
medical image analysis, intelligent document processing, 
ai fraud prevention
```

---

## 🎯 Future Improvements

- [ ] **Multi-Language Support** — Hindi, regional languages for rural adoption
- [ ] **Mobile App** — React Native/Flutter for field auditors
- [ ] **Batch Processing** — Analyze multiple documents simultaneously
- [ ] **Blockchain Integration** — Immutable audit trails
- [ ] **Custom Model Training** — Fine-tune for specific hospital datasets
- [ ] **WhatsApp Integration** — Submit claims via WhatsApp
- [ ] **Offline Mode** — Process without internet connectivity
- [ ] **Export to PDF** — Generate detailed audit reports

---

## 🤝 Contribution

We welcome contributions! Here's how you can help:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add some amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Contribution Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation for changes
- Be respectful and constructive in discussions

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```text
MIT License
Copyright (c) 2024 DocEYE AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 💡 Final Impact

> **DocEYE AI isn't just a tool — it's a movement toward transparent, efficient, and fraud-free healthcare.**

By combining the power of artificial intelligence with domain expertise in healthcare verification, DocEYE is helping:

- ✅ **Save millions** in fraudulent insurance claims
- ✅ **Empower auditors** with instant, consistent insights
- ✅ **Build trust** in government healthcare schemes
- ✅ **Pioneer** the future of AI in healthcare

---

<p align="center">
  <a href="https://github.com/doceye-ai/doceye-ai/stargazers">⭐ Star us on GitHub</a>
  <br><br>
  Built with ❤️ using FastAPI, React, and Google Gemini AI
</p>
