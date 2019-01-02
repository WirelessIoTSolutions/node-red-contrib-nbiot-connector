/**
 * @file nbiot-connector.js
 * @description Connector to NB-IoT relay service from mm1 Technology for
 * easy access and integration of NB-IoT devices
 * ATTENTION: Need a subscription to Nb-IoT relay service and client library on IoT device to work
 * @author Lyn Matten
 * @copyright (C) 2018 mm1 Technology GmbH - all rights reserved.
 * @licence MIT licence
 *
 * Find out more about mm1 Technology:
 * Company: http://mm1-technology.de/
 * GitHub:  https://github.com/mm1technology/
 */

const request = require('request');
const moment = require('moment');


module.exports = function(RED) {
    function NbiotConnectorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.name = config.name;
        this.server = this.credentials.server;
        this.token = this.credentials.token;

        let fetchUrl = "";
        let socket = null;

        let msg = {};

        msg.payload = {
            "name": this.name || "",
            "server": this.server || "",
            "token": this.token || ""
        };

        node.log(JSON.stringify(msg.payload));

        if(this.server !== "" && this.server !== "") {

            fetchUrl = this.server + "?token=" + this.token;

            socket = require('socket.io-client')(fetchUrl,
                {
                    transports: ['websocket'],
                    upgrade: false
                }

            );



            socket.on('connect', function(){


                node.log("connected to NB-IoT relay service");

                node.status({fill: "green", shape:"dot", text:"connected"});

                socket.on('message', function(data){

                    node.log(JSON.stringify(data));

                    let msgObj = {};
                    msgObj.imsi = data.imsi;
                    msgObj.timestamp = data.timestamp;
                    msgObj.direction = data.direction;


                    let msgStr = new Buffer(data.data, 'base64').toString("ascii");
                    //let msgJSON = JSON.parse(msgStr);

                    //msgObj.data = msgJSON;
                    msgObj.data = msgStr;

                    msg.payload = msgObj;
                    node.send(msg);
                });

            });


        }
        else {
            node.status({fill: "red", shape:"ring", text:"disconnected"});
            node.log("no valid login data.");
        }


        node.on("close", function(removed, done) {

            node.log("node is closing...")

            if(removed) {

            }
            else {

            }

            if(socket !== null) {
                socket.close();
                node.log("closed socket.");
                done();


            }

            //done();

        })
    }
    RED.nodes.registerType("nbiot-connector",NbiotConnectorNode, {
        credentials: {
            server: {type:"text"},
            token: {type:"text"},
        }
    });
}