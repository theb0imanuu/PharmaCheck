# 🏥 PharmaCheck: Offline-First AI Inventory System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-green?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  <br />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</div>

---

## 🚀 The Vision

**PharmaCheck** is an intelligent, offline-first inventory management system engineered specifically for small-to-medium pharmacies in regions with unreliable internet connectivity.

Pharmaceutical logistics are high-stakes; a stockout can mean a patient misses critical medication. Existing cloud-based solutions fail when the network drops. PharmaCheck bridges this gap using a **Local-First Architecture** ensuring 100% uptime for sales and inventory tracking, while leveraging the power of the cloud and **Google Gemini AI** for predictive insights when connectivity is restored.

We don't just track boxes; we predict demand, prevent waste, and ensure medicines are available when patients need them most.

---

## ✨ Key Features

### 📦 Smart Inventory Management

- **Batch-Level Tracking**: Precision tracking of expiry dates and serial numbers.
- **Real-Time Low Stock Alerts**: Visual indicators instantly highlight items below safety stock levels.

### 🧠 AI-Driven Demand Prediction

- **Gemini Intelligence**: Analyzes historical sales trends to accurately predict restocking needs for the upcoming week.
- **Expiry Risk Mitigation**: Identifies batches nearing expiry to suggest "First-Expired, First-Out" (FEFO) strategies, reducing waste.

### 🌐 Offline Resilience

- **Zero-Downtime Operations**: Sales and inventory updates are instantly persisted locally using **IndexedDB**.
- **Auto-Sync**: A robust background mechanism detects connectivity restoration and seamlessly pushes data to the central cloud database.

---

## 🏗️ Architecture

PharmaCheck utilizes a modern **MERN** stack enhanced for offline capabilities:

- **Frontend**: React + Vite (Local Logic & UI)
- **Styling**: Tailwind CSS (Responsive Design)
- **Local Database**: IndexedDB (via `idb`)
- **Backend API**: Express.js (RESTful API)
- **Cloud Database**: MongoDB (Persistent Storage)
- **Authentication**: Firebase Auth (Secure Access)
- **AI Engine**: Google Gemini Pro (Predictive Analysis)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Firebase Project (for Auth)
- Google Cloud API Key (for Gemini)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/theb0imanuu/PharmaCheck.git
    cd PharmaCheck
    ```

2.  **Backend Setup**

    ```bash
    cd backend
    npm install
    # Create a .env file with:
    # MONGO_URI=your_mongo_uri
    # GEMINI_API_KEY=your_gemini_key
    # PORT=5000
    npm run dev
    ```

3.  **Frontend Setup**

    ```bash
    cd ../frontend
    npm install
    # Create a .env file with your Firebase config
    npm run dev
    ```

4.  **Access the App**
    Open `http://localhost:5173` in your browser.

---

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features, bug fixes, or enhancements.

---
