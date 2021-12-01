"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChainHelper_1 = require("./classes/ChainHelper");
const express_1 = __importDefault(require("express"));
const DecentralizedChainHelper_1 = require("./classes/DecentralizedChainHelper");
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const CryptoHelper_1 = require("./classes/CryptoHelper");
const { Worker } = require("worker_threads");
var arrNeighbours = [];
function IsJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
async function importNeighbours() {
    const fileStream = fs_1.default.createReadStream('neighbours.txt');
    const rl = readline_1.default.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        arrNeighbours.push(line);
    }
    let checkedNum = 0;
    let receivedChains = [];
    for (const line of arrNeighbours) {
        //get the latest chains
        http_1.default.get(line + '/getLatestChain', (resp) => {
            let data = '';
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                checkedNum += 1;
                //console.log(DecentralizedChainHelper.instance.verifyAllBlocksInChain(JSON.parse(data) as Chain));
                //console.log(JSON.parse(data) as Chain);
                //let temporaryChain = JSON.parse(data) as Chain;
                //console.log(temporaryChain.chain.length);
                if (DecentralizedChainHelper_1.DecentralizedChainHelper.instance.verifyAllBlocksInChain(JSON.parse(data))) {
                    receivedChains.push(data);
                }
                if (checkedNum >= arrNeighbours.length) {
                    console.log("All have been found");
                    let alreadySeen = new Map([]);
                    receivedChains.forEach(function (str) {
                        if (alreadySeen.has(str.toString()))
                            console.log('Found duplicate');
                        else {
                            console.log("Adding to already seen");
                            alreadySeen.set(str.toString(), true);
                        }
                    });
                    console.log(alreadySeen.keys());
                    console.log("Passing to chain");
                    for (let item of alreadySeen.keys()) {
                        if (IsJsonString(item)) {
                            DecentralizedChainHelper_1.DecentralizedChainHelper.instance.addToChain(JSON.parse(item));
                        }
                        else {
                            console.log("Not a json string");
                        }
                    }
                }
            });
        }).on("error", (err) => {
            checkedNum += 1;
            console.log("Error: " + err.message);
            if (checkedNum >= arrNeighbours.length) {
                console.log("All have been found");
                let alreadySeen = new Map([]);
                receivedChains.forEach(function (str) {
                    if (alreadySeen.has(str.toString()))
                        console.log('Found duplicate');
                    else {
                        console.log("Adding to already seen");
                        alreadySeen.set(str.toString(), true);
                    }
                });
                console.log(alreadySeen.keys());
                console.log("Passing to chain");
                for (let item of alreadySeen.keys()) {
                    if (IsJsonString(item)) {
                        DecentralizedChainHelper_1.DecentralizedChainHelper.instance.addToChain(JSON.parse(item));
                    }
                    else {
                        console.log("Not a json string");
                    }
                }
            }
        });
    }
}
let app = (0, express_1.default)();
const portNum = 4000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/getAllCases', (req, res) => {
    console.log('Request for all cases received');
    res.json(DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains[0]);
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
        res.json(ChainHelper_1.ChainHelper.instance.getBlockAfter(hashToGet, DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains[0]));
    }
});
app.get('/getLatestChain', (req, res) => {
    console.log("Request for latest chain received");
    res.json(DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains[0]);
});
app.post('/insertNewBlockFromPool', (req, res) => {
    DecentralizedChainHelper_1.DecentralizedChainHelper.instance.removeSmallerChain();
    let temporaryChain = DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains[0];
    let newBlock = {
        prevHash: CryptoHelper_1.CryptoHelper.hash(ChainHelper_1.ChainHelper.instance.getLastBlock(DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains[0])),
        time: Date.now().toString(),
        nonce: 0,
        ledger: req.body
    };
    const worker = new Worker("./multithreading/worker.js", { workerData: {
            blockInstance: newBlock,
            temporaryChain: temporaryChain,
            arrNeighbours: arrNeighbours,
        } });
    worker.on('message', (result) => {
    });
    res.json({ 'status': 'received' });
});
app.post('/foundLongerChain', (req, res) => {
    res.json({ 'status': 'received' });
    console.log('Received longer chain [/foundLongerChain]');
    let newChain = req.body;
    DecentralizedChainHelper_1.DecentralizedChainHelper.instance.addToChain(newChain);
    console.log("Current longest chain is  [/foundLongerChain]: ");
    console.log(DecentralizedChainHelper_1.DecentralizedChainHelper.instance.getLongestChain());
});
// //for testing purposes
// app.get('/receiveFakeCases', (req, res)=> {
//     console.log('Request for fake cases received');
//     let testing = new DeviceImpl();
//     testing.generateFakeCases();
//     res.json(
//         testing.ledger
//     );
// });
// app.get('/receiveNewDeviceAndSignature', (req, res)=> {
//     console.log('Request for fake device received');
//     let testing = new DeviceImpl();
//     testing.generateFakeCases();
//     console.log(JSON.stringify(testing.returnSignature()));
//     res.json(
//         {
//             DeviceImpl: testing,
//             signature: testing.returnSignature()
//         }
//     );
// });
console.log('hello world');
importNeighbours();
app.listen(portNum);
console.log(`Listening to port ${portNum}`);
