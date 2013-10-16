
/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

require( './db' );

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var places = require('./routes/places');
app.get('/places', places.index);
app.get('/places/create', places.getCreate);
app.post('/places/create', places.postCreate);
app.get('/places/edit/:id', places.getEdit);
app.post('/places/edit/:id', places.postEdit);
app.get('/places/delete/:id', places.getDelete);
app.post('/places/delete/:id', places.postDelete);
app.get('/places/list', places.list);

var index = require('./routes/index');
app.get('/', index.index);

/*Error 404 Middleware. This should always be the last route.*/
app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url, title:'Error 404: File Not Found' });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
