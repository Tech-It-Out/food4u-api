#!/bin/bash

API="http://localhost:4741"
URL_PATH="/orders"

curl "${API}${URL_PATH}/${ID}/orderItem" \
  --include \
  --request POST \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "orderItem": {
      "productName": "'"${PRODUCT}"'",
      "price": "'"${PRICE}"'",
      "quantity": "'"${QUANTITY}"'",
      "productId": "'"${PRODID}"'"
    }
  }'

echo
