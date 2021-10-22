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



var LikeCommunitySchema =   new  Schema({
    community_id :  {type : mongoose.Schema.Types.ObjectId, ref: 'Community', default : null},
    likeUser  : [{type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null}],
    isLiked  :   {type : String, default : '1'},
    likeCounter: Number,
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},

});

LikeCommunitySchema.virtual('likecommunity_id').get(function () {
    return this._id;
});


LikeCommunitySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

LikeCommunitySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.likecommunity_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

LikeCommunitySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

LikeCommunitySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.likecommunity_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    LikeCommunityModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const LikeCommunityModel = mongoose.model('LikeCommunity', LikeCommunitySchema, 'LikeCommunity');


module.exports = {

    LikeCommunityModel

}