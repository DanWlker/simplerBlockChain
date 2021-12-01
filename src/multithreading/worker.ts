import { CryptoHelper } from "../classes/CryptoHelper";
import { DecentralizedChainHelper } from "../classes/DecentralizedChainHelper";
import { UniversalVariable } from "../classes/universalVariable";
import { parentPort, workerData } from 'worker_threads';
import http from 'http';
parentPort?.postMessage(mineBlock(workerData.blockInstance, workerData.temporaryChain, workerData.arrNeighbours));

function mineBlock(blockInstance:Block, temporaryChain:Chain, arrNeighbours:string[]) {
    CryptoHelper.mine(blockInstance, temporaryChain.chain.length);

    temporaryChain.chain.push(blockInstance);
    if(temporaryChain.chain.length <= UniversalVariable.length) { //if received a longer chain
        return;
    }

    DecentralizedChainHelper.instance.addToChain(temporaryChain);

    //need to push to other nodes
    const data = JSON.stringify(DecentralizedChainHelper.instance.chains[0]);
    
    for(const line of arrNeighbours) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }
      
      const req = http.request(line+'/foundLongerChain', options, res => {
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
    console.log("Current longest chain is: ");
    console.log(DecentralizedChainHelper.instance.getLongestChain());
}