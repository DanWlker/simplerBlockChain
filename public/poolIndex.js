"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Pool_1 = require("./classes/Pool");
let app = (0, express_1.default)();
const portNum = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const http_1 = __importDefault(require("http"));
var arrNodes = [];
//Receive new case
app.post('/insertCase', (req, res) => {
    res.json({ 'status': 'received' });
    console.log('New case received');
    console.log(req.body);
    Pool_1.Pool.instance.addCase(req.body.ledger, req.body.publicKey, Buffer.from(req.body.signature.data));
    if (Pool_1.Pool.instance.poolCases.length >= Pool_1.Pool.instance.blockSize) {
        let casesToSend = Pool_1.Pool.instance.getCases();
        const data = JSON.stringify(casesToSend);
        Pool_1.Pool.instance.removeCasesFromPool(casesToSend);
        console.log(data);
        for (const line of arrNodes) {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };
            const req = http_1.default.request(line + '/insertNewBlockFromPool', options, res => {
                console.log(`statusCode: ${res.statusCode}`);
                res.on('data', d => {
                    process.stdout.write(d);
                });
            });
            req.on('error', error => {
                console.error(error);
            });
            req.write(data);
            req.end();
        }
    }
});
app.listen(portNum);
console.log(`Listening to port ${portNum}`);
