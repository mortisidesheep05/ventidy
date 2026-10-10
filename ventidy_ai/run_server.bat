@echo off
title Ventidy AI Chatbot Backend Server
echo ========================================================
echo Starting Ventidy AI Lightweight Chatbot Server...
echo API URL: http://localhost:8000
echo Docs:    http://localhost:8000/docs
echo ========================================================
echo.

cd /d "%~dp0"
python server.py

pause
