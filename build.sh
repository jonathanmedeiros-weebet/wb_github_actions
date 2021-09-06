#!/bin/bash
rm -Rvf android/app/src/main/kotlin/*
mkdir -p android/app/src/main/kotlin/bet2/wee/bet
npm install
gulp custom-build
