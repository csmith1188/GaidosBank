#!/bin/bash

# Check if the current directory is a Git repository
if [ -z "$(git rev-parse --verify HEAD 2> /dev/null)" ]; then
	# Clone the repository into a temporary directory
	git clone https://github.com/Ryan24313/GaidosBank ./temp

	# Move the contents of the temporary directory to the current directory
	mv -f temp/{.,}* .
	mv -f temp/* .

	# Remove the temporary directory
	rm -rf temp
fi

# Get the current and latest version of the repository
currentVersion=$(git rev-parse HEAD)
latestVersion=$(git rev-parse origin/main)

# Check if the repository needs to be updated
if [ "$currentVersion" != "$latestVersion" ]; then
	gitUpdate=true
else
	gitUpdate=false
fi

# Check if npm packages need to be updated
checkNpmUpdate() {
	if [ -z "$(npm list --depth=0 --parseable | tail -n +2)" ]; then
		npmUpdate=true
	else
		npmUpdate=false
	fi
}
checkNpmUpdate

# Run the update process
runUpdate() {
	if [ "$gitUpdate" == true ]; then
		git clone https://github.com/Ryan24313/GaidosBank
	fi

	while [ "$npmUpdate" == true ]; do
		npm install
		checkNpmUpdate
	done

	npx next build
}

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

# Create a new database if it doesn't exist
if [ ! -f "database.db" ]; then
	cp databaseTemplate.db database.db
fi

# Backup the existing database
cp database.db databaseBackup.db

# Update the database schema
sqlite3 databaseTemplate.db ".schema" > schema.sql
sqlite3 updatedDatabase.db < schema.sql
sqlite3 updatedDatabase.db "ATTACH DATABASE 'database.db' AS old_db"
sqlite3 -cmd "ATTACH DATABASE 'database.db' AS old_db" updatedDatabase.db "SELECT name FROM old_db.sqlite_master WHERE type='table'" | while read table_name; do
    sqlite3 -cmd "ATTACH DATABASE 'database.db' AS old_db" updatedDatabase.db "INSERT OR IGNORE INTO ${table_name} SELECT * FROM old_db.${table_name}"
done
sqlite3 updatedDatabase.db "DETACH DATABASE old_db"
sqlite3 updatedDatabase.db ".quit"
mv updatedDatabase.db database.db
rm schema.sql

# Get the IP address and start the development server
# Linux
# ip=$(ifconfig eth0 | awk '\$1=="inet"{print \$2}' | cut -d: -f2)
# Windows
ip=$(ipconfig | grep "IPv4 Address" | awk '{print $NF}')
npx next start -H "$ip"