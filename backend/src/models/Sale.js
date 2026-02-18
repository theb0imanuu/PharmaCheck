const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  medicines: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    name: String, // Snapshot of name in case medicine is deleted
    batchNumber: String,
    quantity: {
      type: Number,
      required: true
    },
    priceAtSale: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Mobile Money', 'Card', 'Other'],
    default: 'Cash'
  },
  synced: {
      type: Boolean,
      default: true
  },
  localId: {
      type: String, // For matching with IndexedDB records
      required: false
  },
  soldAt: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);
