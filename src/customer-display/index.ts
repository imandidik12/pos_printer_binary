import {Socket} from "socket.io";
import { CustomerDisplayCommand } from './api';

export const list = async (incoming) => {
  console.log("Display list: ")
  const devices = await CustomerDisplayCommand.list();
  console.log(devices)
  incoming.emit("customer-display:list", devices)
  console.log("Display list: ")
  console.log(devices)
}
export const run = (incoming: Socket, data) => {
  CustomerDisplayCommand.run(data);
}