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



var CommunitySchema =   new  Schema({
    user_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    likecommunity_id :   {type : mongoose.Schema.Types.ObjectId, ref: 'LikeCommunity', default : null},
    description  :   {type : String, default : null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},

});

CommunitySchema.virtual('community_id').get(function () {
    return this._id;
});


CommunitySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

CommunitySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.community_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

CommunitySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

CommunitySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.community_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    CommunityModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const CommunityModel = mongoose.model('Community', CommunitySchema, 'Community');


module.exports = {

    CommunityModel

}