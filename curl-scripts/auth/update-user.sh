#!/bin/bash

API="http://localhost:4741"
URL_PATH="/update"

curl "${API}${URL_PATH}/" \
  --include \
  --request PATCH \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "user": {
      "firstName": "'"${FIRSTNAME}"'",
      "surname": "'"${SURNAME}"'",
      "street": "'"${STREET}"'",
      "apartment": "'"${APARTMENT}"'",
      "state": "'"${STATE}"'",
      "country": "'"${COUNTRY}"'"
    }
  }'

echo
