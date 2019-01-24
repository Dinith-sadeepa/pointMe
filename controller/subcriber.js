/*
**  This is the main routing file to intergrate with app.js(entry point)
    requiring express package
    and
    requiring business
*/
const express = require('express');
// const subscriberBO = require('../business/subscriber_business');
const bodyParser = require('body-parser');
const repo = require('../repo/subcriber_repo');
const axios = require('axios');
/*
    declaring the router
*/
let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// router.post('/api/listner', function (req, res) {
//     let data = req.body;
//     console.log(data);
//     var arr = data.split('&');
//     let message = arr[1].split('=')[1];

//     let messageArray = message.split(' ');


//     if (messageArray[0].includes('reg')) {
//         let pin = Math.floor(Math.random() * 1000);
//         repo.addSubscriber(arr[0].split('=')[1], pin);
// repo.addSubscriber(arr[0].split('=')[1], pin);
//         axios.post('https://apphubstg.mobitel.lk/mobitelstg/sb/mspacesms/send', {
//             receipientMask: "115.82.29.41",
//             message: "21",
//             characterEncoding: "rovosob",
//             appID: "7072389888212992",
//             appKey: "ucoe"
//         }).then(function(res){
//             console.log(res.body);
//         }).catch(function(err){
//             console.log(err);
//         });

//     } else if (messageArray[0].includes('pm')) {
//         // let search =  repo.searchSubscriber(arr[0].split('=')[1]);
//         // console.log(search);
//         console.log(messageArray);
//         // console.log(message);
//         repo.updateSubscriber(arr[0].split('=')[1], messageArray[1], messageArray[2]);
//     }
// });

router.post('/api/listner', function (req, res) {
    let data = req.body;
    // console.log(data);

    /**
     * data is a object.so we can used it's properties with accessing them.
     */

    /**
     * if subscriber send message to register we
     * check the message with "reg"
     */

    if (data.message.includes('reg')) {
        /**
         * to generate random pin
         */
        let pin = Math.floor(Math.random() * 10000);

        /**
         * to add subscriber details to database.
         * all the functions are in repo package which used to connect with database.
         */
        repo.addSubscriber(data.senderMask, pin);

        /**
         * this api used to send verify message to who register newly
         * and used axios package to handle it.
         */
        axios.post('https://apphubstg.mobitel.lk/mobitelstg/sb/mspacesms/send', {
            receipientMask: data.senderMask,
            message: "Thank you..please send pm<space><mobileNo><space><" + pin + ">",
            characterEncoding: "ascii",
            appID: "7072389888212992",
            appKey: "ucoe"
        }).then(function (res) {
            console.log(res.body);
        }).catch(function (err) {
            console.log(err);
        });
        res.status(200).send();

        /**
            * if subscriber send message to verify their registration we
            * check the message with "pm"
        */
    } else if (data.message.includes('pm')) {
        var messageArray = data.message.split(' ');
        /**
         * to update subscriber with their mobile number
         * all the functions are in repo package which used to connect with database.
         */
        repo.updateSubscriber(data.senderMask, messageArray[1], messageArray[2]);
        res.status(200).send();
    } else {
        /**
         * if message is invalid we send status to mobitel
         */
        res.status(400).send();
    }
});

module.exports = router;