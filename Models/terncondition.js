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

var TermconditionSchema =   new  Schema({
    //send_id            :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    //recive_id            :   {type : String, default : null},
    description :   {type : String, default: null},
   // sendStatus :   {type : Number, default: 0 },
    //reciveStatus :   {type : Number, default: 0 },
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


TermconditionSchema.virtual('term_id').get(function () {
    return this._id;
});


TermconditionSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

TermconditionSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.term_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

TermconditionSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

TermconditionSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.term_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    TermconditionModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}


const TermconditionModel = mongoose.model('Termcondition', TermconditionSchema, 'Termcondition');


module.exports = {

    TermconditionModel

}