import React, { useState } from 'react';
import api from '../api/axios';
import { useOffline } from '../hooks/useOffline';

const Predictor = () => {
    const isOnline = useOffline();
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePredict = async () => {
        if (!isOnline) {
            setError("AI predictions require an internet connection.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.get('/ai/predict');
            setPredictions(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch predictions. Ensure backend is running and Gemini key is set.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Stock Predictor</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-700">
                    PharmaCheck AI analyzes your current stock levels and sales history to confirm restocking needs and identify expiring batches.
                </p>
            </div>

            <button 
                onClick={handlePredict}
                disabled={loading || !isOnline}
                className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition
                    ${loading || !isOnline 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {loading ? 'Analyzing Data...' : 'Generate Insights'}
            </button>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {predictions && (
                <div className="mt-8 grid gap-8 md:grid-cols-2">
                    {/* Restock Recommendations */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Restock Recommendations</h3>
                        {predictions.restock_recommendations?.length === 0 ? (
                            <p className="text-gray-500">No immediate restocking needed.</p>
                        ) : (
                            <ul className="space-y-4">
                                {predictions.restock_recommendations?.map((item, idx) => (
                                    <li key={idx} className="border-b pb-2 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold">{item.medicine}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                item.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{item.suggested_action}</p>
                                        <p className="text-xs text-gray-400 italic mt-1">"{item.reason}"</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Expiry Alerts */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4 text-orange-700">Expiry Risk Alerts</h3>
                        {predictions.expiry_alerts?.length === 0 ? (
                            <p className="text-gray-500">No expiring batches found.</p>
                        ) : (
                            <ul className="space-y-4">
                                {predictions.expiry_alerts?.map((item, idx) => (
                                    <li key={idx} className="border-b pb-2 last:border-0">
                                        <div className="font-bold">{item.medicine} <span className="font-normal text-gray-500">(Batch: {item.batch})</span></div>
                                        <p className="text-sm text-red-600 font-medium">Expires in {item.days_remaining} days</p>
                                        <p className="text-sm text-gray-600 mt-1">Advice: {item.advice}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictor;
