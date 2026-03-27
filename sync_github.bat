@echo off
echo ===========================================
echo 🚀 KHOI DONG DONG BO THAY DOI LEN GITHUB
echo ===========================================

git add .
set /p commitMsg="Nhap Nhan cho Lan Cap Nhat Nay (vd: Fix Bug X): "
if "%commitMsg%"=="" set commitMsg="Auto-update XScout-AI codebase"

git commit -m "%commitMsg%"
echo ⏳ Dang bom Source Code len GitHub...
git push

echo ===========================================
echo 🎉 DA DAY THANH CONG! MA NGUON DA DUOC LUU.
echo ===========================================
pause
