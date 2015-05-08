var AWS = require('aws-sdk');

var BAMBOO_AWS_ID = process.argv.awsID || process.env.BAMBOO_AWS_ID;
var BAMBOO_AWS_SECRET = process.argv.secret || process.env.BAMBOO_AWS_SECRET;
var BAMBOO_AWS_REGION = process.argv.region || process.env.BAMBOO_AWS_REGION || 'us-east-1';
var BAMBOO_AWS_STACKS = process.argv.stacks || process.env.BAMBOO_AWS_STACKS || '';
var BAMBOO_AWS_APPS = process.argv.apps || process.env.BAMBOO_AWS_APPS || '';

var config = new AWS.Config({
	accessKeyId: BAMBOO_AWS_ID,
	secretAccessKey: BAMBOO_AWS_SECRET,
	region: BAMBOO_AWS_REGION
});

var opsworks = new AWS.OpsWorks( config );
var stackNames = BAMBOO_AWS_STACKS.split(',');
var appNames = BAMBOO_AWS_APPS.split(',');

var fireDeploy = function( stackID , appID ) {
	
	var params = {
		Command: {
			Name: 'deploy'
		},
		StackId: stackID,
		AppId: appID
	};
	opsworks.createDeployment(params, function(err, data) {
		if (err) console.log(err, err.stack);
		else     console.log( 'Deploy sent to stack '+stackID+' for app '+appID+' returning ID '+data.DeploymentId );
	});
};

var findInterestingApps = function( data ) {
	data.Apps.filter( function( app ) {
		return appNames.indexOf( app.Name ) >= 0;
	}).forEach( function( app ) {
		fireDeploy( app.StackId , app.AppId );
	});
};

var describeAppsInStack = function( stackID ) {
	console.log( 'Scanning stack '+stackID+' for apps' );
	var params = {
		StackId: stackID
	};
	opsworks.describeApps(params, function(err, data) {
		if (err) console.log(err, err.stack);
		else findInterestingApps( data );
	});
};

var findInterestingStacks = function( data ) {
	console.log( 'Looking for stacks' );
	data.Stacks.filter( function( stack ) {
		return stackNames.indexOf( stack.Name ) >= 0;
	}).forEach( function( stack ) {
		describeAppsInStack( stack.StackId );
	});
};

opsworks.describeStacks({}, function(err, data) {
	if (err) console.log(err, err.stack);
	else findInterestingStacks( data );
});
