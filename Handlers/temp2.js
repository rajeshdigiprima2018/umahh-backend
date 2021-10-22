/**
 * Created by rv2016 on 28/04/17.
 */



conekta.Customer.create({
     "name": "Conekta TestUser",
     "phone": "+5215555555555",
     "email": authUser.email
    },
    function (err, res) {
     if (err) {
      console.log("Error creating Conekta Customer : ", err);
      //return; 
     }
     else {
      console.log("Successfully created Conekta Customer : ", res.toObject());
      //get customer id  
      let customer_id = "cus_2gQcRJhZznuYbe4qZ";//res.toObject().id;
      // get payment source id and type  
      conekta.Customer.find(customer_id, function (err, customer) {
       if (err) {
        console.log("Error Finding customer : ", err);
       }
       else {
        console.log("Customer Found with details : ", customer.toObject());
        console.log("Customer Found with payment_sources as : ", customer.payment_sources.toObject());
        // get customer id  
        let customer_id = customer.toObject().id;
        customer.createPaymentSource({
             type: "card",
             token_id: String(req.payload.stripe_token),//"tok_test_visa_4242"
            },
            function (err, res) {
             if (err) {
              console.log("Error adding payment source to customer : ", err);
             }
             else if (res) {
              console.log("Successfully added payment Source to Customer :", res);
              let payment_source_id = res.id;//res.payment_sources[0].id;
              let payment_source_type = res.type//res.payment_sources[0].type;
              console.log("Customer id : ", customer_id, "\n payment source id : ", payment_source_id,
                  "\n payment source type : ", payment_source_type);
              // creating line items array  
              let lineItems = req.payload.items.map(function (element, index) {
               var modItem = {
                name: element.name,
                description: element.description,
                unit_price: parseInt(element.price * 100),
                quantity: element.quantity,
                tags: ["food", "mexican food"],
                type: "physical"
               }
               return modItem;
              });
              // finally creating an order and charging it  
              conekta.Order.create({
                   "currency": "MXN",
                   "customer_info": {
                    "customer_id": customer_id
                   },
                   "shipping_lines": [{
                    "amount": 0,
                    "carrier": "N.A."
                   }],
                   "line_items": lineItems,
                   "shipping_contact": {
                    "phone": "+5215555555555",
                    "receiver": "Bruce Wayne",
                    "address": {
                     "street1": "Calle 123 int 2 Col. Chida",
                     "city": "Cuahutemoc",
                     "state": "Ciudad de Mexico",
                     "country": "MX",
                     "postal_code": "06100",
                     "residential": true
                    }
                   },
                   "charges": [{
                    "payment_method": {
                     "payment_source_id": payment_source_id,
                     "type": payment_source_type
                    }

                   }]
                  },
                  function (err, res) {
                   if (err) {
                    console.error("Error creating  a conekat order : ", err);
                    return;
                   }
                   console.log("New Conekta Order created successfully with response :\n", res.toObject());
                  });
             }
             else {

             }
            });
       }
      });
     }
    });
