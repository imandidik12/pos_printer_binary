import type {Socket} from "socket.io";
import {dialog} from '@fheahdythdr/node-file-dialog';
import Excel from 'exceljs'
import path from "path";
import openExplorer from 'open-file-explorer';
// @ts-ignore
import opn from '@brainsights/opn';

type SheetData = {
  sheet: string,
  data:Record<string,any>[]
}
type SheetHeader = {
  key: string
  label: string
  width: number
  type: string
}

type Config = {
  filename: string
  payload:{
    sheets: SheetData[],
    headers: SheetHeader[]
  }
}
export async function excel(socket: Socket,config:Config){
  try {
    //@ts-ignore
    const dir = await dialog({
      dialogtype:"save-file",
      startdir: path.resolve(process.env['HOMEPATH'], 'Documents'),
      ext: "xlsx",
      startfile: config.filename,
      types: [ // the extensions you can pick from
        {
          display: "Excel", extensions: "*.xlsx"
        }
      ],
    });

    const filepath = dir[0];
    const workbook = new Excel.Workbook();
    const { payload } = config;
    payload.sheets.forEach(({sheet, data})=>{
      const ws = workbook.addWorksheet(sheet)
      console.log(payload['headers']);
      ws.columns = payload['headers'].map(item=>({
        header: item.label,
        key: item.key,
        width: item.width,
        style:{
          numFmt: item.type == "currency" ? "\"Rp\"#,##0.00;[Red]\\-\"Rp\"#,##0.00": undefined
        },
      }));
      ws.addRows(data);
    });
    workbook.xlsx.writeFile(filepath).then(()=>{
      opn(filepath);
    });
  }catch (e){
    console.log(e);
  }
}