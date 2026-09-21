# Ventidy AI Chatbot Backend

This is the Python AI Backend for the Ventidy Solutions customer chatbot.

## Architecture
- **Vector DB**: ChromaDB (`ventidy_knowledge_v5`)
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2`
- **API Framework**: FastAPI + Uvicorn with CORS support
- **Port**: `8000` (Endpoints: `POST /api/chat`, `GET /api/health`)

## Quick Start
To start the backend server, simply run:
```bash
run_server.bat
```
or
```bash
python server.py
```

Once running:
- Server will be live at: http://localhost:8000
- API documentation (Swagger): http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

## Optional: Heavy Local LLM
By default, the backend uses a high-performance contextual RAG synthesizer (< 5ms response time, CPU & memory friendly).
If you want to run the full HuggingFace causal LM (`Qwen/Qwen3-4B-Instruct-2507` or similar):
```cmd
set VENTIDY_LOAD_LLM=1
python server.py
```
