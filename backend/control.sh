#!/bin/bash
if [ "$1" = "inspectdb" ]; then
    ./flag_tool -i | less
elif [ "$1" = "flag" ]; then
    ./flag_tool "$@"
else
  echo "I do not know this command..."
fi
