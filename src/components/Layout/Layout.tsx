import React, { useState, useEffect } from 'react';
import { Navbar } from '../NavBar/Navbar';
import { useAppDispatch } from '../../hooks/useStore';
import { fetchUserData } from '../../redux/auth/slice';
import clsx from 'clsx';
import { HistorySidebar } from '../HistoryChat/HistorySidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Explicitly type the state as boolean
  const [isHistoryCompressed, setIsHistoryCompressed] = useState<boolean>(() => {
    const stored = localStorage.getItem('historyCompressed');
    return stored === null ? true : stored === 'true';
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('historyCompressed', String(isHistoryCompressed));
  }, [isHistoryCompressed]);

  const toggleHistoryCompression = (state: boolean) => {
    setIsHistoryCompressed(state);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside
        className={clsx(
          'transition-all duration-500 ease-in-out fixed md:static z-50 h-full',
          isHistoryCompressed ? 'w-0' : 'w-full md:w-64'
        )}
        aria-hidden={isHistoryCompressed}
      >
        <HistorySidebar
          isCompressed={isHistoryCompressed}
          onToggleCompression={toggleHistoryCompression}
        />
      </aside>
      <div className="flex flex-col flex-grow">
        <Navbar
          isCompressed={isHistoryCompressed}
          onToggleCompression={toggleHistoryCompression}
        />
        <main className="flex-grow overflow-y-hidden scrollbar-hide max-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;