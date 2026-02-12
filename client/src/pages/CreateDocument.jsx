
import React, { useState, useEffect } from 'react';
import FirmDetails from '../components/FirmDetails';
import LineItemTable from '../components/LineItemTable';
import DiscountSection from '../components/DiscountSection';
import SummarySection from '../components/SummarySection';
import FooterSection from '../components/FooterSection';
import PDFPreview from '../components/PDFPreview';

import PatientDetails from '../components/PatientDetails';

const CreateDocument = () => {
    const [type, setType] = useState('Bill');
    const [firmDetails, setFirmDetails] = useState({
        firmName: '',
        address: '',
        gst: '',
        dl: '',
        contact: ''
    });

    const [patientDetails, setPatientDetails] = useState({
        doctorName: '',
        patientName: ''
    });

    const [items, setItems] = useState([
        {
            particulars: '',
            quantity: 1,
            batch: '',
            expiry: '',
            manufacturer: '',
            rate: 0,
            total: 0
        }
    ]);

    const [discount, setDiscount] = useState(0);
    const [calculations, setCalculations] = useState({
        subtotal: 0,
        discountAmount: 0,
        finalAmount: 0,
        discountPercentage: 0
    });

    useEffect(() => {
        const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
        const discountAmount = (subtotal * discount) / 100;
        const finalAmount = subtotal - discountAmount;

        setCalculations({
            subtotal,
            discountAmount,
            finalAmount,
            discountPercentage: discount
        });
    }, [items, discount]);

    return (
        <div className="create-document-container">
            <div className="header-actions">
                <h1>{type} Creation</h1>
                <div className="type-toggle">
                    <label>Document Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Bill">Bill</option>
                        <option value="Quotation">Quotation</option>
                    </select>
                </div>
            </div>

            <FirmDetails firmDetails={firmDetails} setFirmDetails={setFirmDetails} />
            <PatientDetails patientDetails={patientDetails} setPatientDetails={setPatientDetails} />
            <LineItemTable items={items} setItems={setItems} />

            <div className="bottom-section">
                <DiscountSection discount={discount} setDiscount={setDiscount} />
                <SummarySection calculations={calculations} />
            </div>

            <FooterSection />

            <PDFPreview data={{
                type,
                firmDetails,
                patientDetails,
                items,
                calculations
            }} />
        </div>
    );
};

export default CreateDocument;
