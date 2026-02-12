
import React from 'react';

const FirmDetails = ({ firmDetails, setFirmDetails }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFirmDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="section firm-details">
            <h3>Firm Details</h3>
            <div className="grid-2">
                <label>
                    Firm Name:
                    <input type="text" name="firmName" value={firmDetails.firmName} onChange={handleChange} placeholder="Enter Firm Name" />
                </label>
                <label>
                    Address:
                    <input type="text" name="address" value={firmDetails.address} onChange={handleChange} placeholder="Enter Address" />
                </label>
                <label>
                    GST Number:
                    <input type="text" name="gst" value={firmDetails.gst} onChange={handleChange} placeholder="GST Number" />
                </label>
                <label>
                    DL Number:
                    <input type="text" name="dl" value={firmDetails.dl} onChange={handleChange} placeholder="DL Number" />
                </label>
                <label>
                    Contact Number:
                    <input type="text" name="contact" value={firmDetails.contact} onChange={handleChange} placeholder="Contact Number" />
                </label>
            </div>
        </div>
    );
};

export default FirmDetails;
