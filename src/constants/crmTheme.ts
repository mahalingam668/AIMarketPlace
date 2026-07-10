/** Enterprise design tokens for the CRM module — scoped to `.crm-root`, never the app's global :root. */
export interface CrmThemeTokens {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderColor: string;
  titleColor: string;
  textColor: string;
  textSecondaryColor: string;
  cardBackground: string;
  iconColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export const DEFAULT_CRM_THEME: CrmThemeTokens = {
  primaryColor: '#2563EB',
  secondaryColor: '#0F172A',
  backgroundColor: '#F8FAFC',
  surfaceColor: '#FFFFFF',
  borderColor: '#E2E8F0',
  titleColor: '#0F172A',
  textColor: '#64748B',
  textSecondaryColor: '#64748B',
  cardBackground: '#FFFFFF',
  iconColor: '#2563EB',
  successColor: '#16A34A',
  warningColor: '#F59E0B',
  errorColor: '#DC2626',
};

export const CRM_THEME_STORAGE_KEY = 'crm.theme.v1';
