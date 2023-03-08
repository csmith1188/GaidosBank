@echo off
setlocal
set iface=Ethernet
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"%iface%" /c:"IPv4"') do set ip=%%a
set "ip=%ip:~1%"
endlocal & set ip=%ip%
IF NOT EXIST node_modules (
  npm i
)
npx next dev -H %ip%