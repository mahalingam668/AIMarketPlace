import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Building2, Code2 } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { login } from '../../store/slices/authSlice';
import { ROLE_LANDING_PATH, type AccountRole } from '../../modules/auth/roles';
import AccountTypePicker, { type AccountTypeOption } from '../Login/AccountTypePicker';
import AuthVisual from '../Login/AuthVisual';
import '../Login/Auth.css';

const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    value: 'Company',
    label: "I'm hiring",
    description: 'Company account — manage AI product listings and your team’s CRM.',
    icon: Building2,
  },
  {
    value: 'Developer',
    label: "I'm offering services",
    description: 'Developer account — manage gigs, proposals, and freelance work.',
    icon: Code2,
  },
];

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const preselectedRole = (location.state as { role?: AccountRole } | null)?.role ?? null;
  const [role, setRole] = useState<AccountRole | null>(preselectedRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    dispatch(login({ name: name || 'New User', email, role }));
    navigate(ROLE_LANDING_PATH[role], { replace: true });
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

          <AccountTypePicker
            legend="Account type"
            name="registerAccountType"
            options={ACCOUNT_TYPE_OPTIONS}
            value={role}
            onChange={setRole}
          />

          <AnimatePresence initial={false}>
            {role && (
              <motion.form
                className="auth__form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Any value works in this demo"
                    />
                  </div>
                </label>
                <button type="submit" className="auth__submit">
                  Create {role} Workspace
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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
