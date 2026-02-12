
const { generatePDF } = require('./services/pdfService');
const fs = require('fs');

const testData = {
    type: 'Bill',
    firmDetails: {
        firmName: 'Test Firm',
        address: '123 Test St',
        gst: 'GST123',
        dl: 'DL123',
        contact: '9999999999'
    },
    patientDetails: {
        doctorName: 'Dr. Strange',
        patientName: 'Peter Parker'
    },
    items: [
        { particulars: 'Item 1', quantity: 1, batch: 'B1', expiry: '2025', manufacturer: 'Mfr A', rate: 100, total: 100 }
    ],
    calculations: {
        subtotal: 100,
        discountAmount: 0,
        finalAmount: 100,
        discountPercentage: 0
    }
};

async function run() {
    console.log('Starting PDF generation test...');
    try {
        const pdfBytes = await generatePDF(testData);
        fs.writeFileSync('test_output.pdf', pdfBytes);
        console.log('PDF generated successfully: test_output.pdf');
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
