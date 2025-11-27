@echo off
echo ========================================
echo   Starting Local Server for FinnTang
echo ========================================
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python found! Starting server...
    echo.
    echo Server will run at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else (
    echo ✗ Python not found!
    echo.
    echo Please install Python or use one of these alternatives:
    echo 1. VSCode Live Server extension
    echo 2. Node.js http-server: npm install -g http-server
    echo.
    echo See START_SERVER.md for detailed instructions
    pause
)

