const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');

// @desc    Get all medicines
// @route   GET /api/inventory
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({}).sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new medicine batch
// @route   POST /api/inventory
// @access  Private
const addMedicine = async (req, res) => {
  const { name, batchNumber, expiryDate, quantity, price, category, safetyStock } = req.body;

  try {
    const medicine = new Medicine({
      name,
      batchNumber,
      expiryDate,
      quantity,
      price,
      category,
      safetyStock
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update medicine stock (e.g. usage or restock)
// @route   PUT /api/inventory/:id
// @access  Private
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      medicine.name = req.body.name || medicine.name;
      medicine.quantity = req.body.quantity !== undefined ? req.body.quantity : medicine.quantity;
      medicine.price = req.body.price || medicine.price;
      
      const updatedMedicine = await medicine.save();
      res.json(updatedMedicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Record a sale
// @route   POST /api/inventory/sale
// @access  Private
const recordSale = async (req, res) => {
  const { items, totalAmount, paymentMethod, localId, soldAt } = req.body;
  // items: [{ medicineId, quantity, priceAtSale, ... }]

  const session = await Medicine.startSession();
  session.startTransaction();

  try {
    // 1. Create Sale Record
    const sale = new Sale({
      medicines: items,
      totalAmount,
      paymentMethod,
      localId,
      soldAt: soldAt || Date.now()
    });

    // 2. Decrement Stock
    for (const item of items) {
       const medicine = await Medicine.findById(item.medicineId).session(session);
       if (!medicine) {
           throw new Error(`Medicine not found: ${item.name}`);
       }
       if (medicine.quantity < item.quantity) {
           throw new Error(`Insufficient stock for: ${medicine.name}`);
       }
       medicine.quantity -= item.quantity;
       await medicine.save({ session });
    }

    await sale.save({ session });
    await session.commitTransaction();
    
    res.status(201).json(sale);

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Sync offline sales
// @route   POST /api/inventory/sync
// @access  Private
const syncSales = async (req, res) => {
    // Basic implementation: Client sends array of sales
    // Server processes them one by one/bulk
    const { sales } = req.body; 
    
    if(!sales || !sales.length) {
        return res.status(200).json({ message: "No sales to sync" });
    }

    const session = await Medicine.startSession();
    session.startTransaction();

    try {
        const results = [];
        for (const saleData of sales) {
            // Check if localId already exists to prevent dupes
            const existing = await Sale.findOne({ localId: saleData.localId });
            if(existing) {
                results.push({ localId: saleData.localId, status: 'already_synced' });
                continue;
            }

            // Create sale and update stock
            const sale = new Sale({
                ...saleData,
                synced: true
            });

             // Decrement Stock
            for (const item of saleData.medicines) {
                const medicine = await Medicine.findById(item.medicineId).session(session);
                if (medicine) {
                     medicine.quantity -= item.quantity;
                     await medicine.save({ session });
                }
                // If medicine not found (deleted?), we might just record the sale without stock update or log warning
            }
            await sale.save({ session });
            results.push({ localId: saleData.localId, status: 'synced', id: sale._id });
        }

        await session.commitTransaction();
        res.status(200).json(results);

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
}

module.exports = {
  getMedicines,
  addMedicine,
  updateMedicine,
  recordSale,
  syncSales
};
