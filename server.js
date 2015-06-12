var express 		= require('express'),
	bodyParser 		= require('body-parser'),
	errorHandler 	= require('errorhandler'),
	serveStatic		= require('serve-static'),
	app 			= express(),
	publicDir		= __dirname + '/public',
	hostname		= 'localhost',
	port 			= 3001;

app.use(serveStatic( publicDir ));
// app.use(errorHandler({
// 	dumbExceptions: true,
// 	showStack: true // debugging only
// }));

console.log('Listening on port', port);
app.listen(port, hostname);