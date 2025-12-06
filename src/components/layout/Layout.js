import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';
import UserNotificationContainer from '../common/UserNotificationContainer';

const Layout = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 transition-colors duration-700' style={{ overflow: 'visible' }}>
      <Header />

      <main className='flex-1 pb-16 md:pb-0' style={{ overflow: 'visible' }}>
        {children}
      </main>

      <Footer />
      <BottomNavigation />
      <UserNotificationContainer />
    </div>
  );
};

export default Layout;
