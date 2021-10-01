function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function toCRC16(str) {
    function charCodeAt(str, i) {
        let get = str.substr(i, 1)
        return get.charCodeAt()
    }

    let crc = 0xFFFF;
    let strlen = str.length;
    for (let c = 0; c < strlen; c++) {
        crc ^= charCodeAt(str, c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
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

function get_between(string, start, end) {
    string = " " + string;
    let ini = string.indexOf(start);
    if (ini == 0) return "";
    ini += start.length;
    let len = string.indexOf(end, ini) - ini;
    return string.substr(ini, len);
}

function dataQris(str) {
    let dump_nmid = get_between(str, "15ID", "0303");
    let nmid = "ID" + dump_nmid;
    let search_id = str.search("A01");
    let id = (search_id == "-1") ? "01" : "A01";
    let merchantName = get_between(str, "ID59", "60").substring(2).trim().toUpperCase();
    let getPencetak = str.match(/(?<=ID|COM).+?(?=0118)/g);
    let jmlPencetak = getPencetak.length;
    let getNamePencetak = getPencetak[jmlPencetak - 1].split('.');
    let pencetak = (getNamePencetak.length == 3) ? getNamePencetak[1] : getNamePencetak[2];
    let getNns = str.match(/(?<=0118).+?(?=ID)/g);
    let jmlNns = getNns.length;
    let nns = getNns[jmlNns - 1].substring(0, 8);
    let strnoncrc = str.slice(0, -4);
    let crc = str.substring(str.length - 3);
    let getCrc = toCRC16(strnoncrc);
    let cekCrc = (crc == getCrc);
    return {
        nmid: nmid,
        id: id,
        merchantName: merchantName,
        pencetak: pencetak,
        nns: nns,
        crc: cekCrc
    }
}

module.exports = {
    pad,
    toCRC16,
    dataQris,
}