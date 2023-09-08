"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const getMode = () => {
    const arg = process.argv;
    const checklist = arg.find(el => el == "--list");
    if (checklist)
        return "list";
    const checkSerial = arg.findIndex(el => el == "--serial");
    if (checkSerial == -1) {
        console.log("Serial argument not found");
        return null;
    }
    return "display";
};
const getDeviceNumber = () => {
    const arg = process.argv;
    const checkSerial = arg.findIndex(el => el == "--serial") + 1;
    return arg[checkSerial];
};
if (getMode() == "list") {
    api_1.CustomerDisplayCommand.list().then((data) => {
        console.log(JSON.stringify(data));
    });
}
const resolveData = () => {
    const arg = process.argv.join("");
    // const checkData = arg.findIndex(el=>el == "--data") + 1
    // return arg[checkData];
    const d = arg.split("data")[1];
    return d;
};
const resolveArguments = (name) => {
    const arg = process.argv;
    const checkSerial = arg.findIndex(el => el == `--${name}`) + 1;
    return arg[checkSerial];
};
console.log(getMode());
if (getMode() == "display") {
    api_1.CustomerDisplayCommand.list().then(data => {
        const device = data.find(el => el.path == getDeviceNumber());
        if (device) {
            const fPath = (0, path_1.resolve)("./customer-display.json");
            if (fs.existsSync(fPath)) {
                const content = fs.readFileSync(fPath, "utf-8");
                const serial = api_1.CustomerDisplayCommand.createSerial(device.path);
                serial.open();
                api_1.CustomerDisplayCommand.displayProduct(serial, JSON.parse(content)).then(() => {
                    serial.close();
                });
            }
            else {
                console.log(`File not exist : ${fPath}`);
            }
        }
    });
}
