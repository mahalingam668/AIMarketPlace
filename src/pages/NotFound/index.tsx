import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <motion.div className="not-found__inner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="not-found__icon"><Compass size={28} /></div>
        <h1>404</h1>
        <h2>This page hasn't been mapped yet</h2>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <div className="not-found__actions">
          <button type="button" className="not-found__btn-primary" onClick={() => navigate('/')}>Go to Home</button>
          <button type="button" className="not-found__btn-secondary" onClick={() => navigate('/browse')}>Browse Marketplace</button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
