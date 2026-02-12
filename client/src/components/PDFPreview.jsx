
import React from 'react';
import axios from 'axios';

const PDFPreview = ({ data }) => {
    const handleDownload = async () => {
        try {
            const response = await axios.post('/api/generate-pdf', data, {
                responseType: 'blob', // Important for handling binary data
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${data.type}_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Ensure backend is running.');
        }
    };

    return (
        <div className="section pdf-action">
            <button className="btn-primary" onClick={handleDownload}>
                Download PDF
            </button>
        </div>
    );
};

export default PDFPreview;
