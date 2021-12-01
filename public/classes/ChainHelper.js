"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainHelper = void 0;
const CryptoHelper_1 = require("./CryptoHelper");
class ChainHelper {
    createChain() {
        let genesisBlock = {
            prevHash: 'genesis',
            time: Date.now().toString(),
            nonce: 0,
            ledger: [],
        };
        CryptoHelper_1.CryptoHelper.mine(genesisBlock, 0); //if it doesn't work check if it's passed by reference
        let newChain = {
            chain: [genesisBlock]
        };
        return newChain;
    }
    getBlockAfter(hashToGet, chainInstance) {
        for (let i = 0; i < chainInstance.chain.length; ++i) {
            if (CryptoHelper_1.CryptoHelper.hash(chainInstance.chain[i]) === hashToGet) {
                return chainInstance.chain.slice(i);
            }
        }
        return [];
    }
    getLastBlock(chainInstance) {
        return chainInstance.chain[chainInstance.chain.length - 1];
    }
}
exports.ChainHelper = ChainHelper;
ChainHelper.instance = new ChainHelper();
