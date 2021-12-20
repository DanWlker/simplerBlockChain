import express from 'express';
import { Pool } from './classes/Pool';
let app = express();
const portNum = 5000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
import http from 'http';
import fs from 'fs'
import readline from 'readline';

var arrNodes:string[] = [];

async function importNeighbours() {
    const fileStream = fs.createReadStream('neighbours.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
 
    for await (const line of rl) {
        arrNodes.push(line);
    }
}

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

importNeighbours()
app.listen(portNum);
console.log(`Listening to port ${portNum}`);