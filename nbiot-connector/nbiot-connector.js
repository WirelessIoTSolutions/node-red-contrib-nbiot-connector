/**
 * @file nbiot-connector.js
 * @description config node for Connector to NB-IoT relay service from mm1 Technology for
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

/**
 *
 * @param RED
 */
module.exports = function(RED) {
    function NbiotConnectorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.name = config.name;
        this.server = this.credentials.server;
        this.token = this.credentials.token;


    }
    RED.nodes.registerType("nbiot-connector",NbiotConnectorNode, {
        credentials: {
            server: {type:"text"},
            token: {type:"text"},
        }
    });
};