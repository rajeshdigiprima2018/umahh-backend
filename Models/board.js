/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;

var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var BoardSchema =   new  Schema({
    mosque_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    name     :   {type : String, default : null},
    title     :   {type : String, default : null},
    textarea    :   {type : String, default : null},
    pictures    : [{
        url: {type : String, default : null}

    }], 
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


BoardSchema.virtual('Board_id').get(function () {
    return this._id;
});


BoardSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

BoardSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.Board_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

BoardSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

BoardSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.Board_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    BoardModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const BoardModel = mongoose.model('Board', BoardSchema, 'Board');


module.exports = {

    BoardModel

}