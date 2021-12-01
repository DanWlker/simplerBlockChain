import express from 'express';
import { Pool } from './classes/Pool';
let app = express();
const portNum = 3000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
import http from 'http';

var arrNodes:string[] = [];

//Receive new case
app.post('/insertCase', (req, res)=> {
    res.json(
        {'status': 'received'}
    );
    console.log('New case received');
    console.log(req.body);

    Pool.instance.addCase(
        req.body.ledger as Case, 
        req.body.publicKey,
        Buffer.from(req.body.signature.data));

    if(Pool.instance.poolCases.length >= Pool.instance.blockSize) {
        let casesToSend:Case[] = Pool.instance.getCases();
        const data = JSON.stringify(casesToSend);
        Pool.instance.removeCasesFromPool(casesToSend);
        console.log(data);
    
        for(const line of arrNodes) {
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
            }
        }
        
        const req = http.request(line+'/insertNewBlockFromPool', options, res => {
            console.log(`statusCode: ${res.statusCode}`)
        
            res.on('data', d => {
            process.stdout.write(d)
            });
        });
        
        req.on('error', error => {
            console.error(error)
        });
        
        req.write(data);
        req.end();
        }
    }
});

app.listen(portNum);
console.log(`Listening to port ${portNum}`);