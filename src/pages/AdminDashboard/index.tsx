import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Database, ShieldAlert, UserPlus, ShieldCheck, Clock } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { aiTools, currentUser } from '../../data/mockData';
import './AdminDashboard.css';

const RECENT_SIGNUPS = [
  { name: 'Priya Nandakumar', company: 'Meridian Financial Group', plan: 'Enterprise', joined: '2 hours ago' },
  { name: 'Marcus Webb', company: 'Falkirk Manufacturing Co.', plan: 'Professional', joined: '1 day ago' },
  { name: 'Sofia Alvarez', company: 'Zenith Retail Holdings', plan: 'Professional', joined: '2 days ago' },
  { name: 'David Okoye', company: 'PacifiCore Logistics', plan: 'Starter', joined: '3 days ago' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function AdminDashboard() {
  const pendingAccessRequests = useMemo(() => aiTools.filter((t) => t.rating < 4.5).length, []);

  return (
    <motion.div className="admin-dashboard" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="admin-dashboard__header">
        <h1>Admin Overview</h1>
        <p>Signed in as {currentUser.name} · Workspace Admin</p>
      </motion.div>

      <motion.div className="admin-dashboard__stats" variants={containerVariants}>
        <motion.div variants={itemVariants}><GlassCard padding="20px"><Users size={18} /><span className="admin-dashboard__stat-value">48,200</span><span className="admin-dashboard__stat-label">Active Workspace Users</span></GlassCard></motion.div>
        <motion.div variants={itemVariants}><GlassCard padding="20px"><Database size={18} /><span className="admin-dashboard__stat-value">{aiTools.length}</span><span className="admin-dashboard__stat-label">Models in Catalog</span></GlassCard></motion.div>
        <motion.div variants={itemVariants}><GlassCard padding="20px"><ShieldAlert size={18} /><span className="admin-dashboard__stat-value">{pendingAccessRequests}</span><span className="admin-dashboard__stat-label">Pending Governance Reviews</span></GlassCard></motion.div>
        <motion.div variants={itemVariants}><GlassCard padding="20px"><ShieldCheck size={18} /><span className="admin-dashboard__stat-value">99.99%</span><span className="admin-dashboard__stat-label">Platform Uptime</span></GlassCard></motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard padding="24px">
          <h3 className="admin-dashboard__section-title"><UserPlus size={16} /> Recent Signups</h3>
          <table className="admin-dashboard__table">
            <thead>
              <tr><th>Name</th><th>Company</th><th>Plan</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {RECENT_SIGNUPS.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.company}</td>
                  <td><span className="admin-dashboard__plan-badge">{s.plan}</span></td>
                  <td><Clock size={11} /> {s.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

export default AdminDashboard;
