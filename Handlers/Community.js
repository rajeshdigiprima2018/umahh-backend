/**
 * Created by rv2016 on 13/12/16.
 */

"use strict";

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const Path = require('path');

var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var CommunityModel = require('../Models/community').CommunityModel;

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};


module.exports.funcs_community = {


    getCommunityByUserId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all User Community by User id

                const getAllData = await CommunityModel.find({user_id: request.params.user_id}).populate('user_id','username first_name last_name').populate("likecommunity_id","likeCounter likeUser").sort({ createdAt: -1 });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "User Community all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User Community not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getCommunityList    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get User Community details id
                const getDataList = await CommunityModel.find().populate('user_id', 'username first_name last_name').populate("likecommunity_id","likeCounter likeUser").sort({ createdAt: -1 });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getDataList,
                    message     :   "User Community list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User Community not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addCommunity    :   function(request, reply) {

        const aFunc = async function(){
            try {

                //add User Community and User id
                const Community = new CommunityModel(request.payload);
                const result = await Community.save();
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   result,
                    message     :   "User Community add successfully."
                }).code(200);

            } catch (error) {

                return reply({
                success     :   false,
                message     :   error
                }).code(500);
            }

        };

        execute(aFunc);

    },

    modifyCommunity    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update User Community by Community id

                const modifyData = await CommunityModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "User Community updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User Community not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteCommunity    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete User Community by Community id
                const deleteData = await CommunityModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "User Community deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User Community not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    } 
}