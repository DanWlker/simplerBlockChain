"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecentralizedChainHelper = void 0;
const ChainHelper_1 = require("./ChainHelper");
const CryptoHelper_1 = require("./CryptoHelper");
const universalVariable_1 = require("./universalVariable");
class DecentralizedChainHelper {
    constructor() {
        this.chains = [];
        this.chains.push(ChainHelper_1.ChainHelper.instance.createChain());
    }
    removeSmallerChain() {
        if (this.chains.length <= 1) {
            return;
        }
        console.log("chain length " + this.chains.length);
        let maxChainNum = 0;
        for (let i = 1; i < this.chains.length; i++) {
            if (this.chains[i].chain.length > this.chains[maxChainNum].chain.length) {
                console.log("Found larger chain [decentralized]");
                maxChainNum = i;
            }
            else if (this.chains[i].chain.length === this.chains[maxChainNum].chain.length) {
                console.log("There are two similar sized chains. Keeping the oldest temporarily");
            }
        }
        let tempStorage = this.chains[maxChainNum];
        this.chains = [];
        this.chains.push(tempStorage);
        universalVariable_1.UniversalVariable.instance.currentLongestChain = tempStorage.chain.length;
    }
    verifyAllBlocksInChain(chainInstance) {
        let previousHashHolder = 'genesis';
        for (var blockInstance of chainInstance.chain) {
            let currentBlockHash = CryptoHelper_1.CryptoHelper.hash(blockInstance);
            if (currentBlockHash.substr(0, 4) !== '0000' ||
                blockInstance.prevHash !== previousHashHolder) {
                return false;
            }
            previousHashHolder = currentBlockHash;
        }
        return true;
    }
    addToChain(chainInstance) {
        this.chains.push(chainInstance);
        this.removeSmallerChain();
    }
    getLongestChain() {
        if (this.chains.length > 1) {
            console.log("There are multiple possible longest chains currently");
        }
        return this.chains[0];
    }
}
exports.DecentralizedChainHelper = DecentralizedChainHelper;
DecentralizedChainHelper.instance = new DecentralizedChainHelper();
