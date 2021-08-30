import * as crypto from 'crypto';
import { cachedDataVersionTag } from 'v8';
import { CaseImpl } from './CaseImpl';

class DeviceImpl implements Device {
    public publicKey: string;
    public privateKey: string;
    public ledger: Case;

    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
        });

        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;

        this.ledger = new CaseImpl(this.publicKey, [], '');
    }

    sendCases(signeeVerification?: string) {
        if(signeeVerification) {
            this.signCases(signeeVerification);
        }

        const sign = crypto.createSign('SHA256');
        sign.update(this.ledger.toString());

        const signature = sign.sign(this.privateKey);

        //send to blocks
        
    }

    signCases(signeeVerification: string) {
        this.ledger.signee = signeeVerification; //signature by doctor or what not
    }
    
}