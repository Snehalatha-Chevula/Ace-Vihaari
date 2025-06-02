import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Layout({ children, activeView, onViewChange }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar activeView={activeView} onViewChange={onViewChange} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Layout;