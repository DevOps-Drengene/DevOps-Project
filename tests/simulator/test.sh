#!/bin/bash
errors=$(python minitwit_simulator.py http://simulator-api:5001)

if [ -z "$errors" ]; then
    echo "SUCCESS! No errors detected."
    exit 0
else
    printf "FAILURE! Following errors detected:\n$errors\n"
    exit 1
fi
