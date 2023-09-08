"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@node-escpos/core");
// install escpos-usb adapter module manually
const usb_adapter_1 = __importDefault(require("@node-escpos/usb-adapter"));
function run(data) {
    const device = new usb_adapter_1.default();
    try {
        device.open((error) => {
            if (error) {
                console.log(error);
                return error;
                // throw error;
            }
            const adapter = device.open();
            const printer = new core_1.Printer(adapter, {});
            return printer.raw(Buffer.from(data['bytes']))
                .cut()
                .close().then(() => {
                console.log("recipt should be printed");
            });
        });
    }
    catch (e) {
        console.log("--error--");
        console.log(e);
    }
}
function receipt(incoming, data) {
    if (!usb_adapter_1.default.findPrinter().length) {
        console.log("No printer:");
        return;
    }
    run(data);
    return;
}
const findJsonArg = () => {
    const arg = process.argv;
    const check = arg.find(el => el.split("=")[0] == "bytes");
    if (check) {
        return check.split("=")[1];
    }
    return null;
};
const init = () => {
    try {
        const arg = findJsonArg();
        if (!arg) {
            console.log("bytes argument not found");
            return null;
        }
        const bytes = JSON.parse(arg);
        const arrBytes = Int8Array.from(bytes);
        run({ bytes: arrBytes });
    }
    catch (e) {
        console.log(e);
    }
};
init();
// run({bytes});
exports.default = receipt;
