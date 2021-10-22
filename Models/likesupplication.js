/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;


var ObjectId = mongoose.Schema.Types.ObjectId;



var SupplicationLikeSchema =   new  Schema({
    supplication_id :  {type : mongoose.Schema.Types.ObjectId, ref: 'Supplication', default : null},
    likeUser  : [{type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null}],
    isLiked  :   {type : String, default : '1'},
    likeCounter: Number,
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},

});

SupplicationLikeSchema.virtual('supplicationLike_id').get(function () {
    return this._id;
});


SupplicationLikeSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

SupplicationLikeSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.supplicationLike_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

SupplicationLikeSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

SupplicationLikeSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.supplicationLike_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    SupplicationLikeModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const SupplicationLikeModel = mongoose.model('SupplicationLike', SupplicationLikeSchema, 'SupplicationLike');


module.exports = {

    SupplicationLikeModel

}