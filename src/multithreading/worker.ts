import { CryptoHelper } from "../classes/CryptoHelper";

import { parentPort, workerData } from 'worker_threads';
import http from 'http';

let tempChLength = 0;

parentPort?.postMessage(mineBlock(workerData.blockInstance, workerData.temporaryChain, workerData.arrNeighbours));

//TODO: use parent port message and worker message to pass and retrieve data betwen them
// refer https://levelup.gitconnected.com/simple-bidirectional-messaging-in-node-js-worker-threads-7fe41de22e3c
function mineBlock(blockInstance:Block, temporaryChain:Chain, arrNeighbours:string[]) {
    tempChLength = temporaryChain.chain.length;
    console.log("from worker, the chain length is: " + tempChLength);
    CryptoHelper.mine(blockInstance, temporaryChain.chain.length);

    temporaryChain.chain.push(blockInstance);

    console.log("Current longest chain is [workernode]: " + temporaryChain.chain);
    return temporaryChain;
}