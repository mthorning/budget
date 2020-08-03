#!/bin/bash
set -e 

rm -rf __sapper__/*
yarn run build
scp -r ./__sapper__ ./static package.json pi:~/budget
