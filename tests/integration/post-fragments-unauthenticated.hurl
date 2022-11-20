# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
invalid_user@email.com:password1234

# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 1. We expect to get back an HTTP 401
HTTP/1.1 401
# We have various assertions about the response that we want to check
[Asserts]
# We expect to get status error
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "error": {401} } data type check
jsonpath "$.error.code" isInteger
# We expect to get back a JSON response with { ..., "error": {401} } value
jsonpath "$.error.code" == 401
# We expect to get back a JSON response with { ..., "message": {"Unauthorized"} } data type check
jsonpath "$.error.message" isString
# We expect to get back a JSON response with { ..., "message": {"Unauthorized"} } value
jsonpath "$.error.message" == "Unauthorized"
