/**
 * Created by rv2016 on 05/06/17.
 */


'use strict'

const mongoose = require('mongoose');
//mongoose.promise = require('bluebird');


var PrayerNameSchema = new mongoose.Schema({

    name           :   {type : String, default : null},
    arabic_name    :   {type : String, default : null},
    status         :   {type :   Number, default     :   0},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()}
});

PrayerNameSchema.virtual('prayername_id').get(function () {
    return this._id;
});


PrayerNameSchema.set('toObject', { versionKey : false, retainKeyOrder : true, virtuals : true});

PrayerNameSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

PrayerNameSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.prayername_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

PrayerNameSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.prayername_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

//     Instance Methods

PrayerNameSchema.methods.getFullName  =   function(){

    let currStaffMember  = this.model('Prayer');

    return currStaffMember.full_name;
}


PrayerNameSchema.statics.findUnique  =  function(criteria, callback){

    PrayerNameModel.findOne(criteria, callback);
}

PrayerNameSchema.statics.getAllForRestaurant  =  function(_merchant_id, callback){


    StaffModel.find({merchant_id : _merchant_id},{__v : 0},null, callback);
}

PrayerNameSchema.statics.findAndUpdate   =   function(find_criteria, updationInfo, callback){

    this.findUnique(find_criteria, function(err, staff_member){

        if(staff_member){

        }
        else{

            callback(err ? err : "Error finding requested staff member", null);
        }
    })
}

const PrayerNameModel = mongoose.model('Prayername', PrayerNameSchema, 'Prayername');

module.exports = {

    PrayerNameModel
}