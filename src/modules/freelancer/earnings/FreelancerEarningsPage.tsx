import { useMemo, useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Wallet, Clock, TrendingUp, Landmark } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { requestWithdrawal, type PayoutMethod } from '../../../store/slices/freelancerSlice';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';

const PLATFORM_COMMISSION_RATE = 10;

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function methodLabel(method: PayoutMethod): string {
  return method === 'bank' ? 'Bank transfer' : 'PayPal';
}

function FreelancerEarningsPage() {
  const dispatch = useAppDispatch();
  const { walletBalance, pendingClearance, earningsHistory, payoutHistory } = useAppSelector((s) => s.freelancer);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PayoutMethod>('bank');

  const lifetimeEarnings = useMemo(
    () => earningsHistory.reduce((sum, point) => sum + point.earnings, 0),
    [earningsHistory]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error('Enter an amount greater than $0.');
      return;
    }
    if (numericAmount > walletBalance) {
      toast.error('Amount exceeds available balance.');
      return;
    }
    dispatch(requestWithdrawal({ amount: numericAmount, method }));
    toast.success(`Withdrawal request for ${formatCurrency(numericAmount)} via ${methodLabel(method)} submitted.`);
    setAmount('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="fl-header">
        <div>
          <h1 className="fl-header__title">Earnings & Withdrawals</h1>
          <p className="fl-header__subtitle">Track your balance and cash out cleared earnings.</p>
        </div>
      </div>

      <div className="fl-stats-row">
        <StatCard icon={Wallet} value={formatCurrency(walletBalance)} label="Available Balance" />
        <StatCard icon={Clock} value={formatCurrency(pendingClearance)} label="Pending Clearance" />
        <StatCard icon={TrendingUp} value={formatCurrency(lifetimeEarnings)} label="Lifetime Earnings" />
        <StatCard icon={Landmark} value={`${PLATFORM_COMMISSION_RATE}%`} label="Platform Commission (deducted)" />
      </div>

      <div className="fl-widget-grid">
        <div className="fl-section">
          <div className="fl-section__header">
            <h3 className="fl-section__title">Withdraw Funds</h3>
          </div>

          <p className="fl-note">
            Available balance already reflects the {PLATFORM_COMMISSION_RATE}% platform commission deducted from
            completed orders. Pending clearance becomes available once the buyer's review window closes.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
            <div className="fl-form-grid">
              <div className="fl-form-field">
                <label htmlFor="withdraw-amount">Amount (USD)</label>
                <input
                  id="withdraw-amount"
                  type="number"
                  min={0}
                  max={walletBalance}
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="fl-form-field__hint">Up to {formatCurrency(walletBalance)} available now.</span>
              </div>

              <div className="fl-form-field">
                <label htmlFor="withdraw-method">Payout method</label>
                <select id="withdraw-method" value={method} onChange={(e) => setMethod(e.target.value as PayoutMethod)}>
                  <option value="bank">Bank transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>

            <div className="fl-form-actions">
              <button type="submit" className="fl-btn fl-btn--primary">Request Withdrawal</button>
            </div>
          </form>
        </div>
      </div>

      <div className="fl-section">
        <div className="fl-section__header">
          <h3 className="fl-section__title">Payout History</h3>
        </div>

        {payoutHistory.length === 0 ? (
          <div className="fl-empty">
            <div className="fl-empty__icon"><Landmark size={20} /></div>
            <h4>No payouts yet</h4>
            <p>Withdrawals you request will show up here.</p>
          </div>
        ) : (
          <div className="fl-table-wrap">
            <table className="fl-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((payout) => (
                  <tr key={payout.id}>
                    <td>{payout.date}</td>
                    <td>{formatCurrency(payout.amount)}</td>
                    <td>{methodLabel(payout.method)}</td>
                    <td><StatusPill status={payout.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FreelancerEarningsPage;
