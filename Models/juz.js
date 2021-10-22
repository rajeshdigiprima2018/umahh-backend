/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var JuzSchema =   new  Schema({
    
    title          :   {type : String, default : null},
    name           :   {type : String, default : null},
    aerobic_title  :   {type : String, default : null},
    aerobic_name   :   {type : String, default : null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
 

});


JuzSchema.virtual('juz_id').get(function () {
    return this._id;
});


JuzSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

JuzSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.juz_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

JuzSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

JuzSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.juz_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    JuzModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const JuzModel = mongoose.model('Juz', JuzSchema, 'Juz');


module.exports = {

    JuzModel

}