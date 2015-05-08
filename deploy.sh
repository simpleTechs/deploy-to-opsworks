#!/bin/sh

# Update this to be your AWS IAM user ID
export BAMBOO_AWS_ID=CHANGE_ME

# Update this to be your AWS IAM secret
export BAMBOO_AWS_SECRET=CHANGE_ME

# Leave this alone, OpsWorks is only in us-east-1 for gloabl use
export BAMBOO_AWS_REGION=us-east-1

# Set this to be a comma-delimited list of stacks using their name
export BAMBOO_AWS_STACKS=CHANGE_ME

# Set this to be a comma-delimited list of apps using their name
export BAMBOO_AWS_APPS=CHANGE_ME

# Now install the dependencies and run the script

npm install
node deployToOpsworks
