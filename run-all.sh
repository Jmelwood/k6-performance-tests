for test_file in ./src/tests/*.spec.ts; do
  $1 "$test_file"
  if [ $? -ne 0 ]; then
     echo "ERROR: $test_file failed; check logs."
     exit 1
  fi
done