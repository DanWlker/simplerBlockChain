"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const CryptoHelper_1 = require("./CryptoHelper");
class Chain {
    constructor() {
        this.blockSize = 3;
        let genesisBlock = {
            prevHash: 'genesis',
            time: Date.now().toString(),
            nonce: 0,
            ledger: [],
        };
        this.mine(genesisBlock);
        this.chain = [
            genesisBlock
        ];
        this.pool =
            {
                prevHash: CryptoHelper_1.CryptoHelper.hash(genesisBlock),
                time: '0',
                nonce: 0,
                ledger: []
            };
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
        this.pool.ledger.push(senderCase);
        console.log(`Case added successfully to pool. Current pool size: ${this.pool.ledger.length}`);
        if (this.pool.ledger.length >= this.blockSize) {
            console.log('Block size limit reached, creating new block');
            this.addPoolToChain();
        }
    }
    getBlockAfter(hashToGet) {
        for (let i = 0; i < this.chain.length; ++i) {
            if (CryptoHelper_1.CryptoHelper.hash(this.chain[i]) === hashToGet) {
                return this.chain.slice(i);
            }
        }
        return [];
    }
    lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    //used by this class only
    mine(blockToMine) {
        console.log('Mining....');
        while (true) {
            blockToMine.nonce += 1;
            const attempt = CryptoHelper_1.CryptoHelper.hash(blockToMine);
            if (attempt.substr(0, 4) === '0000') {
                console.log(`Nonce val: ${blockToMine.nonce}`);
                return;
            }
        }
    }
    addPoolToChain() {
        this.pool.time = Date.now().toString();
        this.mine(this.pool);
        this.chain.push(this.pool);
        this.pool = {
            prevHash: CryptoHelper_1.CryptoHelper.hash(this.lastBlock()),
            time: '0',
            nonce: 0,
            ledger: []
        };
        console.log(this);
    }
    checkIsDuplicated(caseToCheck) {
        let found = false;
        this.chain.forEach((blockInChain) => {
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
        this.pool.ledger.forEach((caseInBlock) => {
            if (found) {
                return;
            }
            if (CryptoHelper_1.CryptoHelper.hash(caseToCheck) ===
                CryptoHelper_1.CryptoHelper.hash(caseInBlock)) {
                found = true;
                return;
            }
        });
        return found;
    }
}
exports.Chain = Chain;
Chain.instance = new Chain();
