import type { LucideIcon } from 'lucide-react';
import type { AccountRole } from '../../modules/auth/roles';
import './AccountTypePicker.css';

export interface AccountTypeOption {
  value: AccountRole;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface AccountTypePickerProps {
  legend: string;
  options: AccountTypeOption[];
  value: AccountRole | null;
  onChange: (role: AccountRole) => void;
  name: string;
}

function AccountTypePicker({ legend, options, value, onChange, name }: AccountTypePickerProps) {
  return (
    <fieldset className="account-picker">
      <legend className="account-picker__legend">{legend}</legend>
      <div className="account-picker__options">
        {options.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;
          return (
            <label key={option.value} className={`account-picker__option ${active ? 'account-picker__option--active' : ''}`}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="account-picker__input"
              />
              <span className="account-picker__icon">
                <Icon size={18} />
              </span>
              <span className="account-picker__text">
                <span className="account-picker__label">{option.label}</span>
                <span className="account-picker__desc">{option.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default AccountTypePicker;
