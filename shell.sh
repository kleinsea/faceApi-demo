#!/bin/bash

read -p "是否进行"
git checkout master
if($? -ne 0); then
  git pull
else 
  echo "heheh"
if($? -ne 0); then
  git checkout -b develop
else 
  echo "shibaile"
