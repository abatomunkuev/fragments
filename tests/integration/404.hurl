# 404 Not Found Test
GET http://localhost:8080/unknown_route

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404

# We should get back Content type: application/json response
Content-Type: application/json; charset=utf-8

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "error": {404} } data type check
jsonpath "$.error.code" isInteger
# We expect to get back a JSON response with { ..., "error": {404} } value check
jsonpath "$.error.code" == 404
# We expect to get back a JSON response with { ..., "message": {"not found"} } data type check
jsonpath "$.error.message" isString
# We expect to get back a JSON response with { ..., "error": {404} } 
jsonpath "$.error.message" == "not found"
