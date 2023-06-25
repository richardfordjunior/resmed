# resmed

Sample curl request to post sensor data:
curl --location 'http://localhost:3000/sensors/' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic WDo5Y2MxY2VhM2UzYjNmZDMxMDI0MmU4M2UwMDJjNTU5OQ==' \
--data '{
           "pollutants": [
             { "name":"groundLevelOzone", "value" : 0.5, "timestamp": "2023-06-23T20:21:39.960Z"},
             { "name":"carbonMonoxide","value" : 12, "timestamp": "2023-06-23T20:22:39.960Z"},
             { "name":"sulfurDioxide","value" : 12, "timestamp": "2023-06-23T20:23:39.960Z"},
             { "name":"nitrogenDioxide","value" : 100, "timestamp": "2023-06-23T20:24:39.960Z"}
           ]
    
}'

Sample curl request to fetch data:
curl --location --request GET 'http://localhost:3000/sensors/' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic WDo5Y2MxY2VhM2UzYjNmZDMxMDI0MmU4M2UwMDJjNTU5OQ==' \
--data ''