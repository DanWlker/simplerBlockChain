"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoHelper_1 = require("../classes/CryptoHelper");
const worker_threads_1 = require("worker_threads");
let tempChLength = 0;
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(mineBlock(worker_threads_1.workerData.blockInstance, worker_threads_1.workerData.temporaryChain, worker_threads_1.workerData.arrNeighbours));
//TODO: use parent port message and worker message to pass and retrieve data betwen them
// refer https://levelup.gitconnected.com/simple-bidirectional-messaging-in-node-js-worker-threads-7fe41de22e3c
function mineBlock(blockInstance, temporaryChain, arrNeighbours) {
    tempChLength = temporaryChain.chain.length;
    console.log("from worker, the chain length is: " + tempChLength);
    CryptoHelper_1.CryptoHelper.mine(blockInstance, temporaryChain.chain.length);
    temporaryChain.chain.push(blockInstance);
    console.log("Current longest chain is [workernode]: " + temporaryChain.chain);
    return temporaryChain;
}
