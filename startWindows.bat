@echo off

set gitUrl=https://github.com/csmith1188/GaidosBank
goto :main

:: Check if npm packages need to be updated
:checkNpmUpdate
	set npmUpdate=false
	for /f "delims=" %%i in ('npm outdated --parseable 2^>nul') do set npmUpdate=true
exit /b 0

:: Run the update process
:runUpdate
	if "%gitUpdate%" equ true (
  	git.exe fetch
  	git.exe pull

  	:: Update the database schema
		sqlite3.exe databaseTemplate.db ".schema" > schema.sql
  	sqlite3.exe updatedDatabase.db < schema.sql
  	for /f "delims=" %%i in ('sqlite3.exe -cmd "ATTACH DATABASE 'database.db' AS old_db" updatedDatabase.db "SELECT name FROM old_db.sqlite_master WHERE type='table'"') do (
  		sqlite3.exe -cmd "ATTACH DATABASE 'database.db' AS old_db" updatedDatabase.db "INSERT OR IGNORE INTO %%i SELECT * FROM old_db.%%i"
		)
  	sqlite3.exe updatedDatabase.db "DETACH DATABASE old_db"
  	sqlite3.exe updatedDatabase.db ".quit"
  	move /y "updatedDatabase.db" "database.db"
  	del schema.sql
	)

		:npmUpdateLoop
		if "%npmUpdate%"==true (
			npm install
			npm audit fix
			call :checkNpmUpdate
			goto :npmUpdateLoop
		)
		npx next build
exit /b 0

:main

:: Check if the current directory is a Git repository
set isGit=false
for /f "delims=" %%i in ('git rev-parse --is-inside-work-tree') do set "isGit=%%i"
if %isGit% neq true (
		:: Clone the repository into a temporary directory
		git clone %gitUrl% temp

		:: Copy the contents of the temporary directory to the current directory
		xcopy /e /h /y .\temp\* .

		:: Remove the temporary directory
		rmdir /s /q "temp"
)

:: Create a new database if it doesn't exist
if not exist "database.db" copy "databaseTemplate.db" "database.db"

:: Backup the existing database
copy "database.db" "databaseBackup.db"

:: Get the current and latest version of the repository
for /f "delims=" %%i in ('git.exe rev-parse HEAD') do set "currentVersion=%%i"
for /f "delims=" %%i in ('git.exe rev-parse origin/main') do set "latestVersion=%%i"

:: Check if the repository needs to be updated
if "%currentVersion%" neq "%latestVersion%" (
    set gitUpdate=true
) else (
    set gitUpdate=false
)

call :checkNpmUpdate

:: Determine if an update is required
set update=false
if "%gitUpdate%"==true (
  set update=true
)
if "%npmUpdate%"==true (
  set update=true
)

:: Perform the update if necessary
if "%update%"==true (
	set /P updateRequested="There is a newer version available, do you want to update? (yes/no) "
	:checkUpdateRequested
	if /I "%updateRequested%"=="yes" (
    call :runUpdate
	) else if /I "%updateRequested%"=="y" (
    call :runUpdate
	) else if /I "%updateRequested%"=="no" (
		goto :skipUpdate
	) else if /I "%updateRequested%"=="n" (
		goto :skipUpdate
	) else (
		set /P updateRequested="You did not input yes or no. Please input yes or no. "
		goto :checkUpdateRequested
	)
)

:skipUpdate

:: Get the IP address and start the development server
for /f "tokens=2 delims=:" %%i in ('ipconfig.exe ^| findstr /i "IPv4 Address"') do set "ip=%%i"
npx next dev -H "%ip%"