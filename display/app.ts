import { CustomerDisplayCommand } from './api'
import { resolve } from 'path'
import * as fs from 'fs'

const getMode = () : ("list" | "display") | null => {
  const arg = process.argv;
  const checklist = arg.find(el=> el == "--list")
  if (checklist) return "list";

  const checkSerial = arg.findIndex(el=>el == "--serial")
  if (checkSerial == -1) {
    console.log("Serial argument not found");
    return null;
  }
  return "display";
}

const getDeviceNumber = () : string => {
  const arg = process.argv;
  const checkSerial = arg.findIndex(el=>el == "--serial") + 1
  return arg[checkSerial ];
}

if (getMode() == "list"){
  CustomerDisplayCommand.list().then((data)=>{
    console.log(JSON.stringify(data));
  });
}
const resolveData = () : string => {
  const arg = process.argv.join("");
  // const checkData = arg.findIndex(el=>el == "--data") + 1
  // return arg[checkData];
  const d = arg.split("data")[1];
  return d;
}
if (getMode() == "display"){
  CustomerDisplayCommand.list().then(data=>{
    const device = data.find(el => el.path == getDeviceNumber());
    if (device){
      const fPath = resolve("./customer-display.json");
      if (fs.existsSync(fPath)){
        const content = fs.readFileSync(fPath,"utf-8" );
        const serial = CustomerDisplayCommand.createSerial(device.path);
        serial.open();
        CustomerDisplayCommand.displayProduct(serial, JSON.parse(content)).then(()=>{
          serial.close();
        });
      }else{
        console.log(`File not exist : ${fPath}`)
      }
    }
  });
}