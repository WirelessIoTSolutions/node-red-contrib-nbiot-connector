/**
 * @file nbiot-uplink.js
 * @description Uplink node to NB-IoT relay service from mm1 Technology for
 * easy access and integration of NB-IoT devices
 * ATTENTION: Need a subscription to Nb-IoT relay service and client library on IoT device to work
 * @author Lyn Matten
 * @copyright (C) 2019 mm1 Technology GmbH - all rights reserved.
 * @licence MIT licence
 *
 * Find out more about mm1 Technology:
 * Company: http://mm1-technology.de/
 * GitHub:  https://github.com/mm1technology/
 */

//const request = require('request');
//const moment = require('moment');
const https = require('https');

/**
 *
 * @param RED
 */
module.exports = function(RED) {
    function NbiotUplinkNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.connector = RED.nodes.getNode(config.connector);
        this.name = config.name;
        this.server = this.connector.credentials.server;
        this.token = this.connector.credentials.token;


        node.on("input", function(msg) {


            if(msg.hasOwnProperty("payload")  && msg.payload.hasOwnProperty("imsi")  && node.server !== "" && node.server !== "") {


                let bearerToken = 'Bearer ' + node.token;

                let postRequest = null,
                    data = JSON.stringify({"message": msg.payload.message.trim()});


                //eleminate http(s) prefix if existing because cause problem with postRequest
                let serverUrl = "";
                if(node.server.includes("http")=== true) {

                    serverUrl = node.server.split("//")[1];

                }
                else {
                    serverUrl = node.server;
                }

                let apiPath = "/api/device/" + msg.payload.imsi + "/message";


                let postOptions = {
                    hostname: serverUrl,
                    path: apiPath,
                    method: 'POST',
                    headers:
                        {
                            'Cache-Control': 'no-cache',
                            Authorization: bearerToken,
                            'Content-Type': 'application/json',
                            'Content-Length': data.length
                        }
                };
                postRequest = https.request(postOptions, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        node.log('Response from the UDP Relay Service: ' + chunk);

                    });
                });
                postRequest.on('error', function (e) {
                    node.log(msg.payload.imsi + ': Problem with POST request: ' + e.message);

                });
                node.log('Sending POST request to URS - data: ' +JSON.stringify(data));
                postRequest.write(data);
                postRequest.end();




            }
            else {
                //node.status({fill: "red", shape:"ring", text:"disconnected"});
                node.log("no valid login data.");
            }





        });



    }
    RED.nodes.registerType("nbiot-uplink",NbiotUplinkNode, {

        defaults: {
            name: {
                value: "",
                required: false,
            },
            connector: {
                type: "nbiot-connector",
                required: true,
            },
            icon: "bridge.png",
            label: function () {
                return this.name || "NBIoT uplink"
            }
        }

    });
};