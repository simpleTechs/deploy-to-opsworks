var AWS = require('aws-sdk'); 
var config = new AWS.Config({
	accessKeyId: process.env.BAMBOO_AWS_ID,
	secretAccessKey: process.env.BAMBOO_AWS_SECRET,
	region: process.env.BAMBOO_AWS_REGION,
});

var opsworks = new AWS.OpsWorks( config );

var stackNames = process.env.BAMBOO_AWS_STACKS.split(',');
var appNames = process.env.BAMBOO_AWS_APPS.split(',');

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
