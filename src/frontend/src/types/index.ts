export type UserRole = "lender" | "borrower" | "both";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
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
  /** 5% of principal charged as platform commission */
  commissionAmount: number;
  /** amount borrower actually receives = amount - commissionAmount */
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
}

export type FeeType = "entry" | "exit" | "commission";

export interface FeeRecord {
  id: string;
  type: FeeType;
  amount: number;
  userId: string;
  loanId?: string;
  date: string;
  description: string;
}

// ─── Platform Fee Constants ───────────────────────────────────────────────────
export const PLATFORM_ENTRY_FEE = 1; // ₹1 on registration
export const PLATFORM_EXIT_FEE = 1; // ₹1 on loan closure
export const PLATFORM_COMMISSION_RATE = 0.05; // 5% of loan principal

export function computeCommission(amount: number): number {
  return Math.round(amount * PLATFORM_COMMISSION_RATE);
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
