import { ChainHelper } from "./classes/ChainHelper";
import express from 'express';
import { DecentralizedChainHelper } from "./classes/DecentralizedChainHelper";
import readline from 'readline';
import fs from 'fs';
import http from 'http';
import { CryptoHelper } from "./classes/CryptoHelper";
import { UniversalVariable } from "./classes/universalVariable";
const {Worker} = require("worker_threads");

var arrNeighbours:string[] = [];

function IsJsonString(str:string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


async function importNeighbours() {
    const fileStream = fs.createReadStream('neighbours.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
 
    for await (const line of rl) {
        arrNeighbours.push(line);
    }

    let checkedNum = 0;
    let receivedChains:String[] = [];
    for(const line of arrNeighbours) {
        //get the latest chains
        http.get(line+'/getLatestChain', (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                checkedNum += 1;
                //console.log(DecentralizedChainHelper.instance.verifyAllBlocksInChain(JSON.parse(data) as Chain));
                //console.log(JSON.parse(data) as Chain);
                //let temporaryChain = JSON.parse(data) as Chain;
                //console.log(temporaryChain.chain.length);
                if(DecentralizedChainHelper.instance.verifyAllBlocksInChain(JSON.parse(data) as Chain)) {
                    receivedChains.push(data);
                }

                if(checkedNum >= arrNeighbours.length) {
                    console.log("All have been found");

                    let alreadySeen:Map<string,boolean> = new Map([]);
                    receivedChains.forEach(function(str) {
                    if (alreadySeen.has(str.toString()))
                        console.log('Found duplicate');
                    else{
                        console.log("Adding to already seen");
                        alreadySeen.set(str.toString(), true);
                    }
                    });
                    
                    console.log(alreadySeen.keys());
                    console.log("Passing to chain");
                    for(let item of alreadySeen.keys()) {
                        if(IsJsonString(item)) {
                            DecentralizedChainHelper.instance.addToChain(JSON.parse(item) as Chain);
                        } else {
                            console.log("Not a json string");
                        }
                    }
                }
            });

        }).on("error", (err) => {
            checkedNum += 1;
            console.log("Error: " + err.message);
            
            if(checkedNum >= arrNeighbours.length) {
                console.log("All have been found");

                let alreadySeen:Map<string,boolean> = new Map([]);
                receivedChains.forEach(function(str) {
                if (alreadySeen.has(str.toString()))
                    console.log('Found duplicate');
                else{
                    console.log("Adding to already seen");
                    alreadySeen.set(str.toString(), true);
                }
                });
                
                console.log(alreadySeen.keys());
                console.log("Passing to chain");
                for(let item of alreadySeen.keys()) {
                    if(IsJsonString(item)) {
                        DecentralizedChainHelper.instance.addToChain(JSON.parse(item) as Chain);
                    } else {
                        console.log("Not a json string");
                    }
                }
            }
        });
    }
}


let app = express();
const portNum = 4000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/getAllCases', (req, res)=> {
    console.log('Request for all cases received');
    res.json(
        DecentralizedChainHelper.instance.chains[0]
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
            ChainHelper.instance.getBlockAfter(hashToGet, DecentralizedChainHelper.instance.chains[0])
        );
    }
});

app.get('/getLatestChain', (req, res)=> {
    console.log("Request for latest chain received");
    res.json(
        DecentralizedChainHelper.instance.chains[0]
    );
});


app.post('/insertNewBlockFromPool', (req, res)=> {

    DecentralizedChainHelper.instance.removeSmallerChain();

    let temporaryChain = DecentralizedChainHelper.instance.chains[0];

    let newBlock = {
        prevHash: CryptoHelper.hash(
                    ChainHelper.instance.getLastBlock(
                        DecentralizedChainHelper.instance.chains[0]
                    )
                ),
        time: Date.now().toString(),
        nonce: 0,
        ledger:req.body as Case[]
    } as Block;

    const worker = new Worker("./multithreading/worker.js", {workerData: {
        blockInstance:newBlock,
        temporaryChain:temporaryChain,
        arrNeighbours:arrNeighbours,
    }});

    worker.on('message', (result) => {
        
    })

    res.json({'status': 'received'});
});


app.post('/foundLongerChain', (req, res)=>{
    res.json({'status': 'received'});
    console.log('Received longer chain [/foundLongerChain]');
    let newChain = req.body as Chain;
    DecentralizedChainHelper.instance.addToChain(newChain);
    console.log("Current longest chain is  [/foundLongerChain]: ");
    console.log(DecentralizedChainHelper.instance.getLongestChain());
});

// //for testing purposes
// app.get('/receiveFakeCases', (req, res)=> {
//     console.log('Request for fake cases received');
//     let testing = new DeviceImpl();
//     testing.generateFakeCases();
//     res.json(
//         testing.ledger
//     );
// });

// app.get('/receiveNewDeviceAndSignature', (req, res)=> {
//     console.log('Request for fake device received');
//     let testing = new DeviceImpl();
//     testing.generateFakeCases();
//     console.log(JSON.stringify(testing.returnSignature()));
//     res.json(
//         {
//             DeviceImpl: testing,
//             signature: testing.returnSignature()
//         }
//     );
// });
console.log('hello world');
importNeighbours();
app.listen(portNum);
console.log(`Listening to port ${portNum}`);