
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const generatePDF = async (data) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const {
        type,
        firmDetails,
        items,
        calculations,
    } = data;

    let y = height - 50;

    // Header - Document Type
    page.drawText(type.toUpperCase(), {
        x: 50,
        y: y,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    y -= 30;

    // Firm Details
    page.drawText(firmDetails.firmName || 'Firm Name', { x: 50, y, size: 14, font: boldFont });
    y -= 20;
    page.drawText(firmDetails.address || 'Address', { x: 50, y, size: 10, font });
    y -= 15;
    page.drawText(`GST: ${firmDetails.gst || '-'}`, { x: 50, y, size: 10, font });
    page.drawText(`Contact: ${firmDetails.contact || '-'}`, { x: 300, y, size: 10, font });
    y -= 15;
    page.drawText(`DL: ${firmDetails.dl || '-'}`, { x: 50, y, size: 10, font });

    y -= 40;

    // Table Configuration
    const startX = 40;
    const endX = width - 40;
    const tableWidth = endX - startX;
    const tableFontSize = 9;
    const padding = 5; // Internal cell padding

    // Column Configuration (Based on User's Percentages)
    // S.No: 5%, Part: 25%, Qty: 8%, Batch: 12%, Exp: 10%, Mfr: 12%, Rate: 13%, Total: 15%
    const columns = [
        { header: 'S.No', width: tableWidth * 0.05, align: 'center' },
        { header: 'Particulars', width: tableWidth * 0.25, align: 'left' },
        { header: 'Qty', width: tableWidth * 0.08, align: 'center' },
        { header: 'Batch', width: tableWidth * 0.12, align: 'left' },
        { header: 'Exp', width: tableWidth * 0.10, align: 'left' },
        { header: 'Mfr', width: tableWidth * 0.12, align: 'left' },
        { header: 'Rate', width: tableWidth * 0.13, align: 'right' },
        { header: 'Total', width: tableWidth * 0.15, align: 'right' },
    ];

    // Helper to draw text with alignment and truncation
    const drawCell = (lines, x, y, colWidth, align, fontToUse, pageToDrawOn) => {
        lines.forEach((line, i) => {
            const lineWidth = fontToUse.widthOfTextAtSize(line, tableFontSize);
            let drawX = x;

            if (align === 'center') {
                drawX = x + (colWidth - lineWidth) / 2;
            } else if (align === 'right') {
                drawX = x + colWidth - lineWidth - padding;
            } else {
                drawX = x + padding;
            }

            pageToDrawOn.drawText(line, { x: drawX, y: y - (i * (tableFontSize + 2)), size: tableFontSize, font: fontToUse });
        });
    };

    // Strict Word Wrap Helper
    const wordWrap = (text, maxWidth, font, size) => {
        if (!text) return [''];
        const str = String(text);

        const lines = [];
        let currentLine = "";

        // Split by space first to respect natural breaks
        const paragraphs = str.split('\n');

        for (const paragraph of paragraphs) {
            const words = paragraph.split(' ');

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const wordWidth = font.widthOfTextAtSize(word, size);

                // Case 1: Word itself is longer than maxWidth -> Force break
                if (wordWidth > maxWidth) {
                    if (currentLine.length > 0) {
                        lines.push(currentLine);
                        currentLine = "";
                    }

                    let tempWord = "";
                    for (const char of word) {
                        if (font.widthOfTextAtSize(tempWord + char, size) <= maxWidth) {
                            tempWord += char;
                        } else {
                            lines.push(tempWord);
                            tempWord = char;
                        }
                    }
                    currentLine = tempWord + " ";
                }
                // Case 2: Word fits in current line
                else {
                    const testLine = currentLine + word + " ";
                    if (font.widthOfTextAtSize(testLine, size) <= maxWidth) {
                        currentLine = testLine;
                    } else {
                        lines.push(currentLine.trim());
                        currentLine = word + " ";
                    }
                }
            }
            if (currentLine.trim().length > 0) {
                lines.push(currentLine.trim());
                currentLine = "";
            }
        }
        return lines.length > 0 ? lines : [''];
    };

    // Helper to draw Header
    const drawHeader = (currentPage, currentY) => {
        let currentX = startX;
        columns.forEach(col => {
            let drawX = currentX + padding;
            const textWidth = boldFont.widthOfTextAtSize(col.header, 10);
            if (col.align === 'center' || col.align === 'right') {
                drawX = currentX + (col.width - textWidth) / 2;
            }
            currentPage.drawText(col.header, { x: drawX, y: currentY, size: 10, font: boldFont });
            currentX += col.width;
        });

        const lineY = currentY - 5;
        currentPage.drawLine({ start: { x: startX, y: lineY }, end: { x: endX, y: lineY }, thickness: 1, color: rgb(0, 0, 0) });
        return lineY - 15; // Return new Y
    };

    // Initial Header Draw
    y -= 5; // Adjust Y before header
    y = drawHeader(page, y);

    let currentPage = page;

    // Draw Body
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const rowData = [
            (index + 1).toString(),
            item.particulars || '',
            item.quantity?.toString() || '0',
            item.batch || '',
            item.expiry || '',
            item.manufacturer || '',
            parseFloat(item.rate || 0).toFixed(2),
            parseFloat(item.total || 0).toFixed(2)
        ];

        // 1. Calculate lines for each cell with strict safety buffer
        // Subtract 2 * padding (left + right)
        const safetyWidth = (width) => width - (padding * 2);

        const rowLines = rowData.map((text, i) => {
            return wordWrap(text, safetyWidth(columns[i].width), font, tableFontSize);
        });

        // 2. Determine Max Lines in this Row
        const maxLines = Math.max(...rowLines.map(l => l.length));
        const rowHeight = maxLines * (tableFontSize + 3) + 10; // +10 padding

        // Check for page break
        if (y - rowHeight < 50) {
            currentPage = pdfDoc.addPage();
            y = height - 50; // Reset Y for new page
            y = drawHeader(currentPage, y);
        }

        // 3. Draw Cells
        let currentX = startX;
        rowLines.forEach((lines, i) => {
            drawCell(lines, currentX, y, columns[i].width, columns[i].align, font, currentPage);
            currentX += columns[i].width;
        });

        // 4. Move Y
        y -= rowHeight;
    }

    // Draw final line
    currentPage.drawLine({ start: { x: startX, y: y + 5 }, end: { x: endX, y: y + 5 }, thickness: 1, color: rgb(0, 0, 0) });

    // Move Y for calculations section
    y -= 20;

    // Check if calculations fit on page, else add new page
    if (y < 100) {
        currentPage = pdfDoc.addPage();
        y = height - 50;
    }

    // Calculations
    const calcX = width - 200;
    currentPage.drawText(`Subtotal: ${calculations.subtotal.toFixed(2)}`, { x: calcX, y, size: 10, font });
    y -= 15;
    if (calculations.discountPercentage > 0) {
        currentPage.drawText(`Discount (${calculations.discountPercentage}%): -${calculations.discountAmount.toFixed(2)}`, { x: calcX, y, size: 10, font });
        y -= 15;
    }
    currentPage.drawText(`Grand Total: ${calculations.finalAmount.toFixed(2)}`, { x: calcX, y, size: 12, font: boldFont });

    y -= 50;

    // Footer & Disclaimer
    const disclaimer = "Goods once sold cannot be taken back or exchanged. Excess collection by oversight will be refunded.";
    currentPage.drawText(disclaimer, { x: 50, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) });

    y -= 40;

    // Signature
    currentPage.drawLine({ start: { x: width - 200, y }, end: { x: width - 50, y }, thickness: 1 });
    currentPage.drawText("Authorized Signatory", { x: width - 180, y: y - 15, size: 10, font });

    return await pdfDoc.save();
};

module.exports = { generatePDF };
