// install escpos-usb adapter module manually

const { Printer } = require("@node-escpos/core");
const USB = require("@node-escpos/usb-adapter");
const { readFileSync } = require("fs");
const { join } = require("path");

async function run(data) {
  const device = new USB();
  return new Promise((resolve, reject) => {
    device.open((error) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      const adapter = device.open();
      const printer = new Printer(adapter, {});
      printer
        .raw(Buffer.from(data["bytes"]))

        .cut();
      return printer.close().then(() => {
        return resolve({});
      });
      // console.log(adapter.detachDevice());
      // return resolve({});
      // .close()
      // .then(resolve)
      // .catch(reject);
    });
  });
}

const findJsonArg = (): string | null => {
  const file = "./data.json";
  try {
    const data = readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const init = async () => {
  try {
    const arg = findJsonArg();
    if (!arg) {
      console.log("bytes argument not found");
      return null;
    }
    const bytes = arg;
    const arrBytes = Int8Array.from(bytes as any);
    return run({ bytes: arrBytes }).then(() => {});
  } catch (e) {
    console.log(e);
  }
};

console.log();
init().then(() => {
  console.log("oke");
});
export {};
