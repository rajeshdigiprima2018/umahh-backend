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

var NotificationSchema =   new  Schema({
    send_id            :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    //recive_id            :   {type : String, default : null},
    description :   {type : String, default: null},
   // sendStatus :   {type : Number, default: 0 },
    //reciveStatus :   {type : Number, default: 0 },
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


NotificationSchema.virtual('notification_id').get(function () {
    return this._id;
});


NotificationSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

NotificationSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.notification_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

NotificationSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

NotificationSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.notification_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    NotificationModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}


const NotificationModel = mongoose.model('Notification', NotificationSchema, 'Notification');


module.exports = {

    NotificationModel

}