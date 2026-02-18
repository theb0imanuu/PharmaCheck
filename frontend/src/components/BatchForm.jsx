import React, { useState } from 'react';

const BatchForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    price: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      batchNumber: '',
      expiryDate: '',
      quantity: '',
      price: '',
      category: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Batch</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" name="name" placeholder="Medicine Name" required 
          value={formData.name} onChange={handleChange}
          className="p-2 border rounded"
        />
        <input 
          type="text" name="batchNumber" placeholder="Batch Number" required 
          value={formData.batchNumber} onChange={handleChange}
          className="p-2 border rounded"
        />
        <input 
          type="date" name="expiryDate" required 
          value={formData.expiryDate} onChange={handleChange}
          className="p-2 border rounded"
        />
        <input 
          type="number" name="quantity" placeholder="Quantity" required 
          value={formData.quantity} onChange={handleChange}
          className="p-2 border rounded"
        />
        <input 
          type="number" name="price" placeholder="Price per Unit" required 
          value={formData.price} onChange={handleChange}
          className="p-2 border rounded"
        />
        <input 
          type="text" name="category" placeholder="Category" 
          value={formData.category} onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Batch
      </button>
    </form>
  );
};

export default BatchForm;
