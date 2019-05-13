# Serverless Thumbnail Creator

Lets say, we have to create thumbnails, profile picture for the images uploaded by users. We can use S3 Event notification along with lambda function to do it.

![AWS Serverless Thumbnail Creator](images/Miztiik-Serverless-Image-Processor.png)

#### Follow this article in [Youtube](https://youtube.com/c/valaxytechnologies)

0. ### Prerequisites

- AWS CLI pre-configured

1. ## Clone the repository

   ```bash
   git clone https://github.com/miztiik/serverless-thumbnails-creator.git
   ```

1. ## Customize the deployment

    In the `serverless-thumbnails-creator` directory, Edit the `./helper_scripts/deploy.sh` to update your environment variables.

    **You will have to create an S3 bucket in your account and update the `BUCKET_NAME` in the below section**
  
    ```bash
    AWS_PROFILE="default"
    AWS_REGION="us-east-1"
    BUCKET_NAME="YOUR-BUCKET-NAME-GOES-HERE" # bucket must exist in the SAME region the deployment is taking place
    SERVICE_NAME="serverless-thumbnails-creator"
    TEMPLATE_NAME="${SERVICE_NAME}.yaml"
    STACK_NAME="${SERVICE_NAME}"
    OUTPUT_DIR="./outputs/"
    PACKAGED_OUTPUT_TEMPLATE="${OUTPUT_DIR}${STACK_NAME}-packaged-template.yaml"
    ```

    Save the file.

1. ## Deployment

    We will use the `deploy.sh` in the `helper_scripts` directory to deploy our [AWS SAM](https://github.com/awslabs/serverless-application-model) template

    ```bash
    chmod +x ./helper_scripts/deploy*.sh
    ./helper_scripts/deploy.sh
    ```
  
1. ## Test Event Processor

    Upload an object to the `Source S3 Bucket` created by the stack(_The bucket name should be something like `serverless-thumbnails-creator-srceventbucket-zwpgvaxxb3qh`_). You will be able to see the output in the `Destination S3 Bucket`(_In your account `*tgtbucket`_) three directories with resized images. In the lambda logs you will see the following output

    ```json
    {
      "status": "True",
      "TotalItems": {
        "Received": 1,
        "Processed": 1
      },
      "Items": [
        {
          "time": "2019-05-09T18:02:24.534Z",
          "object_owner": "AWS:AIDAUR7KWXJQLWZZ56LRA",
          "bucket_name": "serverless-thumbnails-creator-srceventbucket-zwpgvaxxb3qh",
          "key": "wt-cloudtrail-100.png"
        }
      ]
    }
    ```

1. ## Troubleshooting: Lambda@Edge Logs

    The logs are generated & stored at the aws region nearest to the user location. To find out which location has logs,

    ```bash
      FUNCTION_NAME="cf-edge-test"
      for region in $(aws --output text  ec2 describe-regions | cut -f 3)
      do
          for loggroup in $(aws --output text  logs describe-log-groups --log-group-name "/aws/lambda/us-east-1.${FUNCTION_NAME}" --region ${region} --query 'logGroups[].logGroupName')
          do
              echo ${region} ${loggroup}
          done
      done
    ```

### Contact Us

You can reach out to us to get more details through [here](https://youtube.com/c/valaxytechnologies/about).