import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Predictor from './pages/Predictor';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">PharmaCheck</h1>
              <div className="space-x-4">
                <Link to="/" className="hover:underline">Inventory</Link>
                <Link to="/predict" className="hover:underline">AI Predictor</Link>
              </div>
            </div>
          </nav>

          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Inventory />} />
              <Route path="/predict" element={<Predictor />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
