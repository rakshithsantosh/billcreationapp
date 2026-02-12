
const express = require('express');
const router = express.Router();
const { generatePDF } = require('../services/pdfService');

router.post('/generate-pdf', async (req, res) => {
    try {
        const pdfBytes = await generatePDF(req.body);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

module.exports = router;
