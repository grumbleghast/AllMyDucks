@echo off
echo Setting up GitHub repository connection...
git remote remove origin
git remote add origin https://github.com/grumbleghast/AllMyDucks.git
echo.
echo Verifying remote:
git remote -v
echo.
pause 