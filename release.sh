#!/bin/bash
set -e 

rm -rf __sapper__/*
npm run build
scp -r ./__sapper__ ./static package.json pi:~/budget
