#!/bin/sh

# Setup steps for working with Minio and DynamoDB local instead of AWS.
# Assumes aws cli is installed and Minio and DynamoDB local are running.

# Setup AWS environment variables
echo "Setting AWS environment variables for DynamoDB and MinIO"

echo "AWS_ACCESS_KEY_ID=test_local"
export AWS_ACCESS_KEY_ID=test_local

echo "AWS_SECRET_ACCESS_KEY=test_local_pass"
export AWS_SECRET_ACCESS_KEY=test_local_pass

echo "AWS_SESSION_TOKEN=test_local"
export AWS_SESSION_TOKEN=test_local

export AWS_DEFAULT_REGION=us-east-1
echo "AWS_DEFAULT_REGION=us-east-1"

# Setup DynamoDB Table with dynamodb-local, see:
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html
echo "Creating DynamoDB-Local DynamoDB table: fragments"
aws --endpoint-url=http://localhost:8000 \
dynamodb create-table \
    --table-name fragments \
    --attribute-definitions \
        AttributeName=ownerId,AttributeType=S \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=ownerId,KeyType=HASH \
        AttributeName=id,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

# Wait until the Fragments table exists in dynamodb-local, so we can use it, see:
# https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/wait/table-exists.html
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name fragments
