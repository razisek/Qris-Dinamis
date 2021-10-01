var QRCode = require('qrcode');
var Jimp = require('jimp');
var fs = require('fs');
const { pad, toCRC16, dataQris } = require('./lib')

let tax = '';
//isi data qris
let qris = "00020101021126570011ID.DANA.WWW011893600915305112759002090511275900303UMI51440014ID.CO.QRIS.WWW0215ID10200381580170303UMI5204561153033605802ID5913Razisek Store6013Kab. Magelang6105564846304C7D1";
//isi nominal
let nominal = "5000";
//pajak (opsional)
//jenis pajak
let taxtype = 'p' // r/p, r = rupiah, p = persen
//nominal pajak
let fee = "10" //contoh persen 10%

let qris2 = qris.slice(0, -4);
let replaceQris = qris2.replace("010211", "010212");
let pecahQris = replaceQris.split("5802ID");
let uang = "54" + pad(nominal.length) + nominal;
tax = (taxtype == 'p') ? "55020357" + pad(fee.length) + fee : "55020256" + pad(fee.length) + fee;
uang += (tax.length == 0) ? "5802ID" : tax + "5802ID";

let output = pecahQris[0].trim() + uang + pecahQris[1].trim();
output += toCRC16(output);
console.log(output) //output

//make output file image
QRCode.toFile('tmp.png', output, { margin: 2, scale: 10 }, async function (err, url) {
    let data = dataQris(qris);
    var text = data.merchantName;
    var qr = await Jimp.read('tmp.png');
    Jimp.read('assets/template.png', (err, image) => {
        if (err) console.log(err);
        var w = image.bitmap.width
        var h = image.bitmap.height
        Jimp.loadFont((text.length > 18) ? 'assets/font/BebasNeueSedang/BebasNeue-Regular.ttf.fnt' : 'assets/font/BebasNeue/BebasNeue-Regular.ttf.fnt').then(fonttitle => {
            Jimp.loadFont((text.length > 28) ? 'assets/font/RobotoSedang/Roboto-Regular.ttf.fnt' : 'assets/font/RobotoBesar/Roboto-Regular.ttf.fnt').then(fontnmid => {
                Jimp.loadFont('assets/font/RobotoKecil/Roboto-Regular.ttf.fnt').then(fontcetak => {
                    image
                        .composite(qr, w / 4 - 30, h / 4 + 68)
                        .print(fonttitle, w / 5 - 30, h / 5 + 68, { text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE, }, w / 1.5, (text.length > 28) ? -180 : -210)
                        .print(fontnmid, w / 5 - 30, h / 5 + 68, { text: `NMID : ${data.nmid}`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE, }, w / 1.5, (text.length > 28) ? +20 : -45)
                        .print(fontnmid, w / 5 - 30, h / 5 + 68, { text: data.id, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE, }, w / 1.5, (text.length > 28) ? +110 : +90)
                        .print(fontcetak, w / 20, 1205, `Dicetak oleh: ${data.nns}`)
                        .write(`output/qr ${text}.jpg`);
                    fs.unlinkSync('tmp.png')
                })
            })
        });
    });
});