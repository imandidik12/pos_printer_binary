"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerDisplayCommand = exports.formatter = void 0;
const serialport_1 = require("serialport");
exports.formatter = new Intl.NumberFormat("id", {});
const fill = (len, char = " ") => {
    let s = "";
    Array.from({ length: len }).forEach((_) => {
        s += char;
    });
    return s;
};
function row(left, right) {
    let spacer = fill(20 - (left.length + right.length));
    return `${left}${spacer}${right}`;
}
const factory = ({ serial, isCommand, content }) => {
    return new Promise((resolve, reject) => {
        const encoding = isCommand ? "hex" : "binary";
        serial.write(Buffer.from(content, encoding), encoding, function (error) {
            if (error)
                return reject(error);
            return resolve();
        });
    });
};
// export const test = () => {
//   SerialPort.list().then(async devices=> {
//     console.log(devices);
//   });
//
// };
class CustomerDisplayCommand {
}
exports.CustomerDisplayCommand = CustomerDisplayCommand;
_a = CustomerDisplayCommand;
Object.defineProperty(CustomerDisplayCommand, "displayProduct", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, { name, total, amount }) => {
        const content = `Rp ${exports.formatter.format(total)}`;
        const promises = [
            // CustomerDisplayCommand.clear(serial),
            CustomerDisplayCommand.line(serial, name),
            CustomerDisplayCommand.row(serial, {
                left: `x${amount}`,
                right: content,
            }),
        ];
        return Promise.all(promises);
    }
});
Object.defineProperty(CustomerDisplayCommand, "enter", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, {}) => __awaiter(void 0, void 0, void 0, function* () {
        yield factory({ serial, isCommand: true, content: "0A" });
        yield factory({ serial, isCommand: true, content: "0D" });
    })
});
Object.defineProperty(CustomerDisplayCommand, "row", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, { left, right }) => {
        return factory({ serial, isCommand: false, content: row(left, right) });
    }
});
Object.defineProperty(CustomerDisplayCommand, "column", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, { left, right }) => {
        return factory({ serial, isCommand: false, content: row(left, right) });
    }
});
Object.defineProperty(CustomerDisplayCommand, "line", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, text) => {
        var _b;
        let str = "";
        for (let i = 0; i < 20; i++) {
            str += (_b = text[i]) !== null && _b !== void 0 ? _b : " ";
        }
        return factory({ serial, isCommand: false, content: str });
    }
});
Object.defineProperty(CustomerDisplayCommand, "money", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, value) => {
        const content = `Rp ${exports.formatter.format(value)}`;
        return factory({ serial, isCommand: false, content });
    }
});
Object.defineProperty(CustomerDisplayCommand, "clear", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial) => {
        return factory({ serial, isCommand: true, content: "0C" });
    }
});
Object.defineProperty(CustomerDisplayCommand, "test", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, name = "PRODUK 12345678909876666655") => {
        const content = `Rp ${exports.formatter.format(100000000)}`;
        const promises = [
            // CustomerDisplayCommand.clear(serial),
            CustomerDisplayCommand.line(serial, name),
            CustomerDisplayCommand.row(serial, {
                left: "x2",
                right: content,
            }),
        ];
        return Promise.all(promises);
    }
});
Object.defineProperty(CustomerDisplayCommand, "list", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => {
        return serialport_1.SerialPort.list().then((devices) => {
            return devices.map(item => {
                var _b, _c, _d, _e;
                return ({
                    productId: (_b = item.productId) !== null && _b !== void 0 ? _b : "",
                    vendorId: (_c = item.vendorId) !== null && _c !== void 0 ? _c : "",
                    serialNumber: (_d = item.serialNumber) !== null && _d !== void 0 ? _d : "",
                    path: item.path,
                    name: (_e = item === null || item === void 0 ? void 0 : item.friendlyName) !== null && _e !== void 0 ? _e : item.serialNumber
                });
            });
        });
    }
});
Object.defineProperty(CustomerDisplayCommand, "run", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial, { data }) => __awaiter(void 0, void 0, void 0, function* () {
    })
});
Object.defineProperty(CustomerDisplayCommand, "createSerial", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (path) => new serialport_1.SerialPort({
        baudRate: 9600,
        path,
        autoOpen: false,
        endOnClose: true
    }, () => { })
});
Object.defineProperty(CustomerDisplayCommand, "close", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (serial) => {
        return new Promise((resolve, reject) => {
            serial.close(function (error) {
                if (error)
                    return reject(error);
                return resolve();
            });
        });
    }
});
