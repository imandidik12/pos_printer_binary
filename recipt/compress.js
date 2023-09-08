const UPX = require('upx')()

const file = require("path").resolve("./dist/recipt-printer.exe")
const outFile = require("path").resolve("./release/recipt-printer.exe")
console.log(file)

UPX(file)
.output(outFile)
.start().then(console.log)