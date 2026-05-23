@echo off
echo ========================================
echo       AAYUH Restore Script
echo ========================================

echo.
echo [1/8] Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo Node.js not found!
    echo Please install from nodejs.org first
    pause
    exit
)
echo Node.js OK!

echo.
echo [2/8] Installing npm packages...
npm install
echo Done!

echo.
echo [3/8] Installing Capacitor...
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/app
echo Done!

echo.
echo [4/8] Installing Capgo updater...
npm install @capgo/capacitor-updater
npm install -g @capgo/cli
echo Done!

echo.
echo [5/8] Installing Firebase tools...
npm install -g firebase-tools
echo Done!

echo.
echo [6/8] Recreating www folder if missing...
if not exist www mkdir www
xcopy *.html www\ /Y /Q 2>nul
xcopy *.css www\ /Y /Q 2>nul
xcopy *.js www\ /Y /Q 2>nul
echo Done!

echo.
echo [7/8] Syncing Capacitor...
npx cap sync
echo Done!

echo.
echo [8/8] Recreating Android folder if missing...
if not exist android (
    echo Android folder missing - recreating...
    npx cap add android
    echo Android folder recreated!
) else (
    echo Android folder exists!
)

echo.
echo ========================================
echo RESTORE COMPLETE!
echo.
echo Next steps:
echo 1. Run: npx @capgo/cli login YOUR_API_KEY
echo 2. Open Android Studio: npx cap open android
echo 3. Build APK in Android Studio
echo ========================================
pause