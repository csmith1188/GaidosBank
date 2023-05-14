@echo off

:: Check if the local repository is a Git repository
git rev-parse --verify HEAD 2> nul
if errorlevel 1 (
	git clone https://github.com/Ryan24313/GaidosBank .\temp
  xcopy /E /H /Y .\temp\* .
  rmdir /S /Q .\temp
  echo cloned
)

:: Get the current and latest versions of the repository
set currentVersion=
for /f "tokens=*" %%a in ('git rev-parse HEAD') do set currentVersion=%%a
set latestVersion=
for /f "tokens=*" %%a in ('git rev-parse origin/main') do set latestVersion=%%a
echo version

:: Check if an update is needed for Git or npm packages
set gitUpdate=false
if "%currentVersion%"=="%latestVersion%" (
	set gitUpdate=false
) else (
	set gitUpdate=true
)
echo gitUpdate %gitUpdate%

:checkNpmUpdate
set npmUpdate=false
for /f "tokens=*" %%a in ('npm list --depth=0 --parseable^| findstr /V /C:"node_modules"') do set npmUpdate=true
echo npmUpdate %npmUpdate%

:: Determine if an update is required
set update=false
if "%gitUpdate%"=="true" (
  set update=true
)
if "%npmUpdate%"=="true" (
  set update=true
)
echo gitUpdate %gitUpdate% npmUpdate %npmUpdate% update %update%

:: Perform the update if necessary
if "%update%"=="true" (
  echo is update
	set /P updateRequested="There is a newer version available, do you want to update? (yes/no) "
	:checkUpdateRequested
  echo %updateRequested%
	if /I "%updateRequested%"=="yes" (
    if "%gitUpdate%" == "true" (
		  git clone https://github.com/Ryan24313/GaidosBank
    )
    goto :updateLoop
	) else if /I "%updateRequested%"=="y" (
		if "%gitUpdate%" == "true" (
		  git clone https://github.com/Ryan24313/GaidosBank
    )
    goto :updateLoop
	) else if /I "%updateRequested%"=="no" (
		goto :skipUpdate
	) else if /I "%updateRequested%"=="n" (
		goto :skipUpdate
	) else (
		set /P updateRequested="You did not input yes or no. Please input yes or no. "
		goto :checkUpdateRequested
	)
	:updateLoop
	if "%npmUpdate%"=="true" (
		npm install
		goto :checkNpmUpdate
	) else (
		npx next build
		goto :skipUpdate
	)
)

:: Update the database schema and start the Next.js server
:skipUpdate
setlocal enabledelayedexpansion
if not exist "database.db" (
    copy databaseTemplate.db database.db
)
copy database.db databaseBackup.db
sqlite3.exe databaseTemplate.db ".schema" > schema.sql
sqlite3.exe updatedDatabase.db < schema.sql
sqlite3.exe updatedDatabase.db "ATTACH DATABASE 'database.db' AS old_db"
for /f "usebackq delims=" %%i in (`sqlite3.exe -cmd "ATTACH DATABASE 'database.db' AS old_db" updatedDatabase.db "SELECT name FROM old_db.sqlite_master WHERE type='table'"`) do (
    set "table_name=%%i"
    if not "!table_name!"=="" (
        sqlite3.exe -cmd "ATTACH DATABASE 'database.db' AS old_db" updatedDatabase.db "INSERT OR IGNORE INTO !table_name! SELECT * FROM old_db.!table_name!"
    )
)
sqlite3.exe updatedDatabase.db "DETACH DATABASE old_db"
sqlite3.exe updatedDatabase.db ".quit"
move /Y updatedDatabase.db database.db
del schema.sql

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4 Address"') do (
    for /f "tokens=1 delims= " %%b in ("%%a") do set ip=%%b
)
npx next start -H "%ip%"