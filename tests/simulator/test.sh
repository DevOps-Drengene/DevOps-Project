#!/bin/bash
errors=$(python minitwit_simulator.py http://simulator-api:5001 minitwit_scenario_min.csv)

if [ -z "$errors" ]; then
    echo "SUCCESS! No errors detected."
    exit 0
else
    printf "FAILURE! Following errors detected:\n$errors\n"
    exit 1
fi
