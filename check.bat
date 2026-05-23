@echo off
echo ========================================
echo       AAYUH Health Check
echo ========================================

echo.
echo Checking tools...

node --version > nul 2>&1
if errorlevel 1 (echo ❌ Node.js missing!) else (echo ✅ Node.js OK)

npx cap --version > nul 2>&1
if errorlevel 1 (echo ❌ Capacitor missing!) else (echo ✅ Capacitor OK)

firebase --version > nul 2>&1
if errorlevel 1 (echo ❌ Firebase missing!) else (echo ✅ Firebase OK)

if exist android (echo ✅ Android folder OK) else (echo ❌ Android folder missing!)
if exist www (echo ✅ www folder OK) else (echo ❌ www folder missing!)
if exist node_modules (echo ✅ node_modules OK) else (echo ❌ Run restore.bat!)
if exist capacitor.config.json (echo ✅ Capacitor config OK) else (echo ❌ Config missing!)
if exist package.json (echo ✅ package.json OK) else (echo ❌ package.json missing!)
if exist .firebaserc (echo ✅ Firebase config OK) else (echo ❌ Firebase not configured!)

echo.
echo ========================================
echo If anything shows ❌ run restore.bat!
echo ========================================
pause