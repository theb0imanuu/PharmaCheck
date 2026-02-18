const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  safetyStock: {
    type: Number,
    default: 10, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
    timestamps: true
});

// Index for faster queries
medicineSchema.index({ name: 1, batchNumber: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
