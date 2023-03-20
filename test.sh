#!/bin/bash
if [ -z "$(git rev-parse --verify HEAD 2> /dev/null)" ]; then
	git clone https://github.com/Ryan24313/GaidosBank ./temp
	mv -f temp/* .
	rm -rf temp
fi

currentVersion=$(git rev-parse HEAD)
latestVersion=$(git rev-parse origin/main)

if [ "$currentVersion" != "$latestVersion" ]; then
	gitUpdate=true
else
	gitUpdate=false
fi

checkNpmUpdate() {
	if [ -z "$(npm list --depth=0 --parseable | tail -n +2)" ]; then
		npmUpdate=true
	else
		npmUpdate=false
	fi
}
checkNpmUpdate

runUpdate() {
	if [ "$gitUpdate" == true ]; then
		git clone https://github.com/Ryan24313/GaidosBank
	fi
	while [ "$npmUpdate" == false ]; do
		npm install
		checkNpmUpdate
	done
}

if [ "$gitUpdate" == true ] || [ "$npmUpdate" == true ]; then
	read -p "There is a newer version available, do you want to update? (yes/no) " updateRequested
	# while [ ! -n "$updateRequested" ] || [[ "${updateRequested,,}" != "yes" && "${updateRequested,,}" != "y" && "${updateRequested,,}" != "no" && "${updateRequested,,}" != "n" ]]; do
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

if [ "$(uname)" == "Darwin" ]; then
  ip=$(ipconfig getifaddr en0)
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  ip=$(hostname -I | awk '{print $1}')
elif [ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]; then
  ip=$(ipconfig | grep "IPv4 Address" | awk '{print $NF}')
else
  echo ## **This script does not supported operating system.**
### **please contact the programmer and tell them what operating system your using.**
#### **To Run without this script**
- **Open to command prompt windows only otherwise open the terminal**
- **For all of the following commands press enter after typing them**
- **Type cd (the folder this is in)**
- **To get your IP address (it will have 4 sets of numbers seperated by .)**
- **if your in windows Type ipconfig (it will be labled IPv4 Address the third line from the bottom)**
 - **if your in mac Type ipconfig getifaddr en0 (it will be the only result)**
 - **if your in linux Type hostname -I (it will be the only result)**
- **Once you have your IP address Type npx next dev -H [your IP] (Note do not actually put the brackets just your IP)**
  exit 1
fi

npx next dev -H "$ip"