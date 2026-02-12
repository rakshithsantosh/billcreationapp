
import React from 'react';

const PatientDetails = ({ patientDetails, setPatientDetails }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="section patient-details">
            <h3>Customer / Patient Details</h3>
            <div className="grid-2">
                <label>
                    Doctor Name:
                    <input
                        type="text"
                        name="doctorName"
                        value={patientDetails.doctorName}
                        onChange={handleChange}
                        placeholder="Dr. Name"
                    />
                </label>
                <label>
                    Patient Name:
                    <input
                        type="text"
                        name="patientName"
                        value={patientDetails.patientName}
                        onChange={handleChange}
                        placeholder="Patient Name"
                    />
                </label>
            </div>
        </div>
    );
};

export default PatientDetails;
