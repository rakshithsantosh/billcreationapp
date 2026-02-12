
import React from 'react';

const LineItemTable = ({ items, setItems }) => {
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // Auto calculate total
        if (field === 'quantity' || field === 'rate') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].rate) || 0;
            newItems[index].total = (qty * rate).toFixed(2);
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, {
            particulars: '',
            quantity: 1,
            batch: '',
            expiry: '',
            manufacturer: '',
            rate: 0,
            total: 0
        }]);
    };

    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div className="section line-items">
            <h3>Items</h3>
            <table className="item-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Particulars</th>
                        <th>Qty</th>
                        <th>Batch</th>
                        <th>Exp</th>
                        <th>Mfr</th>
                        <th>Rate</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td><input type="text" value={item.particulars} onChange={(e) => handleItemChange(index, 'particulars', e.target.value)} /></td>
                            <td><input type="number" min="1" step="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} /></td>
                            <td><input type="text" value={item.batch} onChange={(e) => handleItemChange(index, 'batch', e.target.value)} /></td>
                            <td><input type="date" value={item.expiry} onChange={(e) => handleItemChange(index, 'expiry', e.target.value)} /></td>
                            <td><input type="text" value={item.manufacturer} onChange={(e) => handleItemChange(index, 'manufacturer', e.target.value)} /></td>
                            <td><input type="number" step="0.01" min="0" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} /></td>
                            <td>{item.total}</td>
                            <td><button className="btn-danger" onClick={() => deleteItem(index)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn-secondary" onClick={addItem}>+ Add Item</button>
        </div>
    );
};

export default LineItemTable;
