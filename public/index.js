"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChainImpl_1 = require("./entity/ChainImpl");
const DeviceImpl_1 = require("./entity/DeviceImpl");
for (let i = 0; i < 10; ++i) {
    let testing = new DeviceImpl_1.DeviceImpl();
    testing.generateFakeCases();
    testing.sendCases('Dr David');
}
console.log(ChainImpl_1.ChainImpl.instance);
