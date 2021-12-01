"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const CryptoHelper_1 = require("./CryptoHelper");
const DecentralizedChainHelper_1 = require("./DecentralizedChainHelper");
class Pool {
    constructor() {
        this.poolCases = [];
        this.blockSize = 3;
        // addPoolToChain() {
        //     this.pool.time = Date.now().toString();
        //     this.mine(this.pool);
        //     this.chain.push(this.pool);
        //     this.pool = {
        //         prevHash: CryptoHelper.hash(this.lastBlock()),
        //         time: '0',
        //         nonce: 0,
        //         ledger:[]
        //     } as Block;
        //     console.log(this);
        // }
    }
    removeCasesFromPool(casesToRemove) {
        for (let caseInstance of casesToRemove) {
            this.poolCases.indexOf(caseInstance) !== -1 && this.poolCases.splice(this.poolCases.indexOf(caseInstance), 1);
        }
    }
    getCases() {
        return this.poolCases;
    }
    addCase(senderCase, senderPublicKey, signature) {
        console.log('Verifying authenticity...');
        const isValid = CryptoHelper_1.CryptoHelper.verifyAuthenticity(senderCase, senderPublicKey, signature);
        if (!isValid) {
            console.log('Case does not pass authenticity check');
            return;
        }
        console.log('Checking for duplicates...');
        const isDuplicated = this.checkIsDuplicated(senderCase);
        if (isDuplicated) {
            console.log('Case exists in blockchain or pool');
            return;
        }
        console.log('Adding case to pool...');
        this.poolCases.push(senderCase);
        console.log(`Case added successfully to pool. Current pool size: ${this.poolCases.length}`);
    }
    checkIsDuplicated(caseToCheck) {
        let found = false;
        // how to handle when there are two chains
        DecentralizedChainHelper_1.DecentralizedChainHelper.instance.chains.forEach((chainInstanceInChains) => {
            chainInstanceInChains.chain.forEach((blockInChain) => {
                if (found) {
                    return;
                }
                blockInChain.ledger.forEach((caseInBlock) => {
                    if (CryptoHelper_1.CryptoHelper.hash(caseToCheck) ===
                        CryptoHelper_1.CryptoHelper.hash(caseInBlock)) {
                        found = true;
                        return;
                    }
                });
            });
        });
        this.poolCases.forEach((caseInPool) => {
            if (found) {
                return;
            }
            if (CryptoHelper_1.CryptoHelper.hash(caseToCheck) ===
                CryptoHelper_1.CryptoHelper.hash(caseInPool)) {
                found = true;
                return;
            }
        });
        return found;
    }
}
exports.Pool = Pool;
Pool.instance = new Pool();
