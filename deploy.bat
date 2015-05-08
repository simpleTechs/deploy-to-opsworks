rem Update this to be your AWS IAM user ID

set BAMBOO_AWS_ID=CHANGE_ME

rem Update this to be your AWS IAM secret

set BAMBOO_AWS_SECRET=CHANGE_ME

rem Leave this alone, OpsWorks is only in us-east-1 for gloabl use

set BAMBOO_AWS_REGION=us-east-1

rem Set this to be a comma-delimited list of stacks using their name

set BAMBOO_AWS_STACKS=CHANGE_ME

rem Set this to be a comma-delimited list of apps using their name

set BAMBOO_AWS_APPS=CHANGE_ME

rem Now install the dependencies and run the script

npm install
node deployToOpsworks
