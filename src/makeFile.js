const QRCode = require('qrcode');
const Jimp = require('jimp');
const { dataQris } = require('../lib');
const makeString = require('./makeString');
const fs = require('fs');

const makeFile = async (qris, { nominal, base64 = false, taxtype = 'p', fee = '0', path = '' } = {}) => {
    try {
        const qrisModified = makeString(qris, { nominal, taxtype, fee });

        await QRCode.toFile('tmp.png', qrisModified, { margin: 2, scale: 10 });

        let data = dataQris(qris);
        let text = data.merchantName;

        const qr = await Jimp.read('tmp.png');
        const image = await Jimp.read('assets/template.png');

        const w = image.bitmap.width;
        const h = image.bitmap.height;

        const fontTitle = await Jimp.loadFont(text.length > 18 ? 'assets/font/BebasNeueSedang/BebasNeue-Regular.ttf.fnt' : 'assets/font/BebasNeue/BebasNeue-Regular.ttf.fnt');
        const fontMid = await Jimp.loadFont(text.length > 28 ? 'assets/font/RobotoSedang/Roboto-Regular.ttf.fnt' : 'assets/font/RobotoBesar/Roboto-Regular.ttf.fnt');
        const fontSmall = await Jimp.loadFont('assets/font/RobotoKecil/Roboto-Regular.ttf.fnt');

        image
            .composite(qr, w / 4 - 30, h / 4 + 68)
            .print(fontTitle, w / 5 - 30, h / 5 + 68, { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, w / 1.5, text.length > 28 ? -180 : -210)
            .print(fontMid, w / 5 - 30, h / 5 + 68, { text: `NMID : ${data.nmid}`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, w / 1.5, text.length > 28 ? 20 : -45)
            .print(fontMid, w / 5 - 30, h / 5 + 68, { text: data.id, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, w / 1.5, text.length > 28 ? 110 : 90)
            .print(fontSmall, w / 20, 1205, `Dicetak oleh: ${data.nns}`);

        if (!path) {
            path = `output/${text}-${Date.now()}.jpg`;
        }

        if (base64) {
            const base64Image = await image.getBase64Async(Jimp.MIME_JPEG);
            fs.unlinkSync('tmp.png');
            return base64Image;
        } else {
            await image.writeAsync(path);
            fs.unlinkSync('tmp.png');
            return path;
        }
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = makeFile;
