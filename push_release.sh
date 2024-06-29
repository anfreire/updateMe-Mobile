#!/bin/bash


echo "What is the tag for the release?"
read TAG

gh release create $TAG -t $TAG -n "Release $TAG"
mv android/app/build/outputs/apk/release/app-release.apk updateMe.apk
gh release upload $TAG updateMe.apk
rm -f updateMe.apk