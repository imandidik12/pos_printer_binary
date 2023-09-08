import { Printer } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";

import {Socket} from "socket.io";

function run(data){
  const device = new USB();
  try {
    device.open((error)=>{
      if (error){
        console.log(error)
        return error;
        // throw error;
      }
      const adapter = device.open();
      const printer = new Printer(adapter, {});
      return printer.raw(Buffer.from(data['bytes']))
        .cut()
        .close().then(()=>{
        console.log("recipt should be printed");
      });
    });
  }catch (e){
    console.log("--error--");
    console.log(e);
  }
}

function receipt(incoming: Socket, data){
  if(! USB.findPrinter().length){
    console.log("No printer:");
    return;
  }
  run(data)
  return;
}


const findJsonArg = ( ) : string | null => {
  const arg = process.argv;
  const check = arg.find(el=>el.split("=")[0] == "bytes")
  if(check){
    return check.split("=")[1]
  }
  return null
}

const init = () => {
  try {
    const arg = findJsonArg();
    if (! arg) {
      console.log("bytes argument not found");
      return null;
    }
    const bytes = JSON.parse(arg);
    const arrBytes = Int8Array.from(bytes);
    run({bytes : arrBytes});
  }catch (e){
    console.log(e);
  }
}
init();
// run({bytes});
export default receipt;