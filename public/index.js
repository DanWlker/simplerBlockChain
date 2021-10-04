"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chain_1 = require("./classes/Chain");
const DeviceImpl_1 = require("./classes/DeviceImpl");
const express_1 = __importDefault(require("express"));
let app = (0, express_1.default)();
const portNum = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Receive new case
app.post('/insertCase', (req, res) => {
    console.log('New case received');
    console.log(req.body);
    Chain_1.Chain.instance.addCase(req.body.ledger, req.body.publicKey, Buffer.from(req.body.signature.data));
    res.json({ success: 'true' });
});
app.get('/getAllCases', (req, res) => {
    console.log('Request for all cases received');
    res.json(Chain_1.Chain.instance.chain);
});
app.get('/getCasesAfter', (req, res) => {
    console.log(`Request for partial cases after ${req.query.hashID} received`);
    let hashToGet = req.query.hashID;
    if (hashToGet === undefined) {
        res.json({
            success: 'false'
        });
    }
    else {
        res.json(Chain_1.Chain.instance.getBlockAfter(hashToGet));
    }
});
//for testing purposes
app.get('/receiveFakeCases', (req, res) => {
    console.log('Request for fake cases received');
    let testing = new DeviceImpl_1.DeviceImpl();
    testing.generateFakeCases();
    res.json(testing.ledger);
});
app.get('/receiveNewDeviceAndSignature', (req, res) => {
    console.log('Request for fake device received');
    let testing = new DeviceImpl_1.DeviceImpl();
    testing.generateFakeCases();
    console.log(JSON.stringify(testing.returnSignature()));
    res.json({
        DeviceImpl: testing,
        signature: testing.returnSignature()
    });
});
app.listen(portNum);
console.log(`Listening to port ${portNum}`);
