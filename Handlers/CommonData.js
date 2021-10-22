/**
 * Created by rv2016 on 19/01/17.
 */

"use strict";



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
const bcrypt     = require('bcryptjs');

var helpers_generic =  require('./yummzHandlers').funcs_g.YZHandlers;// require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var UserModel = require('../Models/user').UserModel;
var FoodChoicesModel = require('../Models/commondata').foodChoicesModel;

const appConfig = require('../ENV').prefs;



var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

module.exports.funcs_cd = {

    getFoodChoices      :   function(request, reply){

        var aFunc = function(){

            console.log('getting Food choices');

            //{$0.choices.$0.deleted : false},

            FoodChoicesModel.find(function(err, result){

                if(err){

                    console.error(err);

                    reply({

                        success :   false,
                        error   :   err,
                        message :   'Operation failed getting Food Choices.'

                    }).code(400);
                }
                else if(result != null && result.length > 0){

                    var message = null;
                    var output = null

                    if (result.length == 0){

                        message = "ZERO DATA found in FOOD CHOICES COLLECTION"

                    }
                    else if (result.length > 1){

                        message = "DATA AMBIGUITY -- Multiple FOOD CHOICES COLLECTION found."
                    }
                    else{

                        output =  result[0].toObject();

                        if(request.params.scope.toLowerCase() === "user"){

                            let filteredChoices = output.choices.filter(function(element){

                                return  element.deleted == false
                            });

                            output.choices = filteredChoices;
                        }


                        //output.lastUpdated = null;
                        message =  'Food Choices data retrieved successfully';

                    }

                    reply({
                        success :   output == null ? false : true,
                        data    :   output,
                        message :   message
                    });
                }
                else{

                    reply({
                        success :   true,
                        data    :   null,
                        message :   'ZERO data found for Food Choices'

                    })
                }

            });
        };

        execute(aFunc);
    },

    modifyFoodChoices   :   function(req, reply){

        var aFunc = function(){

            var arrModify  = req.payload.modify;

            var data_id = null

            console.log(req.payload.hasOwnProperty("data_id"))

            console.log(req.payload.data_id != null)

            if (req.payload.hasOwnProperty("data_id") == true  && req.payload.data_id != null){

                data_id = req.payload.data_id;

                if(arrModify != null && arrModify.length > 0){

                    FoodChoicesModel.findOne({_id : data_id},function(err, doc){

                        if(err){

                            reply({

                                success     :   false,
                                error       :   err,
                                message     :   'No matching Food Choices Collection found'
                            }).code(400);
                        }
                        else if (doc != null && doc != undefined){

                            var oldChoices = doc.choices;

                            let arrAllItemIds = oldChoices.map(function(element){

                                return element._id.toString(); // Most important line
                            });

                            let temp =  arrModify.map( function(element, index){

                                console.log(element , " at index : ", index);

                                let anIndex = arrAllItemIds.indexOf(element.item_id,0);

                                console.log(anIndex);

                                if(anIndex !== -1){

                                    let anItem =   oldChoices[anIndex] //= element;

                                    anItem.name = element.name;
                                    anItem.deleted = element.deleted;

                                    oldChoices[anIndex] = anItem;

                                    console.log('found at index : ', anIndex,'\n changed to : ', oldChoices[anIndex]);

                                    return element;
                                }

                            });

                            doc.choices = oldChoices

                            doc.save(function(err, savedDoc, rowsAffected){

                                if(err){

                                    reply({
                                        success     :   false,
                                        error       :   err,
                                        message     :   'Could Not Save Food Choices Data'
                                    }).code(400);
                                }
                                else if(savedDoc != null && savedDoc != undefined){

                                    reply({

                                        success     :   true,
                                        data        :   savedDoc.toObject(),
                                        message     :   'Food Choices data modified successfuly'
                                    });
                                }
                                else if(rowsAffected == 0){

                                    reply({

                                        success     :   false,
                                        error       :   err,
                                        message     :   'Could Not Save Food Choices Data'
                                    }).code(400);
                                }
                            });

                        }
                        else{

                            reply({

                                success     :   false,
                                error       :   {
                                    type    :   'NO_MATCHING_DATA_FOUND'
                                },
                                message     :   'No matching Food Choices Collection found'
                            });
                        }

                    });

                }
            }
        }


        execute(aFunc)
    },

    insertNewFoodChoices    :    function(req, reply){

        var aFunc = function(){


            var arrInsert = req.payload.insert;
            //arrDelete  = req.payload.delete,
            //arrModify  = req.payload.modify;

            var shouldAppendToList  =  false ;

            if(arrInsert != null && arrInsert.length > 0){

                let newArray = arrInsert.map( function(elemnet){

                    return  {

                        name    :   elemnet,
                        deleted :   false
                    }
                })

                arrInsert = newArray

                console.log(arrInsert);

                FoodChoicesModel.find(function(err, results){

                    if(err){
                        console.error(err);
                        reply({
                            success :   false,
                            error   :   err,
                            message :   'No Matching Food Choices data found.'

                        }).code(400);
                    }
                    else if(results && results.length == 1){

                        console.log('Appending to existing list');

                        shouldAppendToList == true

                        console.log(results)
                        let arrItems = results[0].choices.concat(arrInsert)
                        createNewDataSet(results[0], arrItems)
                    }
                    else{

                        console.log('creating new Food Choices Collection')
                        createNewDataSet(new FoodChoicesModel(), arrInsert)

                    }

                });

            }
            else{

                reply({

                    status : 'No data in Insert array'
                });
            }

        };


        function createNewDataSet(collection, items){

            let aNewDataSet = collection //new FoodChoicesModel()

            aNewDataSet.lastUpdated = Date.now()

            let isAppending = false;

            if(aNewDataSet.version > 0.00){

                isAppending =   true;
            }
            aNewDataSet.version += 1.00;
            aNewDataSet.choices = items
            console.log(aNewDataSet)

            aNewDataSet.save(function(err,savedDoc, numRowsAffected ){

                if(err){

                    reply({

                        success     :   false,
                        error       :   err,
                        message     :   'Operation failed in creating new Food Choices Collection'
                    }).code(400)

                    console.error(err)
                }
                else{

                    console.log(numRowsAffected,'\n', savedDoc);

                    let arrNewItemsInserted =   [];

                    let data = savedDoc.toObject();

                    let newItemsInserted    =   data.choices.map(function(element){

                        if (req.payload.insert.indexOf(element.name) != -1){

                            arrNewItemsInserted.push(element);

                            return element;
                        }

                    });

                    data.newItems   =   arrNewItemsInserted;

                    delete  data.choices;

                    console.log(data);

                    let message =   isAppending == true ? "New food choice items inserted successfully" :
                        "New Food Choices collection created successfully";

                    reply({

                        success     :   true,
                        data        :   data != null ? data : null,
                        message     :   data != null ? message : 'New Food Choice collection has NO DATA'
                    })
                }

            });


        }


        execute(aFunc);
    },

    deleteFoodChoices       :    function (req, reply) {

        var aFunc = function(){

            let criteria    =   {};

            if(req.params.data_id){

                criteria    =   {_id    :   req.params.data_id}
            }

            //FoodChoicesModel.remove({})

            //FoodChoicesModel.findByIdAndRemove(req.params.data_id,null, function(err, deletedDoc) {

            FoodChoicesModel.remove(criteria, function(err, deletedDoc) {

                if (err) {

                    reply({
                        success: false,
                        error: err,
                        message: 'Error occurred deleting Food Choices Data.'
                    }).code(400);
                }
                else if (deletedDoc != null && deletedDoc != undefined) {

                    let data    =   deletedDoc;
                    data.deleted    =   true;

                    reply({
                        success: true,
                        data: data,
                        message: 'Food Choices Data was removed successfully.'
                    }).code(400);
                }
                else {

                    reply({

                        success: false,
                        error: 'UnKnown Error occurred deleting the collection.',
                        message: 'Error occurred deleting Food Choices Data.'
                    }).code(400);
                }


            });


        };

        execute(aFunc);
    },

    getUserSessionStatus    :   function(req, reply){

        var asyncFunc   =   function(){

            console.log("inside create New market Function :  \ncredentials : ", req.auth.credentials);

            let authUser = req.auth.credentials ? req.auth.credentials.member : null;

            console.log("Auth User :", authUser);

            if(authUser.role === appConfig._SCOPES.CONSUMER ){

                reply({

                    success :    true,
                    data    :   {valid : true},
                    message :   "Your session is alive and valid for use"
                }).code(200);
            }
            else{

                reply({

                    success     :   false,
                    error       :   {
                                    message :   "Invalid member access detected",
                        message_readable    :   "Client requesting this resource is not authorized"
                    },
                    message     :   "Your session is not valid for use"
                })
            }

        }

        execute(asyncFunc);
    }

}
