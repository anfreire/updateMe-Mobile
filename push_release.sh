#!/bin/bash


# check if there is an existing updateMe.apk
if [ ! -f updateMe.apk ]; then
    echo "updateMe.apk not found. Please make sure that the file is in the root directory of the project."
    exit 1
fi

echo -e "Do you want to create a new release or update an existing one?\n[1] Create a new release\n[2] Update an existing release"
read CHOICE

TAG=""

if [ $CHOICE -eq 2 ]; then
    echo "Which release do you want to update?"
    read -a RELEASES <<< $(gh release list | awk '{print $1}')
    for i in "${!RELEASES[@]}"; do
        echo "[$i] ${RELEASES[$i]}"
    done
    read INDEX
    TAG=${RELEASES[$INDEX]}
    gh release delete-asset $TAG updateMe.apk
else
    echo "What is the tag for the release?"
    read TAG
    gh release create $TAG -t $TAG -n "Release $TAG"
fi

gh release upload $TAG updateMe.apk