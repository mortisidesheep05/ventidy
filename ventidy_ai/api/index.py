import os
import sys

# Ensure parent directory (ventidy_ai root) is in Python's search path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import the FastAPI application from server.py
from server import app
