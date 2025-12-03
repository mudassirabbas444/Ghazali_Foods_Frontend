import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NotificationContainer from '../common/NotificationContainer';

const Layout = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 transition-colors duration-700'>
      <Header />

      <main className='flex-1'>
        {children}
      </main>

      <Footer />
      <NotificationContainer />
    </div>
  );
};

export default Layout;
