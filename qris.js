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

qris = qris.slice(0, -4);
let replaceQris = qris.replace("010211", "010212");
let pecahQris = replaceQris.split("5802ID");
let uang = "54" + pad(nominal.length) + nominal;
tax = (taxtype == 'p') ? "55020357" + pad(fee.length) + fee : "55020256" + pad(fee.length) + fee;
uang += (tax.length == 0) ? "5802ID" : tax + "5802ID";

let output = pecahQris[0].trim() + uang + pecahQris[1].trim();
output += toCRC16(output);
console.log(output) //output

//function
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function toCRC16(str) {
    function charCode(str, i) {
        let get = str.substr(i, 1)
        return get.charCodeAt()
    }

    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
        crc ^= charCode(str, c) << 8;
        for (let i = 0; i < 8; i++) {
            crc = (crc & 0x8000) ? crc = (crc << 1) ^ 0x1021 : crc = crc << 1;
        }
    }
    hex = crc & 0xFFFF;
    hex = hex.toString(16);
    hex = hex.toUpperCase();
    if (hex.length == 3) {
        hex = "0" + hex;
    }
    return hex;
}