import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import '../StatusPage.css';

function Forbidden() {
  const navigate = useNavigate();
  return (
    <div className="status-page">
      <motion.div className="status-page__inner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="status-page__icon"><ShieldAlert size={28} /></div>
        <h1>403</h1>
        <h2>Access denied</h2>
        <p>Your account doesn't have permission to view this page.</p>
        <div className="status-page__actions">
          <button type="button" className="status-page__btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button type="button" className="status-page__btn-secondary" onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </motion.div>
    </div>
  );
}

export default Forbidden;
