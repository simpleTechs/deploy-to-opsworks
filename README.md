# deploy-to-opsworks

The problem I was trying to solve was simple.  I have a Bamboo server that does stuff.  When it is finished doing stuff I want it to be able to make some AWS OpsWorks stack(s) deploy the app(s) that was just built by Bamboo.

Turns out that the only Bamboo plugin for AWS costs a lot and doesn't support OpsWorks so I thought a simple node script would do the job.

## Usage

You will require the following from AWS prior to starting

- AWS IAM Access Key
- AWS IAM Secret Key
- The name(s) of the stack(s) that you'd like to deploy to
- The name(s) of the app(s) that you'd like to deploy

### Bamboo

Bamboo will need the following tasks in its own job seperate from any other repo-based stuff

1. *Script* git clone https://github.com/SimonHooker/deploy-to-opsworks .
2. *npm* install
3. *Node.js* deployToOpsworks.js awsID=*IAM Access key* secret=*IAM Secret key* stacks=*aws stacks, comma seperated list* apps=*aws apps, comma seperated list*

### Linux

1. Clone this repo somewhere using git clone https://github.com/SimonHooker/deploy-to-opsworks
2. Edit deploy.sh to contain the correct credentials, stack name(s), and app name(s)
3. Run ./deploy.sh

### Windows

1. Clone this repo somewhere using git clone https://github.com/SimonHooker/deploy-to-opsworks
2. Edit deploy.bat to contain the correct credentials, stack name(s), and app name(s)
3. Run deploy from the command prompt
