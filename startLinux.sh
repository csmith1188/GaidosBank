#!/bin/bash

gitURL="https://github.com/csmith1188/GaidosBank"

# Run the update process
runUpdate() {
	if [ "$gitUpdate" == true ]; then
		git fetch
		git pull
	fi

	npm install

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

if [ -z "$(git rev-parse --verify HEAD 2> /dev/null)" ]; then
	npm install
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

# Prompt the user to update if necessary
if [ "$gitUpdate" == true ]; then
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