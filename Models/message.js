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

var MessageSchema = new Schema({
    send_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, default: null },
    recive_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, default: null },
    description: { type: String, default: null },
    sendStatus: { type: Number, default: 0 },
    reciveStatus: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now() }
});


MessageSchema.virtual('message_id').get(function() {
    return this._id;
});


MessageSchema.set('toObject', { versionKey: false, virtuals: true, retainKeyOrder: true });

MessageSchema.options.toObject.transform = function(doc, ret, options) {

    delete ret.__v;
    ret.message_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

MessageSchema.set('toJSON', { versionKey: false, retainKeyOrder: true, virtuals: true });

MessageSchema.options.toJSON.transform = function(doc, ret, options) {

    delete ret.__v;
    ret.message_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find = function(criteria, projection, cb) {

    MessageModel.find(criteria, projection, null, cb);
}


var _details = function(orderID, cb) {

    _find({ _id: orderID }, null, cb);
}


const MessageModel = mongoose.model('Message', MessageSchema, 'Message');


module.exports = {

    MessageModel

}