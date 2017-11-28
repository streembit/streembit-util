/*
 
This file is part of Streembit application. 
Streembit is an open source project to create a real time communication system for humans and machines. 

Streembit is a free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 
as published by the Free Software Foundation, either version 3.0 of the License, or (at your option) any later version.

Streembit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Streembit software.  
If not, see http://www.gnu.org/licenses/.
 
-------------------------------------------------------------------------------------------------------------------------
Author: Tibor Z Pardi 
Copyright (C) 2017 The Streembit software development team
-------------------------------------------------------------------------------------------------------------------------

*/


'use strict';

const EventEmitter = require('events');

let singleton = Symbol();
let singletonEnforcer = Symbol()

class EventHandler extends EventEmitter {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        // call the events constructor
        super();   

        this.ONAPPINIT = "on-app-init";
        this.ONAPPLOG = "on-app-log";
        this.ONTASK = "on-task-init";
        this.ONIOTEVENT = "on-iotevent";
        this.ONPEERMSG = "on-peer-msg"; 
        this.ONBCEVENT = "on-bcevent";
        this.ONERROREVENT = "on-errorevent";

        this.clients = new Map();
        this.clients.set(this.ONAPPINIT, []);
        this.clients.set(this.ONPEERMSG, []);
        this.clients.set(this.ONTASK, []);
        this.clients.set(this.ONIOTEVENT, []);

        this.onappinit();
        this.onpeermsg();
        this.ontask();
        this.oniotmsg();
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new EventHandler(singletonEnforcer);
        }
        return this[singleton];
    }

    register(event, callback){
        if(!event ){
            throw new Error("Error in registering event client, event name is required");
        }
        var list_of_callbacks = this.clients.get(event);
        if(!list_of_callbacks ){
            throw new Error("Error in registering event client, invalid event name");
        }
        if(!callback || typeof callback != "function" ){
            throw new Error("Error in registering event client, invalid callback");
        }
        list_of_callbacks.push(callback);
        return true;
    }

    appinit() {
        this.emit(this.ONAPPINIT);
        return true;
    }

    peermsg(payload, req, res){
        this.emit(this.ONPEERMSG, payload, req, res);
        return true;
    }

    taskinit(task, payload) {
        this.emit(this.ONTASK, task, payload);
        return true;
    }

    iotmsg(payload, callback) {
        this.emit(this.ONIOTEVENT, payload,callback);
        return true;
    }

    onappinit(){
        this.on(this.ONAPPINIT, () => {
            let callbacks = this.clients.get(this.ONAPPINIT);            
            callbacks.forEach(
                (callback)=>{
                    callback(true);
                }                
            );
        });
    }

    onpeermsg(){
        this.on(this.ONPEERMSG, (payload, req, res) => {
            let callbacks = this.clients.get(this.ONPEERMSG);            
            callbacks.forEach(
                (callback)=>{
                    callback(payload, req, res);
                }                
            );            
        });
    }

    ontask(){
        this.on(this.ONTASK, (task, payload) => {
            let callbacks = this.clients.get(this.ONTASK);            
            callbacks.forEach(
                (callback)=>{
                    callback(task, payload);
                }                
            );
        });
    }

    oniotmsg(){
        this.on(this.ONIOTEVENT, (payload, handlerfn) => {
            let callbacks = this.clients.get(this.ONIOTEVENT);            
            callbacks.forEach(
                (callback)=>{
                    callback(payload, handlerfn);
                }                
            );
        });
    }
}

module.exports = EventHandler.instance;



