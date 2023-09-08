import path from "path";
import {Socket} from "socket.io";
import * as fs from "fs";
import { print } from "@00f100/pdf-to-printer";
export default async function (socket: Socket, {data}) {
  console.log(data, path.resolve(data))
  const exists = fs.existsSync(path.resolve(data));
  console.log(fs.readFileSync(data))
  print(data, {
    sumatraPdfPath: path.resolve("./pdf.exe")
  }).then(console.log)
}
