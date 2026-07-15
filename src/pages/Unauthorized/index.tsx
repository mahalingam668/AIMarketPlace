import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import '../StatusPage.css';

function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="status-page">
      <motion.div className="status-page__inner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="status-page__icon"><LogIn size={28} /></div>
        <h1>401</h1>
        <h2>Sign in required</h2>
        <p>You need to be signed in to view this page.</p>
        <div className="status-page__actions">
          <button type="button" className="status-page__btn-primary" onClick={() => navigate('/login')}>Sign In</button>
          <button type="button" className="status-page__btn-secondary" onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </motion.div>
    </div>
  );
}

export default Unauthorized;
