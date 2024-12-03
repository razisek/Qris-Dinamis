const { pad, toCRC16 } = require('../lib');

const makeString = (qris, { nominal, taxtype = 'p', fee = '0' } = {}) => {
    if (!qris) throw new Error('The parameter "qris" is required.');
    if (!nominal) throw new Error('The parameter "nominal" is required.');

    let tax = '';
    let qrisModified = qris.slice(0, -4).replace("010211", "010212");
    let qrisParts = qrisModified.split("5802ID");

    let amount = "54" + pad(nominal.length) + nominal;

    if (taxtype && fee) {
        tax = (taxtype === 'p')
            ? "55020357" + pad(fee.length) + fee
            : "55020256" + pad(fee.length) + fee;
    }

    amount += (tax.length === 0) ? "5802ID" : tax + "5802ID";
    let output = qrisParts[0].trim() + amount + qrisParts[1].trim();
    output += toCRC16(output);

    return output;
};

module.exports = makeString;
