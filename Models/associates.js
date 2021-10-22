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

var AssociatesSchema =   new  Schema({
    mosque_id   :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    associate_user:   [{type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null}],
    isAssociat  :   {type : Number, default   :   '1'},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


AssociatesSchema.virtual('associates_id').get(function () {
    return this._id;
});


AssociatesSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

AssociatesSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.associates_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

AssociatesSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

AssociatesSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.associates_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    AssociatesModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const AssociatesModel = mongoose.model('Associates', AssociatesSchema, 'Associates');


module.exports = {

    AssociatesModel

}