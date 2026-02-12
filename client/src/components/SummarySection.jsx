
import React from 'react';

const SummarySection = ({ calculations }) => {
    return (
        <div className="section summary-section">
            <div className="summary-row">
                <span>Subtotal:</span>
                <span>{calculations.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
                <span>Discount ({calculations.discountPercentage}%):</span>
                <span>- {calculations.discountAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
                <span>Grand Total:</span>
                <span>{calculations.finalAmount.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default SummarySection;
