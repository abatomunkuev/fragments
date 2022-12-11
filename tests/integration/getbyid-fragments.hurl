# 1. Authenticated POST to /v1/fragments: Fragment that includes a charset text/plain; charset=utf-8
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
# Checking the body
body == "This is a fragment!"
# Checking the content type
header "Content-Type" startsWith "text/plain"

# 3. Try to GET the fragment metadata we just posted by its URL
GET {{url}}/info

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "{{id}}"
jsonpath "$.fragment.type" == "text/plain"
