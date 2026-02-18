import { openDB } from 'idb';

const DB_NAME = 'PharmaCheckDB';
const STORE_NAME = 'inventory';
const SALES_STORE = 'sales';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'localId', autoIncrement: true });
        store.createIndex('synced', 'synced');
      }
      if (!db.objectStoreNames.contains(SALES_STORE)) {
        const store = db.createObjectStore(SALES_STORE, { keyPath: 'localId', autoIncrement: true });
        store.createIndex('synced', 'synced');
      }
    },
  });
};

export const saveOfflineItem = async (storeName, item) => {
    const db = await initDB();
    return db.add(storeName, { ...item, synced: false, createdAt: new Date() });
};

export const getOfflineItems = async (storeName) => {
    const db = await initDB();
    return db.getAll(storeName);
};

export const getUnsyncedItems = async (storeName) => {
    const db = await initDB();
    return db.getAllFromIndex(storeName, 'synced', false);
};

export const markAsSynced = async (storeName, id) => {
    const db = await initDB();
    const item = await db.get(storeName, id);
    if(item) {
        item.synced = true;
        await db.put(storeName, item);
    }
}

export const clearSynced = async () => {
     // Optional: clear items that are synced to keep DB small
     // or keep them for offline view
}
