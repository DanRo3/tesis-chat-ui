import React, { useState } from 'react';
import { HistorySidebar } from '../HistoryChat/HistorySidebar';
import { Navbar } from '../NavBar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isHistoryCompressed, setIsHistoryCompressed] = useState(true);

  const toggleHistoryCompression = (state: boolean) => {
    setIsHistoryCompressed(state);
  };

  return (
    <div className="flex h-screen bg-white playfair">
      {/* Sidebar de historial */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isHistoryCompressed ? "md:w-0 w-0" : "md:w-64 w-full"}
          h-full top-0 left-0 z-50
        `}
      >
        <HistorySidebar 
          isCompressed={isHistoryCompressed} 
          onToggleCompression={toggleHistoryCompression} 
        />
      </div>
      <div className={`flex flex-col flex-grow ${isHistoryCompressed ? "md:w-64 w-full" : "md:w-0 w-0"}`}>
        <Navbar 
          isCompressed={isHistoryCompressed} 
          onToggleCompression={toggleHistoryCompression}
        />
        <div className="flex-grow max-h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;