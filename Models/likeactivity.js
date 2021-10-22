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



var LLikeActivitySchema =   new  Schema({
    activity_id :  {type : mongoose.Schema.Types.ObjectId, ref: 'Community', default : null},
    likeUser  : [{type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null}],
    isLiked  :   {type : String, default : '1'},
    likeCounter: Number,
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},

});

LLikeActivitySchema.virtual('likeactivity_id').get(function () {
    return this._id;
});


LLikeActivitySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

LLikeActivitySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.likeactivity_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

LLikeActivitySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

LLikeActivitySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.likeactivity_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    LikeActivityModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const LikeActivityModel = mongoose.model('LikeActivity', LLikeActivitySchema, 'LikeActivity');


module.exports = {

    LikeActivityModel

}