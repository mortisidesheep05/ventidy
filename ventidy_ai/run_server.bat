@echo off
title Ventidy AI Chatbot Backend Server
echo ========================================================
echo Starting Ventidy AI Chatbot Server...
echo API URL: http://localhost:8000
echo Docs:    http://localhost:8000/docs
echo ========================================================
echo.

set HF_HUB_OFFLINE=1
set TRANSFORMERS_OFFLINE=1
set HF_HUB_DISABLE_SYMLINKS_WARNING=1

cd /d "%~dp0"
python server.py

pause
