const express = require('express');
const router = express.Router();
const {
  getMedicines,
  addMedicine,
  updateMedicine,
  recordSale,
  syncSales
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getMedicines)
  .post(addMedicine);

router.route('/:id')
  .put(updateMedicine);

router.post('/sale', recordSale);
router.post('/sync', syncSales);

module.exports = router;
