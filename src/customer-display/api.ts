import { SerialPort } from "serialport";

type FactoryConfig = {
  serial: SerialPort;
  content: any;
  isCommand?: boolean;
};

export const formatter = new Intl.NumberFormat("id", {});

const fill = (len: number, char: string = " ") => {
  let s = "";
  Array.from({ length: len }).forEach((_) => {
    s += char;
  });
  return s;
};
function row(left: string, right: string) {
  let spacer = fill(20 - (left.length + right.length));
  return `${left}${spacer}${right}`;
}
const factory = ({ serial, isCommand, content }: FactoryConfig) => {
  return new Promise<void>((resolve, reject) => {
    const encoding = isCommand ? "hex" : "binary";
    serial.write(Buffer.from(content, encoding), encoding, function (error) {
      if (error) return reject(error);
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

export class CustomerDisplayCommand {
  static displayProdut = (serial,{name, total, amount}) => {
    const content = `Rp ${formatter.format(total)}`;
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

  static enter = async (serial, {}) => {
    await factory({ serial, isCommand: true, content: "0A" });
    await factory({ serial, isCommand: true, content: "0D" });
  };
  static row = (serial, { left, right }) => {
    return factory({ serial, isCommand: false, content: row(left, right) });
  };
  static column = (serial, { left, right }) => {
    return factory({ serial, isCommand: false, content: row(left, right) });
  };
  static line = (serial: SerialPort, text: string) => {
    let str = "";
    for (let i = 0; i < 20; i++) {
      str += text[i] ?? " ";
    }
    return factory({ serial, isCommand: false, content: str });
  };
  static money = (serial: SerialPort, value: number) => {
    const content = `Rp ${formatter.format(value)}`;
    return factory({ serial, isCommand: false, content });
  };
  static clear = (serial: SerialPort) => {
    return factory({ serial, isCommand: true, content: "0C" });
  };
  static test = (serial: SerialPort, name = "PRODUK 12345678909876666655") => {
    const content = `Rp ${formatter.format(100000000)}`;
    const promises = [
      // CustomerDisplayCommand.clear(serial),
      CustomerDisplayCommand.line(serial, name),
      CustomerDisplayCommand.row(serial, {
        left: "x2",
        right: content,
      }),
    ];
    return Promise.all(promises)
  };
  static list = () => {
    return SerialPort.list().then((devices)=>{
      return devices.map(item=>({
        productId : item.productId ?? "",
        vendorId : item.productId ?? "",
        serialNumber : item.serialNumber??"",
        path: item.path,
        name: (item as any)?.friendlyName ?? item.serialNumber
      })).filter(item=>item.name.toLocaleLowerCase().includes("prolific"))
    })
  }
  static run = async ({data, serialNumber}) => {
    const devices = await CustomerDisplayCommand.list();
    const selected = devices.find(el=> el.serialNumber == serialNumber );
    if (selected){
      const serial = new SerialPort({
        path: selected.path,
        baudRate:9600
      });
      return CustomerDisplayCommand.displayProduct(serial, data).then(()=>{
        return CustomerDisplayCommand.close(serial);
      });
    }
    return;
  }
  static close = (serial: SerialPort) => {
    return new Promise<void>((resolve, reject) => {
      serial.close(function (error) {
        console.log(error);
        if (error) return reject(error);
        return resolve();
      });
    });
  };
}
