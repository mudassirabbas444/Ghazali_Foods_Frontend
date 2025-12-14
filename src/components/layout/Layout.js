import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';
import UserNotificationContainer from '../common/UserNotificationContainer';

const Layout = ({ children }) => {
  return (
    <div 
      className='min-h-screen flex flex-col bg-darkGreen-950 transition-colors duration-700 ios-fix' 
      style={{ 
        overflow: 'visible',
        minHeight: '-webkit-fill-available',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <Header />

      <main 
        className='flex-1 pb-16 md:pb-0 safe-bottom' 
        style={{ 
          overflow: 'visible',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)'
        }}
      >
        {children}
      </main>

      <Footer />
      <BottomNavigation />
      <UserNotificationContainer />
    </div>
  );
};

export default Layout;
