@echo off
echo ========================================
echo       AAYUH Update Script
echo ========================================

echo.
echo [1/6] Copying files to www...
xcopy D:\AAYUH\*.html D:\AAYUH\www\ /Y /Q
xcopy D:\AAYUH\*.css D:\AAYUH\www\ /Y /Q
xcopy D:\AAYUH\*.js D:\AAYUH\www\ /Y /Q
xcopy D:\AAYUH\icons D:\AAYUH\www\icons\ /E /I /Y /Q
echo Done!

echo.
echo [2/6] Syncing Capacitor...
npx cap sync
echo Done!

echo.
echo [3/6] Uploading to Capgo (APK users get update)...
npx @capgo/cli bundle upload
echo Done!

echo.
echo [4/6] Deploying to Firebase (Website update)...
firebase deploy --only hosting
echo Done!

echo.
echo [5/6] Backing up to GitHub...
git add .
git commit -m "Update %date% %time%"
git push
echo Done!

echo.
echo [6/6] Summary:
echo ✅ Website updated at aayuh.web.app
echo ✅ APK users get auto update
echo ✅ GitHub backup saved
echo ========================================
echo ALL DONE! Press any key to close.
pause > nul