#!/bin/bash
npm install
gulp prepare
# gulp custom-build
flutter doctor
flutter pub get
flutter pub run flutter_launcher_icons:main
flutter pub run flutter_native_splash:create
flutter build apk --split-per-abi