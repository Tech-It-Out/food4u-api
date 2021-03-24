#!/bin/bash

API="http://localhost:4741"
URL_PATH="/products"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "product": {
      "name": "'"${NAME}"'",
      "description": "'"${DESC}"'",
      "price": "'"${PRICE}"'",
      "imgUrl": "'"${IMGURL}"'"
    }
  }'

echo
