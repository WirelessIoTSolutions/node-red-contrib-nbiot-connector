# node-red-contrib-nbiot-connector

__A plugin for Node-RED for easy connection to mm1 Technology NB-IoT connector__

## Description

Connects to NB-IoT relay service from mm1 Technology for easy access and integration of NB-IoT devices.
For more information please visit https://www.mm1-technology.de

*ATTENTION: Need a subscription to NB-IoT relay service and client library on IoT device to work*

## Setup

To connect to the NB-IoT Relay Service you need the url of the relay service and your api key.

Once you use the output plugin in your flow, you need to open the settings, fill in the url and api token and after saving the plugin automatically connects to the relay service.

If the Relay Service receives messages from your devices they will pushed to the plugin and received in your flow as msg.payload.

## Message structure


