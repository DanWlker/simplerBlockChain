"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoHelper_1 = require("../classes/CryptoHelper");
const DecentralizedChainHelper_1 = require("../classes/DecentralizedChainHelper");
const universalVariable_1 = require("../classes/universalVariable");
const worker_threads_1 = require("worker_threads");
const http_1 = __importDefault(require("http"));
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(mineBlock(worker_threads_1.workerData.blockInstance, worker_threads_1.workerData.temporaryChain, worker_threads_1.workerData.arrNeighbours));
function mineBlock(blockInstance, temporaryChain, arrNeighbours) {
    CryptoHelper_1.CryptoHelper.mine(blockInstance, temporaryChain.chain.length);
    temporaryChain.chain.push(blockInstance);
    if (temporaryChain.chain.length <= universalVariable_1.UniversalVariable.length) { //if received a longer chain
        console.log('This is a shorter chain [workerNode]');
        return;
    }
    DecentralizedChainHelper_1.DecentralizedChainHelper.instance.addToChain(temporaryChain);
    //need to push to other nodes
    const data = JSON.stringify(DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains[0]);
    for (const line of arrNeighbours) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        const req = http_1.default.request(line + '/foundLongerChain', options, res => {
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
    console.log("Current longest chain is [workernode]: ");
    console.log(DecentralizedChainHelper_1.DecentralizedChainHelper.instance.getLongestChain());
}
