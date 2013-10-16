
/*
 * GET home page.
 */

var mongoose = require( 'mongoose' );
var GeekPlace = mongoose.model( 'GeekPlace' );

exports.index = function(req, res){
    GeekPlace.
        find( function ( err, places, count ){
            if( err ) return next( err );
            res.render( 'places/index', { title : 'Index', results : places });
        });
};

exports.getCreate = function(req, res){
    res.render('places/create', { title: 'Create' });
};
exports.postCreate = function(req, res, next){
    try {
        var loc = JSON.parse(req.body.loc);
    } catch (e) {
        var loc = {coordinates:[], type:''};
    }

    var place = new GeekPlace({
        name    : req.body.name,
        loc: loc
    }).save( function ( err, geekplace, count ){
        if( err ) return next( err );
        res.redirect( '/places' );
    });
};

exports.getEdit= function(req, res){
    GeekPlace.findById( req.params.id, function ( err, place ){
            res.render('places/edit', { title: 'Edit', result: place });
    });
};
exports.postEdit = function(req, res, next){
    try {
        var loc = JSON.parse(req.body.loc);
    } catch (e) {
        var loc = {coordinates:[], type:''};
    }
    GeekPlace.findById( req.params.id, function ( err, place ){
        place.name    = req.body.name;
        place.loc = loc;
        place.save( function ( err, place, count ){
            res.redirect( '/' );
        });
    });
};

exports.getDelete= function(req, res){
    GeekPlace.findById( req.params.id, function ( err, place ){
        res.render('places/delete', { title: 'Delete', result: place });
    });
};
exports.postDelete = function(req, res, next){
    GeekPlace.findById( req.params.id, function ( err, place ){
//        if( place.user_id !== req.cookies.user_id ){
//            return utils.forbidden( res );
//        }
        place.remove( function ( err, place ){
            if( err ) return next( err );

            res.redirect( '/places' );
        });
    });
};

exports.list = function(req, res){
    GeekPlace.
        find( function ( err, places, count ){
            if( err ) return next( err );
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(places));
        });
};
