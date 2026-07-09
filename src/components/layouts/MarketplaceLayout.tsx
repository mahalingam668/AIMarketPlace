import { Outlet } from 'react-router-dom';
import StickyHeader from '../header/StickyHeader';
import Footer from '../footer/Footer';
import './MarketplaceLayout.css';

function MarketplaceLayout() {
  return (
    <div className="marketplace-layout">
      <StickyHeader />
      <main className="marketplace-layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MarketplaceLayout;
