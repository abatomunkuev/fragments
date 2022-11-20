# Authenticated POST to /v1/fragments: unsupported Content-Type
POST http://localhost:8080/v1/fragments

# We're sending unsupported Content-Type
Content-Type: video/mp4

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
```Video unsupported format```

# 1. We expect to get back an HTTP 415
HTTP/1.1 415
# We have various assertions about the response that we want to check
[Asserts]
# We expect to get status error
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "error": {415} } data type check
jsonpath "$.error.code" isInteger
# We expect to get back a JSON response with { ..., "error": {415} } value
jsonpath "$.error.code" == 415
# We expect to get back a JSON response with { ..., "message": {"Provided type is not supported..."} } data type check
jsonpath "$.error.message" isString
# We expect to get back a JSON response with { ..., "message": {"Provided type is not supported..."} } value
jsonpath "$.error.message" startsWith "Provided type is not supported."
