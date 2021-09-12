"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainImpl = void 0;
const BlockImpl_1 = require("./BlockImpl");
const crypto = __importStar(require("crypto"));
class ChainImpl {
    constructor() {
        this.blockSize = 3;
        this.chain = [new BlockImpl_1.BlockImpl('genesis', [])];
        this.pool = new BlockImpl_1.BlockImpl(this.lastBlock.hash, []);
    }
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(block) {
        this.mine(block);
        this.chain.push(block);
    }
    mine(block) {
        console.log('Mining....');
        while (true) {
            block.nonce += 1;
            const attempt = block.hash;
            if (attempt.substr(0, 4) === '0000') {
                console.log(`Nonce val: ${block.nonce}`);
                return;
            }
        }
    }
    addCase(senderCase, senderPublicKey, signature) {
        console.log('Verifying authenticity');
        const verifier = crypto.createVerify('SHA256');
        verifier.update(senderCase.toString());
        const isValid = verifier.verify(senderPublicKey, signature);
        if (isValid) {
            console.log('Authenticity verified, adding case..');
            this.pool.ledger.push(senderCase);
            console.log('Case added successfully to pool');
            console.log(`Current pool size: ${this.pool.ledger.length}`);
            if (this.pool.ledger.length >= this.blockSize) {
                console.log('Block size limit reached, creating new block');
                this.addBlock(this.pool);
                console.log('Clearing pool...');
                this.pool = new BlockImpl_1.BlockImpl(this.lastBlock.hash, []);
                console.log(this);
            }
        }
        else {
            console.log('Case is not valid');
        }
    }
    getBlockAfter(hashToGet) {
        for (let i = 0; i < this.chain.length; ++i) {
            if (this.chain[i].hash === hashToGet) {
                return this.chain.slice(i);
            }
        }
        return [];
    }
}
exports.ChainImpl = ChainImpl;
ChainImpl.instance = new ChainImpl();
