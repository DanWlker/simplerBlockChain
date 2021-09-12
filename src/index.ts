import { ChainImpl } from "./entity/ChainImpl";
import { DeviceImpl } from "./entity/DeviceImpl";

// for(let i = 0; i < 10; ++i) {
//     let testing = new DeviceImpl();
//     testing.generateFakeCases();
//     testing.sendCases('Dr David');
// }

// console.log(ChainImpl.instance);

//communication with blockchain
import express from 'express';
import { formatWithOptions } from "util";
let app = express();
const portNum = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Receive new case
app.post('/insertCase', (req, res)=> {
    console.log('New case received');
    console.log(req.body);
    let formattedReceivedObj: KeySignWrapper = 
    {
        publicKey: req.body.publicKey,
        ledger: req.body.ledger,
        signature: Buffer.from(req.body.signature.data),
    };
    ChainImpl.instance.addCase(formattedReceivedObj.ledger, formattedReceivedObj.publicKey,formattedReceivedObj.signature);

    res.json(
        {success: 'true'}
    );
});

app.get('/receiveFakeCases', (req, res)=> {
    console.log('Request for fake cases received');
    let testing = new DeviceImpl();
    testing.generateFakeCases();
    res.json(
        testing.ledger
    );
});

app.get('/receiveNewDeviceAndSignature', (req, res)=> {
    console.log('Request for fake device received');
    let testing = new DeviceImpl();
    testing.generateFakeCases();
    console.log(JSON.stringify(testing.returnSignature()));
    res.json(
        {
            DeviceImpl: testing,
            signature: testing.returnSignature()
        }
    );
});

//get the cases that is not on the device 
app.get('/getAllCases', (req, res)=> {
    console.log('Request for all cases received');
    res.json(
        ChainImpl.instance.chain
    );
});

app.get('/getCasesAfter', (req, res) =>{
    console.log(`Request for partial cases after ${req.query.hashID} received`);
    let hashToGet: any = req.query.hashID;

    if(hashToGet === undefined) {
        res.json(
            {
                success: 'false'
            }
        );
    } else {
        res.json(
            ChainImpl.instance.getBlockAfter(hashToGet as string)
        );
    }
});

app.listen(portNum);
console.log(`Listening to port ${portNum}`);