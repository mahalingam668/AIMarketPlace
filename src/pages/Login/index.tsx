import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { login } from '../../store/slices/authSlice';
import AuthVisual from './AuthVisual';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('alex.chen@nexusai.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ name: 'Alex Chen', email, role: 'Admin' }));
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="auth">
      <div className="auth__form-side">
        <motion.div className="auth__card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="auth__brand">
            <span className="auth__brand-icon"><Sparkles size={18} /></span>
            YAKKAY <span>AI Line</span>
          </div>
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__subtitle">Sign in to your workspace to manage models, governance, and integrations.</p>

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="auth__field">
              <span>Work Email</span>
              <div className="auth__input-wrap">
                <Mail size={14} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </label>
            <label className="auth__field">
              <span>Password</span>
              <div className="auth__input-wrap">
                <Lock size={14} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Any value works in this demo" />
              </div>
            </label>
            <button type="submit" className="auth__submit">Sign In</button>
          </form>

          <p className="auth__footnote">
            Don't have a workspace? <Link to="/register">Create one</Link>
          </p>
        </motion.div>
      </div>
      <AuthVisual />
    </div>
  );
}

export default Login;
