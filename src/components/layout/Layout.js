import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NotificationContainer from '../common/NotificationContainer';

const Layout = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-700'>
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
