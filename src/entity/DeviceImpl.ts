import * as crypto from 'crypto';
import { CaseImpl } from './CaseImpl';
import { ChainImpl } from './ChainImpl';
import { IndvCloseContactImpl } from './IndvCloseContactImpl';

export class DeviceImpl implements Device {
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

        ChainImpl.instance.addCase(this.ledger, this.publicKey, signature);
    }

    signCases(signeeVerification: string) {
        this.ledger.signee = signeeVerification; //signature by doctor or what not
    }
    
    generateFakeCases() {
        for(let i = 0; i < 5; ++i) {
            this.ledger.recordedCases.push(
                new IndvCloseContactImpl(
                    (Math.random()*100000).toString(),
                    Date.now().toString(),
                    (Math.random()*10).toString(),
                    ['Bluetooth', 'Wifi'],
                    (Math.random()*10).toString(),
                )
            );
        }
    }
}