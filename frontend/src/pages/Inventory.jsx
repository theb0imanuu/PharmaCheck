import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useOffline } from '../hooks/useOffline';
import { saveOfflineItem, getOfflineItems, getUnsyncedItems, markAsSynced } from '../services/db';
import BatchForm from '../components/BatchForm';

const Inventory = () => {
  const isOnline = useOffline();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      if (isOnline) {
        // Online: Fetch from API
        const response = await api.get('/inventory');
        setMedicines(response.data);
      } else {
        // Offline: Fetch from IndexedDB
        const offlineData = await getOfflineItems('inventory');
        setMedicines(offlineData);
      }
    } catch (error) {
      console.error("Failed to fetch medicines", error);
      // Fallback to offline data if API fails
      const offlineData = await getOfflineItems('inventory');
      setMedicines(offlineData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [isOnline]);

  const handleAddBatch = async (newBatch) => {
    const batchWithDate = { ...newBatch, quantity: Number(newBatch.quantity), price: Number(newBatch.price) };
    
    // Save to IndexedDB (Optmistic UI + Offline support)
    const id = await saveOfflineItem('inventory', batchWithDate);
    
    if (isOnline) {
      try {
        await api.post('/inventory', batchWithDate);
        // If successful, mark as synced in DB or just reload from API
        fetchMedicines(); 
      } catch (error) {
        console.error("Online save failed, stored offline", error);
        alert("Saved offline. Will sync when online.");
        fetchMedicines(); // Reload to show local item
      }
    } else {
      fetchMedicines();
    }
  };

  // Sync mechanic could be more robust (background worker), but here's a simple trigger
  const syncOfflineData = async () => {
      const unsynced = await getUnsyncedItems('inventory');
      if (unsynced.length > 0) {
          console.log(`Syncing ${unsynced.length} items...`);
          // Loop or bulk send
          for(const item of unsynced) {
              try {
                  const { id: localId, synced, ...data } = item;
                  await api.post('/inventory', data);
                  await markAsSynced('inventory', localId);
              } catch(e) {
                  console.error("Sync failed for item", item, e);
              }
          }
          fetchMedicines();
          alert("Sync complete!");
      } else {
          alert("Nothing to sync.");
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h2>
        <div className="flex items-center gap-4">
             <span className={`px-3 py-1 rounded-full text-sm font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
            {isOnline && (
                <button onClick={syncOfflineData} className="text-blue-600 hover:underline text-sm">
                    Sync Now
                </button>
            )}
        </div>
      </div>

      <BatchForm onAdd={handleAddBatch} />

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicines.map((med, idx) => (
                <tr key={med._id || med.localId || idx}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{med.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{med.batchNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{med.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     {med.quantity < (med.safetyStock || 10) ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                     ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          OK
                        </span>
                     )}
                     {med.synced === false && <span className="ml-2 text-xs text-orange-500">(Unsynced)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {medicines.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                  No medicines found. Add a batch to get started.
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;
