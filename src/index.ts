import { Chain } from "./classes/Chain";
import { DeviceImpl } from "./classes/DeviceImpl";

import express from 'express';
let app = express();
const portNum = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Receive new case
app.post('/insertCase', (req, res)=> {
    console.log('New case received');
    console.log(req.body);

    Chain.instance.addCase(
        req.body.ledger as Case, 
        req.body.publicKey,
        Buffer.from(req.body.signature.data));

    res.json(
        {success: 'true'}
    );
});

app.get('/getAllCases', (req, res)=> {
    console.log('Request for all cases received');
    res.json(
        Chain.instance.chain
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
            Chain.instance.getBlockAfter(hashToGet as string)
        );
    }
});


//for testing purposes
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

app.listen(portNum);
console.log(`Listening to port ${portNum}`);