# 1. Authenticated GET request /v1/fragments
GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Expect to get empty array list - fragments
[Asserts]
jsonpath "$.fragments" count == 0




# 2. Authenticated POST to /v1/fragments: Fragment that includes a charset text/plain; charset=utf-8
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 1. We expect to get back an HTTP 201
HTTP/1.1 201




# 3. Authenticated GET request /v1/fragments
GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Expect to get array list with 1 element
[Asserts]
jsonpath "$.fragments" count == 1



# 4. Authenticated GET request /v1/fragments?expand=1, expanded list
GET http://localhost:8080/v1/fragments?expand=1

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Expect to get array list with 1 element
[Asserts]
jsonpath "$.fragments" count == 1
jsonpath "$.fragments[*].id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragments[*].created" isString
jsonpath "$.fragments[*].updated" isString
jsonpath "$.fragments[*].type" isString
jsonpath "$.fragments[*].size" isInteger
jsonpath "$.fragments[*].size" > 0
