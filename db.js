/**
 * Created by Adam on 10/1/13.
 */
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var format = require('util').format;

var GeekPlace = new Schema({
    name    : String,
    hasInternet: Boolean,
    //loc: { type : [Number], index: '2d' }
    loc: {
        type: { type: String, default: null },
        coordinates: []
    }
}, { collection: 'GeekPlaces' });

GeekPlace.index({ loc : '2dsphere' }, { sparse: true });
GeekPlace.pre('save', function(next){
    var doc = this;
    if(doc.loc.coordinates.length == 0)
        doc.loc = undefined;
    next();
});

//GeekPlace.post('init', function (doc) {
//    if(doc.loc.coordinates.length == 0)
//        doc.loc = undefined;
//    console.log('%s has been initialized from the db', doc._id);
//});

mongoose.model( 'GeekPlace', GeekPlace );

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;
var dbName = process.env['MONGO_NODE_DRIVER_DB'] != null ? process.env['MONGO_NODE_DRIVER_DB'] : 'GeekDB';

mongoose.connect( format('mongodb://%s:%d/%s', host, port, dbName) );
