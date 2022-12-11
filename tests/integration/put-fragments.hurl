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

# 2. Authenticated PUT to /v1/fragments:  Updating Fragments data
PUT {{url}}

# We're sending a plain text fragment
Content-Type: text/markdown

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
```## Updating Fragment: This is updated fragment!```

# 3. Try to GET the fragment we just updated
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
# Checking the body
body == "## Updating Fragment: This is updated fragment!"
# Checking the content type
header "Content-Type" startsWith "text/markdown"
