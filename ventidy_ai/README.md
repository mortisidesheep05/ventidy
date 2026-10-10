# Ventidy AI Chatbot Backend (Lightweight Production)

Lightweight, production-ready AI backend for the Ventidy Solutions customer chatbot.

## Architecture
- **Knowledge Base**: `knowledge.json` (Structured company profile, services, contact, hours, coverage)
- **Engine**: Lightweight multi-stage retrieval with exact/phrase, token overlap, difflib fuzzy matching, and negative guardrails. Zero heavy ML dependencies (no PyTorch, Transformers, SentenceTransformers, or ChromaDB required).
- **Optional LLM**: Supports external OpenAI/Groq/Gemini API via `VENTIDY_LLM_API_KEY` (runs 100% locally with 0ms latency when unset).
- **API Framework**: FastAPI + Uvicorn with CORS support
- **Port**: `8000` (Endpoints: `POST /api/chat`, `GET /api/health`, `GET /health`)

## Quick Start
```bash
pip install -r requirements.txt
python server.py
```
or run with uvicorn:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

Once running:
- Server: http://localhost:8000
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health
- Chat endpoint: `POST http://localhost:8000/api/chat` with `{"message": "What services do you provide?"}`
