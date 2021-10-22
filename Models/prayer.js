/**
 * Created by rv2016 on 05/06/17.
 */


'use strict'

const mongoose = require('mongoose');
//mongoose.promise = require('bluebird');


var PrayerSchema = new mongoose.Schema({

    //day        :   {type : String, default : null},
    //day_aerobic:   {type : String, default : null},
    prayercategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prayername', required: true, default: null },
    time: { type: String, default: Date.now() },
    mosque_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, default: null },
    status: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now() },
    staticTime: { type: Date, default: Date.now() },
    offset: { type: String, default: Date.now() },
    startHour: { type: String, default: Date.now() },
    startMinutes: { type: String, default: Date.now() },
    checkPrayerString: { type: Number, default: 0 },
    checkPrayerStringCurrent: { type: Number, default: 0 },
    sort: { type: Number, default: 0 },
});

PrayerSchema.virtual('prayer_id').get(function() {
    return this._id;
});


PrayerSchema.set('toObject', { versionKey: false, retainKeyOrder: true, virtuals: true });

PrayerSchema.set('toJSON', { versionKey: false, retainKeyOrder: true, virtuals: true });

PrayerSchema.options.toObject.transform = function(doc, ret, options) {

    delete ret.__v;
    ret.prayer_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

PrayerSchema.options.toJSON.transform = function(doc, ret, options) {

    delete ret.__v;
    ret.prayer_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

//     Instance Methods

PrayerSchema.methods.getFullName = function() {

    let currStaffMember = this.model('Prayer');

    return currStaffMember.full_name;
}


PrayerSchema.statics.findUnique = function(criteria, callback) {

    PrayerModel.findOne(criteria, callback);
}

PrayerSchema.statics.getAllForRestaurant = function(_merchant_id, callback) {


    StaffModel.find({ merchant_id: _merchant_id }, { __v: 0 }, null, callback);
}

PrayerSchema.statics.findAndUpdate = function(find_criteria, updationInfo, callback) {

    this.findUnique(find_criteria, function(err, staff_member) {

        if (staff_member) {

        } else {

            callback(err ? err : "Error finding requested staff member", null);
        }
    })
}

const PrayerModel = mongoose.model('Prayer', PrayerSchema, 'Prayer');

module.exports = {

    PrayerModel
}