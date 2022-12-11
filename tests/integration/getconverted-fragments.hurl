# 1. Authenticated POST to /v1/fragments: Fragment that includes a charset text/markdown
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/markdown

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
```## This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# 2. Try to GET the fragment we just updated, converting from text/markdown to text/html
GET {{url}}.html

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
# Checking the body
body matches "<h2>This is a fragment!</h2"
# Checking the content type
header "Content-Type" startsWith "text/html"
