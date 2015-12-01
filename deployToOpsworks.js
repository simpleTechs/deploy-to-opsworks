var AWS = require('aws-sdk');

var something = {}
process.argv.filter( function( argument ) {
	return ( argument.split('=').length == 2 );
}).forEach( function( argument ) {
	var s = argument.split('=');
	something[ s[0] ] = s[1];
});


var BAMBOO_AWS_ID = something.awsID || process.env.BAMBOO_AWS_ID;
var BAMBOO_AWS_SECRET = something.secret || process.env.BAMBOO_AWS_SECRET;
var BAMBOO_AWS_REGION = something.region || process.env.BAMBOO_AWS_REGION || 'us-east-1';
var BAMBOO_AWS_STACKS = something.stacks || process.env.BAMBOO_AWS_STACKS || '';
var BAMBOO_AWS_APPS = something.apps || process.env.BAMBOO_AWS_APPS || '';

var config = new AWS.Config({
	accessKeyId: BAMBOO_AWS_ID,
	secretAccessKey: BAMBOO_AWS_SECRET,
	region: BAMBOO_AWS_REGION
});

var opsworks = new AWS.OpsWorks( config );
var stackIds = BAMBOO_AWS_STACKS.split(',');
var appIds = BAMBOO_AWS_APPS.split(',');

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
	console.log('Found apps:', data.Apps);
	data.Apps.filter( function( app ) {
		return appIds.indexOf( app.AppId ) >= 0;
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
	console.log( 'Looking for stacks', data.Stacks );
	data.Stacks.filter( function( stack ) {
		return stackIds.indexOf( stack.StackId ) >= 0;
	}).forEach( function( stack ) {
		describeAppsInStack( stack.StackId );
	});
};

opsworks.describeStacks({}, function(err, data) {
	if (err) console.log(err, err.stack);
	else findInterestingStacks( data );
});
