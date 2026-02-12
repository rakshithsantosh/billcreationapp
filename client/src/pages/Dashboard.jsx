
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="card">
                <h2>Create New Document</h2>
                <p>Generate a new Bill or Quotation.</p>
                <Link to="/create" className="btn btn-primary">Create Document</Link>
            </div>
        </div>
    );
};

export default Dashboard;
