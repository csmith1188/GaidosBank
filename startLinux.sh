#!/bin/bash

gitURL="https://github.com/csmith1188/GaidosBank"

# Check if npm packages need to be updated
checkNpmUpdate() {
	if [ -z "$(npm outdated --parseable 2> /dev/null)" ]; then
		npmUpdate=true
	else
		npmUpdate=false
	fi
}

# Run the update process
runUpdate() {
	if [ "$gitUpdate" == true ]; then
		git fetch
		git pull

		# Update the database schema
		./sqlite3.exe databases/databaseTemplate.db ".schema" > databases/schema.sql
		./sqlite3.exe databases/updatedDatabase.db < databases/schema.sql
		./sqlite3.exe databases/updatedDatabase.db "ATTACH DATABASE 'databases/database.db' AS old_db"
		./sqlite3.exe -cmd "ATTACH DATABASE 'databases/database.db' AS old_db" databases/updatedDatabase.db "SELECT name FROM old_db.sqlite_master WHERE type='table'" | while read table_name; do
			./sqlite3.exe -cmd "ATTACH DATABASE 'databases/database.db' AS old_db" databases/updatedDatabase.db "INSERT OR IGNORE INTO ${table_name} SELECT * FROM old_db.${table_name}"
		done
		./sqlite3.exe databases/updatedDatabase.db "DETACH DATABASE old_db"
		./sqlite3.exe databases/updatedDatabase.db ".quit"
		mv databases/updatedDatabase.db databases/database.db
		rm schema.sql
	fi

	while [ "$npmUpdate" == true ]; do
		npm install
		checkNpmUpdate
	done

	if [ "$gitUpdate" == true ]; then
		npx next build
	fi
}

# Check if the current directory is a Git repository
if [ -z "$(git rev-parse --verify HEAD 2> /dev/null)" ]; then
	# Clone the repository into a temporary directory
	git clone $gitURL ./temp

	# Move the contents of the temporary directory to the current directory
	mv -f temp/{.,}* .

	# Remove the temporary directory
	rm -rf temp
fi

# Create a new database if it doesn't exist
if [ ! -f "databases/database.db" ]; then
	cp databases/databaseTemplate.db databases/database.db
fi

# Backup the existing database
cp databases/database.db databases/databaseBackup.db

# Get the current and latest version of the repository
currentVersion=$(git rev-parse HEAD)
latestVersion=$(git rev-parse origin/main)

# Check if the repository needs to be updated
if [ "$currentVersion" != "$latestVersion" ]; then
	gitUpdate=true
else
	gitUpdate=false
fi

checkNpmUpdate

# Prompt the user to update if necessary
if [ "$gitUpdate" == true ] || [ "$npmUpdate" == true ]; then
	read -p "There is a newer version available, do you want to update? (yes/no) " updateRequested

	while true; do
		if [ "$updateRequested" == "yes" ] || [ "$updateRequested" == "y" ]; then
			runUpdate
			break
		elif [ "$updateRequested" == "no" ] || [ "$updateRequested" == "n" ]; then
			break
		else
			read -p "You did not input yes or no. Please input yes or no. " updateRequested
		fi
	done
fi

# start the server
if [ ! -f ".next/BUILD_ID" ]; then
	npx next build
fi
export NODE_ENV=production
node src/app