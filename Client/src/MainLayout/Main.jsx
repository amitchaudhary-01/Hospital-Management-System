import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';
import AOSProvider from '../components/AOSProvider';

const Main = () => {
  return (
    <AOSProvider>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navbar />
        
        {/* All nested routes rendered here will now support AOS */}
        <main className="flex-grow">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </AOSProvider>
  );
};

export default Main;