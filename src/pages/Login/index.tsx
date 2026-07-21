import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, Building2, Code2, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { login } from '../../store/slices/authSlice';
import { ROLE_LANDING_PATH, type AccountRole } from '../../modules/auth/roles';
import AccountTypePicker, { type AccountTypeOption } from './AccountTypePicker';
import AuthVisual from './AuthVisual';
import './Auth.css';

const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    value: 'Company',
    label: 'Company',
    description: 'Manage AI product listings and your team’s CRM.',
    icon: Building2,
  },
  {
    value: 'Developer',
    label: 'Developer',
    description: 'Manage gigs, proposals, and freelance work.',
    icon: Code2,
  },
];

// This demo has no auth backend to verify a real admin credential against, so
// the elevated Admin role is gated behind a shared access code instead of a
// one-click self-select radio option — closes the "any visitor becomes admin"
// hole while keeping the admin dashboard reachable for evaluation.
const DEMO_ADMIN_ACCESS_CODE = 'YAKKAY-ADMIN-2026';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('alex.chen@yakkay.com');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AccountRole>('Company');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const from = (location.state as { from?: Location })?.from?.pathname;

    if (isAdminMode) {
      if (adminCode.trim() !== DEMO_ADMIN_ACCESS_CODE) {
        setAdminError('Incorrect access code.');
        return;
      }
      dispatch(login({ name: 'Alex Chen', email, role: 'Admin' }));
      navigate(from || ROLE_LANDING_PATH.Admin, { replace: true });
      return;
    }

    dispatch(login({ name: 'Alex Chen', email, role }));
    navigate(from || ROLE_LANDING_PATH[role], { replace: true });
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

          {isAdminMode ? (
            <div className="auth__admin-banner">
              <ShieldCheck size={15} />
              <span>Platform administrator sign-in — requires an access code.</span>
            </div>
          ) : (
            <AccountTypePicker
              legend="Sign in as"
              name="loginAccountType"
              options={ACCOUNT_TYPE_OPTIONS}
              value={role}
              onChange={setRole}
            />
          )}

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="auth__field">
              <span>Work Email</span>
              <div className="auth__input-wrap">
                <Mail size={14} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </label>
            {isAdminMode ? (
              <label className="auth__field">
                <span>Admin access code</span>
                <div className="auth__input-wrap">
                  <ShieldCheck size={14} />
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => {
                      setAdminCode(e.target.value);
                      setAdminError('');
                    }}
                    placeholder="Enter access code"
                  />
                </div>
                {adminError && <span className="auth__field-error">{adminError}</span>}
              </label>
            ) : (
              <label className="auth__field">
                <span>Password</span>
                <div className="auth__input-wrap">
                  <Lock size={14} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Any value works in this demo" />
                </div>
              </label>
            )}
            <button type="submit" className="auth__submit">Sign In</button>
          </form>

          <button
            type="button"
            className="auth__mode-toggle"
            onClick={() => {
              setIsAdminMode((cur) => !cur);
              setAdminError('');
            }}
          >
            {isAdminMode ? '← Back to account sign in' : 'Platform administrator? Sign in with an access code'}
          </button>

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
