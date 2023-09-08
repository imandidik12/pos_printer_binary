import { Socket } from 'socket.io'
import * as customerDisplay from './customer-display';
import recipt from './receipt';
import {excel} from './excel';
import pricePrinter from './price_printer'
export const socketHandler = (incoming :  Socket) => {
  incoming.on('excel', (d)=>excel(incoming, d));
  incoming.on('price-printer', (d)=>pricePrinter(incoming,d));
  incoming.on('customer-display:list', ()=>customerDisplay.list(incoming));
  incoming.on('customer-display', (d)=>customerDisplay.run(incoming,d));
  incoming.on('recipt', (data)=>recipt(incoming, data));
}