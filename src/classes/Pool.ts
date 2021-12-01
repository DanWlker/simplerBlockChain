import { CryptoHelper } from "./CryptoHelper";
import { DecentralizedChainHelper } from "./DecentralizedChainHelper";


export class Pool {
    public static instance = new Pool();
    poolCases:Case[] = [];
    blockSize:number = 3;

    removeCasesFromPool(casesToRemove:Case[]) {
        for(let caseInstance of casesToRemove) {
            this.poolCases.indexOf(caseInstance) !== -1 && this.poolCases.splice(this.poolCases.indexOf(caseInstance), 1)
        }
    }

    getCases() {
        return this.poolCases;
    }

    addCase(senderCase: Case, senderPublicKey: string, signature: Buffer) {
        console.log('Verifying authenticity...');
        const isValid = CryptoHelper.verifyAuthenticity(senderCase, senderPublicKey, signature);

        if(!isValid) {
            console.log('Case does not pass authenticity check');
            return;
        }

        console.log('Checking for duplicates...')
        const isDuplicated = this.checkIsDuplicated(senderCase);

        if(isDuplicated) {
            console.log('Case exists in blockchain or pool');
            return;
        }
            
        console.log('Adding case to pool...');
        this.poolCases.push(senderCase);
        console.log(`Case added successfully to pool. Current pool size: ${this.poolCases.length}`) 
        
    }

    checkIsDuplicated(caseToCheck: Case) {
        let found = false;
         // how to handle when there are two chains
        DecentralizedChainHelper.instance.chains.forEach((chainInstanceInChains)=>{
            chainInstanceInChains.chain.forEach((blockInChain)=>{
                if(found) {
                    return;
                }
    
                blockInChain.ledger.forEach((caseInBlock) => {
                    if(
                        CryptoHelper.hash(caseToCheck) ===
                        CryptoHelper.hash(caseInBlock)
                    ) {
                        found = true;
                        return;
                    }
                });
            });
        });
    
        this.poolCases.forEach((caseInPool) => {
            if(found) {
                return;
            }

            if(
                CryptoHelper.hash(caseToCheck) ===
                CryptoHelper.hash(caseInPool)
            ) {
                found = true;
                return;
            }
        });

        return found;
    }

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