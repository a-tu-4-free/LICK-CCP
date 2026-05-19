@echo off
chcp 65001 >nul
title 舔共黨系統 // LICK-CCP CORE

echo.
echo  ██████████████████████████████████████
echo  ██  舔共黨系統 // 統戰器官銀行      ██
echo  ██  LICK-CCP CORE  本地端啟動       ██
echo  ██████████████████████████████████████
echo.

:: 嘗試 Python 3
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [✓] 偵測到 Python，啟動伺服器...
    echo  [★] 請用瀏覽器開啟：http://localhost:8080
    echo  [!] 關閉此視窗即停止伺服器
    echo.
    start "" http://localhost:8080
    python -m http.server 8080
    goto end
)

:: 嘗試 Python 3 別名
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [✓] 偵測到 Python，啟動伺服器...
    echo  [★] 請用瀏覽器開啟：http://localhost:8080
    echo  [!] 關閉此視窗即停止伺服器
    echo.
    start "" http://localhost:8080
    py -m http.server 8080
    goto end
)

:: 嘗試 Node.js npx serve
npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [✓] 偵測到 Node.js，啟動伺服器...
    echo  [★] 請用瀏覽器開啟：http://localhost:8080
    echo  [!] 關閉此視窗即停止伺服器
    echo.
    start "" http://localhost:8080
    npx serve -p 8080 .
    goto end
)

:: 都沒有 → 提示
echo  [✗] 找不到 Python 或 Node.js
echo.
echo  請安裝以下其中一個：
echo  Python : https://www.python.org/downloads/
echo  Node.js: https://nodejs.org/
echo.
echo  安裝完成後重新執行此檔案。
echo.
pause

:end