#!/bin/bash

API="http://localhost:4741"
URL_PATH="/orders"

curl "${API}${URL_PATH}/${ORDID}/orderItem/${ORDITEMID}" \
  --include \
  --request PATCH \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "orderItem": {
      "quantity": "'"${QUANTITY}"'"
    }
  }'

echo
