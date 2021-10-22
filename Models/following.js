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



var FollowingSchema =   new  Schema({
    mosque_id :  {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    followUser  : [{type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null}],
    isLiked  :   {type : String, default : '1'},
    followCounter: Number,
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},

});

FollowingSchema.virtual('following_id').get(function () {
    return this._id;
});


FollowingSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

FollowingSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.following_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

FollowingSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

FollowingSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.following_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    FollowingModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const FollowingModel = mongoose.model('Following', FollowingSchema, 'Following');


module.exports = {

    FollowingModel

}