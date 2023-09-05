@echo off

set gitUrl=https://github.com/csmith1188/GaidosBank
goto :main

:: Run the update process
:runUpdate
	if "%gitUpdate%" equ true (
  	git fetch
  	git pull
	)

	npm install

	if "%gitUpdate%" equ true (
		npx next build
	)
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
if not exist databases\database.db copy databases\databaseTemplate.db databases\database.db

:: Backup the existing database
copy databases\database.db databases\databaseBackup.db

if %isGit% neq true (
	npm install
)

:: Get the current and latest version of the repository
for /f "delims=" %%i in ('git rev-parse HEAD') do set "currentVersion=%%i"
for /f "delims=" %%i in ('git rev-parse origin/main') do set "latestVersion=%%i"

:: Check if the repository needs to be updated
if "%currentVersion%" neq "%latestVersion%" (
    set gitUpdate=true
) else (
    set gitUpdate=false
)

:: Determine if an update is required
set update=false
if "%gitUpdate%"==true (
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

:: start the server
if not exist .next\BUILD_ID npx next build
set NODE_ENV=production
node src/app