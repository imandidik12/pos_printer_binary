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
      printer.raw(Buffer.from(data['bytes']))
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
}
const bytes = [27, 36, 0, 0, 27, 97, 49, 27, 69, 1, 29, 33, 17, 28, 46, 84, 111, 107, 111, 32, 49, 50, 51, 10, 27, 36, 0, 0, 27, 69, 0, 29, 33, 0, 28, 46, 65, 108, 97, 109, 97, 116, 32, 49, 50, 51, 10, 27, 36, 0, 0, 27, 97, 48, 28, 46, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 10, 27, 36, 0, 0, 28, 46, 75, 97, 115, 105, 114, 27, 36, 122, 0, 27, 97, 50, 28, 46, 77, 105, 115, 115, 32, 69, 108, 101, 110, 111, 114, 97, 32, 72, 105, 108, 108, 115, 32, 73, 86, 10, 27, 36, 0, 0, 27, 97, 48, 28, 46, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 10, 27, 36, 0, 0, 28, 46, 49, 54, 50, 57, 50, 48, 52, 53, 27, 36, 192, 0, 27, 97, 50, 28, 46, 50, 57, 45, 48, 54, 45, 50, 48, 50, 51, 32, 48, 56, 58, 52, 10, 27, 36, 0, 0, 27, 97, 48, 28, 46, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 10, 27, 36, 0, 0, 28, 46, 49, 32, 83, 69, 84, 32, 77, 73, 78, 73, 32, 117, 112, 100, 97, 116, 101, 32, 121, 103, 121, 10, 27, 36, 0, 0, 28, 46, 49, 27, 36, 61, 0, 28, 46, 49, 53, 46, 48, 48, 48, 27, 36, 40, 1, 27, 97, 50, 28, 46, 49, 51, 46, 53, 48, 48, 10, 27, 36, 0, 0, 27, 97, 48, 28, 46, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 10, 27, 36, 0, 0, 27, 97, 49, 27, 69, 1, 28, 46, 54, 56, 49, 50, 32, 108, 111, 108, 10, 27, 36, 0, 0, 27, 97, 48, 27, 69, 0, 28, 46, 84, 111, 116, 97, 108, 27, 36, 40, 1, 27, 97, 50, 28, 46, 49, 51, 46, 53, 48, 48, 10, 27, 36, 0, 0, 27, 97, 48, 28, 46, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 10, 27, 36, 0, 0, 27, 97, 49, 28, 46, 84, 104, 97, 110, 107, 32, 89, 111, 117, 10, 27, 36, 0, 0, 28, 46, 111, 121, 101, 101, 10, 27, 112, 48, 51, 48, 10, 10, 29, 86, 48]
run(bytes);
export default receipt;