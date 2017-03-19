@echo off

::zip project
del ./bin/dist.zip
call "C:\Program Files\7-Zip\7z" a ./bin/dist.zip ./src/* ./node_modules

::upload to s3
call aws s3 cp ./bin/dist.zip s3://alexagrandexchange/
echo [*] Zip uploaded to s3

::upload to lambda
call aws lambda update-function-code --function-name rsGrandExchangeFunction --s3-bucket alexagrandexchange --s3-key dist.zip
echo [*] Lambda function up to date
