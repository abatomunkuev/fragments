# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: application/json

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in {...} when it's a JSON
```{ "service": "DynamoDB" }```

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `fragment1_url` and id into a variable named `fragment1_id`
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 2. GET the fragments metadata using the location url
GET {{fragment1_url}}/info

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
jsonpath "$.fragment.id" == "{{fragment1_id}}"
jsonpath "$.fragment.type" == "application/json"

# 3. Authenticated POST a second Markdown fragment to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/markdown

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
```DynamoDB is **great**.```

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 4. GET the fragments metadata using the location url
GET {{fragment2_url}}/info

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
jsonpath "$.fragment.id" == "{{fragment2_id}}"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

# 5. GET the list of fragments for the authorized user without expanding them
GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# 6. DELETE the first fragment
DELETE {{fragment1_url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# 7. Try to GET deleted fragment
GET {{fragment1_url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# 8. GET the list of fragments for the authorized, confirm that the first id is NOT included but that the second id is
GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

