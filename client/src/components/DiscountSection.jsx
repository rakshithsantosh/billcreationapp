
import React from 'react';

const DiscountSection = ({ discount, setDiscount }) => {
    const handleChange = (e) => {
        let val = parseFloat(e.target.value) || 0;
        if (val < 0) val = 0;
        if (val > 100) val = 100;
        setDiscount(val);
    };

    return (
        <div className="section discount-section">
            <label>
                Discount (%):
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={discount}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};

export default DiscountSection;
