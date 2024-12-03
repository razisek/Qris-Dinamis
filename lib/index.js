function pad(number) {
    return number < 10 ? '0' + number : number.toString();
}

function toCRC16(input) {
    function charCodeAt(input, i) {
        return input.charCodeAt(i);
    }

    let crc = 0xFFFF;
    for (let i = 0; i < input.length; i++) {
        crc ^= charCodeAt(input, i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }

    let hex = (crc & 0xFFFF).toString(16).toUpperCase();
    return hex.length === 3 ? "0" + hex : hex;
}

function getBetween(str, start, end) {
    let startIdx = str.indexOf(start);
    if (startIdx === -1) return "";
    startIdx += start.length;
    let endIdx = str.indexOf(end, startIdx);
    return str.slice(startIdx, endIdx);
}

function dataQris(qris) {
    const nmid = "ID" + getBetween(qris, "15ID", "0303");
    const id = qris.includes("A01") ? "A01" : "01";
    const merchantName = getBetween(qris, "ID59", "60").substring(2).trim().toUpperCase();

    const printData = qris.match(/(?<=ID|COM).+?(?=0118)/g);
    const printCount = printData.length;
    const printerName = printData[printCount - 1].split('.');
    const printer = printerName.length === 3 ? printerName[1] : printerName[2];

    const nnsData = qris.match(/(?<=0118).+?(?=ID)/g);
    const nns = nnsData[nnsData.length - 1].substring(0, 8);

    const crcInput = qris.slice(0, -4);
    const crcFromQris = qris.slice(-3);
    const crcComputed = toCRC16(crcInput);

    return {
        nmid: nmid,
        id: id,
        merchantName: merchantName,
        printer: printer,
        nns: nns,
        crcIsValid: crcFromQris === crcComputed
    };
}

module.exports = {
    pad,
    toCRC16,
    dataQris,
};
