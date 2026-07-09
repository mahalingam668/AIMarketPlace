import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Switch from '@radix-ui/react-switch';
import {
  User,
  Mail,
  Shield,
  Sun,
  Moon,
  Bell,
  CreditCard,
  KeyRound,
  LogOut,
  Sparkles,
  Check,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../store';
import { setTheme } from '../store/slices/uiSlice';
import { currentUser } from '../data/mockData';
import './Settings.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function Settings() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  const [notifications, setNotifications] = useState({
    productUpdates: true,
    usageAlerts: true,
    billingEmails: true,
    weeklyDigest: false,
  });

  const handleSaveProfile = () => {
    toast.success('Profile changes saved successfully!');
  };

  return (
    <motion.div
      className="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="settings__header">
        <h1>Settings</h1>
        <p>Manage your account, preferences, and workspace</p>
      </div>

      {/* Profile Section */}
      <motion.section className="settings__card" variants={sectionVariants} initial="hidden" animate="visible">
        <div className="settings__card-header">
          <User size={18} />
          <h3>Profile</h3>
        </div>

        <div className="settings__profile-row">
          <div className="settings__avatar">{getInitials(currentUser.name)}</div>
          <div className="settings__profile-info">
            <span className="settings__profile-name">{currentUser.name}</span>
            <span className="settings__profile-plan">
              <Sparkles size={11} />
              {currentUser.plan} Plan · {currentUser.role}
            </span>
          </div>
          <button type="button" className="settings__btn-secondary">
            Change Photo
          </button>
        </div>

        <div className="settings__form-grid">
          <label className="settings__field">
            <span className="settings__field-label">Full Name</span>
            <input type="text" defaultValue={currentUser.name} />
          </label>
          <label className="settings__field">
            <span className="settings__field-label">Email Address</span>
            <div className="settings__input-icon-wrap">
              <Mail size={14} />
              <input type="email" defaultValue={currentUser.email} />
            </div>
          </label>
        </div>

        <button type="button" className="settings__btn-primary" onClick={handleSaveProfile}>
          <Check size={14} />
          Save Changes
        </button>
      </motion.section>

      {/* Appearance Section */}
      <motion.section
        className="settings__card"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
      >
        <div className="settings__card-header">
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          <h3>Appearance</h3>
        </div>

        <div className="settings__toggle-row">
          <div>
            <span className="settings__toggle-label">Dark Mode</span>
            <span className="settings__toggle-desc">Switch between light and dark workspace themes</span>
          </div>
          <Switch.Root
            className="settings__switch"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => dispatch(setTheme(checked ? 'dark' : 'light'))}
          >
            <Switch.Thumb className="settings__switch-thumb" />
          </Switch.Root>
        </div>
      </motion.section>

      {/* Notifications Section */}
      <motion.section
        className="settings__card"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <div className="settings__card-header">
          <Bell size={18} />
          <h3>Notifications</h3>
        </div>

        {([
          ['productUpdates', 'Product Updates', 'New features, model releases, and changelog highlights'],
          ['usageAlerts', 'Usage Alerts', 'Get notified when you approach your API rate limits'],
          ['billingEmails', 'Billing Emails', 'Invoices, payment confirmations, and plan changes'],
          ['weeklyDigest', 'Weekly Digest', 'A summary of your workspace activity every Monday'],
        ] as const).map(([key, label, desc]) => (
          <div className="settings__toggle-row" key={key}>
            <div>
              <span className="settings__toggle-label">{label}</span>
              <span className="settings__toggle-desc">{desc}</span>
            </div>
            <Switch.Root
              className="settings__switch"
              checked={notifications[key]}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
            >
              <Switch.Thumb className="settings__switch-thumb" />
            </Switch.Root>
          </div>
        ))}
      </motion.section>

      {/* Account & Security Section */}
      <motion.section
        className="settings__card"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
      >
        <div className="settings__card-header">
          <Shield size={18} />
          <h3>Account & Security</h3>
        </div>

        <div className="settings__action-list">
          <button type="button" className="settings__action-item" onClick={() => toast('Redirecting to password reset...')}>
            <span className="settings__action-icon"><KeyRound size={16} /></span>
            <div className="settings__action-text">
              <span>Change Password</span>
              <span className="settings__toggle-desc">Update your account password</span>
            </div>
          </button>

          <button type="button" className="settings__action-item" onClick={() => toast('Opening billing portal...')}>
            <span className="settings__action-icon"><CreditCard size={16} /></span>
            <div className="settings__action-text">
              <span>Manage Billing</span>
              <span className="settings__toggle-desc">View invoices and update payment methods</span>
            </div>
          </button>

          <button
            type="button"
            className="settings__action-item settings__action-item--danger"
            onClick={() => toast.error('Signed out of NexusAI')}
          >
            <span className="settings__action-icon"><LogOut size={16} /></span>
            <div className="settings__action-text">
              <span>Log Out</span>
              <span className="settings__toggle-desc">Sign out of your NexusAI workspace</span>
            </div>
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default Settings;
