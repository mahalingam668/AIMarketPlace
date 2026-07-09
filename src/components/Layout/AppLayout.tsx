import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from '../footer/Footer';
import { useAppSelector } from '../../store';
import './AppLayout.css';

const AppLayout: React.FC = () => {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const theme = useAppSelector((s) => s.ui.theme);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__wrapper">
        <TopBar />
        <main className={`app-layout__content ${collapsed ? 'app-layout__content--collapsed' : ''}`}>
          <div className="app-layout__page-container">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
