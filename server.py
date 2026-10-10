import os
import sys

# Ensure current directory and api directory are in sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
api_dir = os.path.join(root_dir, "api")
for p in [root_dir, api_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

import uvicorn
from api.index import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"[Ventidy AI] Starting local development server on http://127.0.0.1:{port}...")
    uvicorn.run("api.index:app", host="127.0.0.1", port=port, reload=True)
