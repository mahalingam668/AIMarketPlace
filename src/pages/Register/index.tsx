import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { login } from '../../store/slices/authSlice';
import AuthVisual from '../Login/AuthVisual';
import '../Login/Auth.css';

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ name: name || 'New User', email, role: 'Member' }));
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="auth">
      <div className="auth__form-side">
        <motion.div className="auth__card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="auth__brand">
            <span className="auth__brand-icon"><Sparkles size={18} /></span>
            YAKKAY <span>AI Line</span>
          </div>
          <h1 className="auth__title">Create your workspace</h1>
          <p className="auth__subtitle">Start exploring the enterprise AI marketplace in under a minute.</p>

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="auth__field">
              <span>Full Name</span>
              <div className="auth__input-wrap">
                <User size={14} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </label>
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
                <input type="password" placeholder="Any value works in this demo" />
              </div>
            </label>
            <button type="submit" className="auth__submit">Create Workspace</button>
          </form>

          <p className="auth__footnote">
            Already have a workspace? <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>
      <AuthVisual />
    </div>
  );
}

export default Register;
