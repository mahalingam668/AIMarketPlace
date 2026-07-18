import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Blueprint §5.2 (User Management) + §5.5 (Payment oversight & dispute
// resolution). Both live in this one slice since they're both "Super Admin
// takes a binding action, with accountability" workflows — no live Order/chat
// system exists yet, so disputes are realistic seeded mock cases rather than
// derived from real orders. That's expected for this pass.

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'Company' | 'Developer';
  status: 'active' | 'suspended' | 'banned';
  joinedAt: string;
  lastActionReason?: string;
}

export interface Dispute {
  id: string;
  orderRef: string;
  companyName: string;
  developerName: string;
  amount: number;
  reason: string;
  status: 'open' | 'resolved';
  resolution?: 'full_refund' | 'partial_refund' | 'release_to_developer';
  openedAt: string;
  resolvedAt?: string;
}

export interface AdminState {
  users: PlatformUser[];
  disputes: Dispute[];
}

const initialState: AdminState = {
  users: [
    {
      id: 'u1',
      name: 'Nimbus Robotics Inc.',
      email: 'ops@nimbusrobotics.ai',
      role: 'Company',
      status: 'active',
      joinedAt: '2025-01-14',
    },
    {
      id: 'u2',
      name: 'Priya Raman',
      email: 'priya.raman@devmail.com',
      role: 'Developer',
      status: 'active',
      joinedAt: '2025-02-03',
    },
    {
      id: 'u3',
      name: 'Skyline Analytics',
      email: 'contact@skylineanalytics.io',
      role: 'Company',
      status: 'active',
      joinedAt: '2025-03-11',
    },
    {
      id: 'u4',
      name: 'Marcus Chen',
      email: 'marcus.chen.dev@gmail.com',
      role: 'Developer',
      status: 'suspended',
      joinedAt: '2024-11-20',
      lastActionReason: 'Missed three consecutive delivery deadlines without client communication.',
    },
    {
      id: 'u5',
      name: 'Beacon Health AI',
      email: 'admin@beaconhealth.ai',
      role: 'Company',
      status: 'active',
      joinedAt: '2025-04-22',
    },
    {
      id: 'u6',
      name: 'Aditi Sharma',
      email: 'aditi.sharma.ml@outlook.com',
      role: 'Developer',
      status: 'active',
      joinedAt: '2025-05-02',
    },
    {
      id: 'u7',
      name: 'Ferro Logistics',
      email: 'procurement@ferrologistics.com',
      role: 'Company',
      status: 'active',
      joinedAt: '2025-05-30',
    },
    {
      id: 'u8',
      name: 'Diego Alvarez',
      email: 'diego.alvarez.codes@protonmail.com',
      role: 'Developer',
      status: 'active',
      joinedAt: '2025-06-18',
    },
  ],
  disputes: [
    {
      id: 'd1',
      orderRef: 'ORD-10234',
      companyName: 'Nimbus Robotics Inc.',
      developerName: 'Marcus Chen',
      amount: 1200,
      reason: "Delivered chatbot didn't match agreed scope — multilingual support from the brief was never implemented.",
      status: 'open',
      openedAt: '2026-07-10',
    },
    {
      id: 'd2',
      orderRef: 'ORD-10298',
      companyName: 'Skyline Analytics',
      developerName: 'Aditi Sharma',
      amount: 850,
      reason: 'Predictive model accuracy came in far below the 92% benchmark promised in the gig description.',
      status: 'open',
      openedAt: '2026-07-12',
    },
    {
      id: 'd3',
      orderRef: 'ORD-10311',
      companyName: 'Beacon Health AI',
      developerName: 'Diego Alvarez',
      amount: 2400,
      reason: 'Developer delivered 9 days late and the final handoff was missing required API documentation.',
      status: 'open',
      openedAt: '2026-07-14',
    },
    {
      id: 'd4',
      orderRef: 'ORD-10276',
      companyName: 'Ferro Logistics',
      developerName: 'Priya Raman',
      amount: 600,
      reason: 'Client requested revisions outside the original scope; developer declined further work without additional pay.',
      status: 'open',
      openedAt: '2026-07-15',
    },
    {
      id: 'd5',
      orderRef: 'ORD-10190',
      companyName: 'Nimbus Robotics Inc.',
      developerName: 'Priya Raman',
      amount: 950,
      reason: 'Voice assistant integration crashed in production; company claimed the delivery was non-functional.',
      status: 'resolved',
      resolution: 'partial_refund',
      openedAt: '2026-06-28',
      resolvedAt: '2026-07-05',
    },
  ],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    suspendUser(state, action: PayloadAction<{ id: string; reason: string }>) {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (!user) return;
      user.status = 'suspended';
      user.lastActionReason = action.payload.reason;
    },
    banUser(state, action: PayloadAction<{ id: string; reason: string }>) {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (!user) return;
      user.status = 'banned';
      user.lastActionReason = action.payload.reason;
    },
    reinstateUser(state, action: PayloadAction<{ id: string }>) {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (!user) return;
      user.status = 'active';
      user.lastActionReason = undefined;
    },
    resolveDispute(
      state,
      action: PayloadAction<{ id: string; resolution: NonNullable<Dispute['resolution']>; resolvedAt: string }>
    ) {
      const dispute = state.disputes.find((d) => d.id === action.payload.id);
      if (!dispute) return;
      dispute.status = 'resolved';
      dispute.resolution = action.payload.resolution;
      dispute.resolvedAt = action.payload.resolvedAt;
    },
  },
});

export const { suspendUser, banUser, reinstateUser, resolveDispute } = adminSlice.actions;
export default adminSlice.reducer;
