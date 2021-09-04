import { ChainImpl } from "./entity/ChainImpl";
import { DeviceImpl } from "./entity/DeviceImpl";

for(let i = 0; i < 10; ++i) {
    let testing = new DeviceImpl();
    testing.generateFakeCases();
    testing.sendCases('Dr David');
}

console.log(ChainImpl.instance);
