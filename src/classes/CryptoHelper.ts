import * as crypto from 'crypto';
import { DecentralizedChainHelper } from './DecentralizedChainHelper';
import { UniversalVariable } from './universalVariable';

export class CryptoHelper {
    static hash(object: Object) {
        const str = JSON.stringify(object);
        const hash = crypto.createHash('MD5');
        hash.update(str).end();
        return hash.digest('hex');
    }

    static verifyAuthenticity(object: Case, publicKey: string, signature: Buffer) {
        let verifier = crypto.createVerify('SHA256');
        verifier.update(JSON.stringify(object));

        return verifier.verify(publicKey, signature);
    }
    
    //This shoudl be passed by reference, check this if everything doesn't work
    static mine(blockToMine: Block, temporaryChainLength:number) {
        console.log('Mining.... ' + temporaryChainLength.toString());

        while(true) {
            blockToMine.nonce += 1;

            const attempt = this.hash(blockToMine);

            if(temporaryChainLength > 0) {  //not genesis
                if(temporaryChainLength+1 <= UniversalVariable.instance.currentLongestChain){
                    console.log('Found longer chain, returning');
                    return;
                }
            }

            if(attempt.substr(0,4) === '0000') {
                console.log(`Nonce val: ${blockToMine.nonce}`);
                return;
            }
        }
    }
}