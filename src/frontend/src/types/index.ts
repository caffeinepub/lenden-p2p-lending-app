export type UserRole = "lender" | "borrower" | "both" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isPremium?: boolean;
  membershipExpiry?: string;
  creditScore?: number;
}

export type LoanStatus = "pending" | "active" | "completed" | "rejected";
export type LegalStatus =
  | "normal"
  | "warning"
  | "legal_pending"
  | "action_initiated";

export interface Loan {
  id: string;
  borrowerId: string;
  lenderId: string;
  amount: number;
  purpose: string;
  durationMonths: number;
  interestRate: number;
  status: LoanStatus;
  startDate: string;
  legalStatus: LegalStatus;
  promissoryNote?: string;
  commissionAmount: number;
  netAmountToBorrower: number;
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  note: string;
}

export interface LoanRequest {
  id: string;
  borrowerId: string;
  amount: number;
  purpose: string;
  durationMonths: number;
  requestedInterestRate: number;
  createdAt: string;
  utr?: string;
}

export type FeeType =
  | "entry"
  | "exit"
  | "commission"
  | "withdrawal"
  | "membership";

export interface FeeRecord {
  id: string;
  type: FeeType;
  amount: number;
  userId: string;
  loanId?: string;
  date: string;
  description: string;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  upiId: string;
  date: string;
  status: "pending" | "completed";
  note: string;
}

// Platform Fee Constants
export const PLATFORM_ENTRY_FEE = 1;
export const PLATFORM_EXIT_FEE = 1;
// Commission: ₹9 for loans ≤₹10,000 | ₹301 for loans >₹10,000
export const PLATFORM_COMMISSION_RATE = 0; // kept for legacy references; use computeCommission()
export const MEMBERSHIP_WEEKLY_PRICE = 9;
export const MEMBERSHIP_MONTHLY_PRICE = 99;
export const MEMBERSHIP_YEARLY_PRICE = 499;
export const ADMIN_PHONE = "barkat6y";

/** ₹9 for loans ≤₹10,000 | ₹301 for loans >₹10,000 */
export function computeCommission(amount: number): number {
  return amount > 10000 ? 301 : 9;
}

/** Label for commission, e.g. "₹9 (flat)" */
export function commissionLabel(amount: number): string {
  return amount > 10000 ? "₹301 (flat)" : "₹9 (flat)";
}

export function computeNetAmount(amount: number): number {
  return amount - computeCommission(amount);
}

export function computeTotalDue(loan: Loan): number {
  return (
    loan.amount +
    (((loan.amount * loan.interestRate) / 100) * loan.durationMonths) / 12
  );
}

export function computeMonthlyInstallment(loan: Loan): number {
  return computeTotalDue(loan) / loan.durationMonths;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCreditScoreLabel(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 750)
    return {
      label: "Excellent",
      color: "oklch(0.45 0.12 158)",
      bgColor: "oklch(0.94 0.05 158)",
    };
  if (score >= 650)
    return {
      label: "Good",
      color: "oklch(0.55 0.14 120)",
      bgColor: "oklch(0.95 0.05 120)",
    };
  if (score >= 500)
    return {
      label: "Fair",
      color: "oklch(0.60 0.16 70)",
      bgColor: "oklch(0.96 0.06 70)",
    };
  return {
    label: "Poor",
    color: "oklch(0.55 0.20 27)",
    bgColor: "oklch(0.96 0.06 27)",
  };
}
