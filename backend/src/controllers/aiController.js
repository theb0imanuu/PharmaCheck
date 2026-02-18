const model = require('../config/gemini');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');

// @desc    Generate restock predictions
// @route   GET /api/ai/predict
// @access  Private
const getPredictions = async (req, res) => {
  try {
    // 1. Fetch relevant data (Current Stock & Recent Sales)
    const medicines = await Medicine.find({});
    
    // Get sales from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSales = await Sale.find({ soldAt: { $gte: sevenDaysAgo } });

    // 2. Prepare context for Gemini
    const stockContext = medicines.map(m => 
      `- ${m.name}: ${m.quantity} units (Expiry: ${m.expiryDate.toISOString().split('T')[0]}, Batch: ${m.batchNumber})`
    ).join('\n');

    const salesContext = recentSales.map(s => 
      `Sale on ${s.soldAt.toISOString()}: ${s.medicines.map(m => `${m.name} x${m.quantity}`).join(', ')}`
    ).join('\n');

    const prompt = `
      Act as an expert pharmacy inventory manager. 
      Analyze the following stock levels and recent sales data to provide restocking recommendations and identify expiring stock risks.
      
      Current Stock:
      ${stockContext}

      Recent Sales (Last 7 days):
      ${salesContext}

      Output JSON format ONLY:
      {
        "restock_recommendations": [
          {"medicine": "Name", "status": "Critical/Low/OK", "suggested_action": "Order X units", "reason": "High variance in sales..."}
        ],
        "expiry_alerts": [
           {"medicine": "Name", "batch": "BatchNo", "days_remaining": 12, "advice": "Discount by 20%"}
        ]
      }
    `;

    // 3. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse JSON (Handle potential markdown code blocks)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    res.json(data);

  } catch (error) {
    console.error('AI Prediction Error:', error);
    res.status(500).json({ message: 'Failed to generate predictions', error: error.message });
  }
};

module.exports = { getPredictions };
