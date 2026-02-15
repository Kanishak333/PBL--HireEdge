import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseLib = require('pdf-parse');

console.log('Library keys:', Object.keys(pdfParseLib));

const pdf = pdfParseLib.PDFParse || pdfParseLib.default || pdfParseLib;

console.log('Selected pdf object type:', typeof pdf);

async function test() {
    try {
        const dummyBuffer = Buffer.from('test pdf content');
        console.log('Attempting function call pdf(buffer)...');
        const data = await pdf(dummyBuffer);
        console.log('Success!', data.text);
    } catch (e) {
        console.log('Function call failed:', e.message);
        try {
            console.log('Attempting new pdf(buffer)...');
            const data = new pdf(dummyBuffer);
            console.log('Constructor success!', data);
        } catch (e2) {
            console.log('Constructor failed:', e2.message);
        }
    }
}

test();
