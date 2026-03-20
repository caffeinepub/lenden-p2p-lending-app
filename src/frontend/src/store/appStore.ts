import {
  type ReactNode,
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type FeeRecord,
  type Loan,
  type LoanRequest,
  PLATFORM_ENTRY_FEE,
  PLATFORM_EXIT_FEE,
  type Repayment,
  type User,
  computeCommission,
  computeNetAmount,
} from "../types";

const SEED_USERS: User[] = [
  { id: "u1", name: "Ramesh Kumar", phone: "9876543210", role: "lender" },
  { id: "u2", name: "Suresh Sharma", phone: "9876543211", role: "borrower" },
  { id: "u3", name: "Priya Gupta", phone: "9876543212", role: "both" },
];

const SEED_LOANS: Loan[] = [
  {
    id: "l1",
    borrowerId: "u2",
    lenderId: "u1",
    amount: 50000,
    purpose: "व्यापार विस्तार / Business Expansion",
    durationMonths: 12,
    interestRate: 12,
    status: "active",
    startDate: "2025-10-01",
    legalStatus: "normal",
    commissionAmount: 2500,
    netAmountToBorrower: 47500,
    promissoryNote:
      "यह प्रॉमिसरी नोट दिनांक 1 अक्टूबर 2025 को ₹50,000 की राशि के लिए बनाया गया है।\nउधारकर्ता: सुरेश शर्मा, ऋणदाता: रमेश कुमार।\nब्याज दर: 12% प्रति वर्ष।\nप्लेटफ़ॉर्म कमीशन (5%): ₹2,500 | उधारकर्ता को प्राप्त राशि: ₹47,500",
  },
  {
    id: "l2",
    borrowerId: "u3",
    lenderId: "u1",
    amount: 30000,
    purpose: "चिकित्सा खर्च / Medical Expenses",
    durationMonths: 6,
    interestRate: 10,
    status: "active",
    startDate: "2025-11-15",
    legalStatus: "warning",
    commissionAmount: 1500,
    netAmountToBorrower: 28500,
    promissoryNote:
      "यह प्रॉमिसरी नोट दिनांक 15 नवंबर 2025 को ₹30,000 की राशि के लिए बनाया गया है।\nउधारकर्ता: प्रिया गुप्ता, ऋणदाता: रमेश कुमार।\nब्याज दर: 10% प्रति वर्ष।\nप्लेटफ़ॉर्म कमीशन (5%): ₹1,500 | उधारकर्ता को प्राप्त राशि: ₹28,500",
  },
  {
    id: "l3",
    borrowerId: "u2",
    lenderId: "u3",
    amount: 20000,
    purpose: "शिक्षा / Education",
    durationMonths: 9,
    interestRate: 8,
    status: "active",
    startDate: "2025-12-01",
    legalStatus: "normal",
    commissionAmount: 1000,
    netAmountToBorrower: 19000,
    promissoryNote:
      "यह प्रॉमिसरी नोट दिनांक 1 दिसंबर 2025 को ₹20,000 की राशि के लिए बनाया गया है।\nउधारकर्ता: सुरेश शर्मा, ऋणदाता: प्रिया गुप्ता।\nब्याज दर: 8% प्रति वर्ष।\nप्लेटफ़ॉर्म कमीशन (5%): ₹1,000 | उधारकर्ता को प्राप्त राशि: ₹19,000",
  },
];

const SEED_REPAYMENTS: Repayment[] = [
  {
    id: "r1",
    loanId: "l1",
    amount: 4667,
    date: "2025-11-01",
    note: "किस्त 1 / Installment 1",
  },
  {
    id: "r2",
    loanId: "l1",
    amount: 4667,
    date: "2025-12-01",
    note: "किस्त 2 / Installment 2",
  },
  {
    id: "r3",
    loanId: "l2",
    amount: 5250,
    date: "2025-12-15",
    note: "किस्त 1 / Installment 1",
  },
];

const SEED_REQUESTS: LoanRequest[] = [
  {
    id: "req1",
    borrowerId: "u2",
    amount: 75000,
    purpose: "घर मरम्मत / Home Renovation",
    durationMonths: 18,
    requestedInterestRate: 10,
    createdAt: "2026-01-10",
  },
];

// Seed fee records reflecting the 3 existing loans + 3 entry fees for seed users
const SEED_FEE_RECORDS: FeeRecord[] = [
  {
    id: "f1",
    type: "entry",
    amount: 1,
    userId: "u1",
    date: "2025-09-01",
    description: "प्रवेश शुल्क / Entry Fee — Ramesh Kumar",
  },
  {
    id: "f2",
    type: "entry",
    amount: 1,
    userId: "u2",
    date: "2025-09-05",
    description: "प्रवेश शुल्क / Entry Fee — Suresh Sharma",
  },
  {
    id: "f3",
    type: "entry",
    amount: 1,
    userId: "u3",
    date: "2025-09-10",
    description: "प्रवेश शुल्क / Entry Fee — Priya Gupta",
  },
  {
    id: "f4",
    type: "commission",
    amount: 2500,
    userId: "u2",
    loanId: "l1",
    date: "2025-10-01",
    description: "कमीशन 5% / Commission 5% — ₹50,000 loan",
  },
  {
    id: "f5",
    type: "commission",
    amount: 1500,
    userId: "u3",
    loanId: "l2",
    date: "2025-11-15",
    description: "कमीशन 5% / Commission 5% — ₹30,000 loan",
  },
  {
    id: "f6",
    type: "commission",
    amount: 1000,
    userId: "u2",
    loanId: "l3",
    date: "2025-12-01",
    description: "कमीशन 5% / Commission 5% — ₹20,000 loan",
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface AppState {
  currentUser: User | null;
  users: User[];
  loans: Loan[];
  repayments: Repayment[];
  loanRequests: LoanRequest[];
  feeRecords: FeeRecord[];
  login: (user: User) => void;
  logout: () => void;
  register: (user: Omit<User, "id">) => User;
  addLoan: (loan: Loan) => void;
  updateLoan: (loan: Loan) => void;
  addRepayment: (repayment: Repayment) => void;
  addLoanRequest: (req: LoanRequest) => void;
  removeLoanRequest: (id: string) => void;
  addFeeRecord: (record: FeeRecord) => void;
  // computed admin stats
  totalCommission: number;
  totalEntryFees: number;
  totalExitFees: number;
  totalAdminEarnings: number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage("currentUser", null),
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage("users", SEED_USERS),
  );
  const [loans, setLoans] = useState<Loan[]>(() =>
    loadFromStorage("loans", SEED_LOANS),
  );
  const [repayments, setRepayments] = useState<Repayment[]>(() =>
    loadFromStorage("repayments", SEED_REPAYMENTS),
  );
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(() =>
    loadFromStorage("loanRequests", SEED_REQUESTS),
  );
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() =>
    loadFromStorage("feeRecords", SEED_FEE_RECORDS),
  );

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("loans", JSON.stringify(loans));
  }, [loans]);
  useEffect(() => {
    localStorage.setItem("repayments", JSON.stringify(repayments));
  }, [repayments]);
  useEffect(() => {
    localStorage.setItem("loanRequests", JSON.stringify(loanRequests));
  }, [loanRequests]);
  useEffect(() => {
    localStorage.setItem("feeRecords", JSON.stringify(feeRecords));
  }, [feeRecords]);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const register = (data: Omit<User, "id">) => {
    const user: User = { ...data, id: `u${Date.now()}` };
    setUsers((prev) => [...prev, user]);
    // Record ₹1 entry fee
    const entryFee: FeeRecord = {
      id: `fee_entry_${Date.now()}`,
      type: "entry",
      amount: PLATFORM_ENTRY_FEE,
      userId: user.id,
      date: new Date().toISOString().split("T")[0],
      description: `प्रवेश शुल्क / Entry Fee — ${user.name}`,
    };
    setFeeRecords((prev) => [...prev, entryFee]);
    return user;
  };

  const addLoan = (loan: Loan) => {
    setLoans((prev) => [...prev, loan]);
    // Record 5% commission
    const commission: FeeRecord = {
      id: `fee_comm_${Date.now()}`,
      type: "commission",
      amount: computeCommission(loan.amount),
      userId: loan.borrowerId,
      loanId: loan.id,
      date: new Date().toISOString().split("T")[0],
      description: `कमीशन 5% / Commission 5% — ₹${loan.amount.toLocaleString("en-IN")} loan`,
    };
    setFeeRecords((prev) => [...prev, commission]);
  };

  const updateLoan = (updated: Loan) =>
    setLoans((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));

  const addRepayment = (r: Repayment) => {
    setRepayments((prev) => [...prev, r]);
  };

  /**
   * Call this when a loan is fully repaid to record the ₹1 exit fee.
   * Triggered externally (MakeRepayment page) after confirming completion.
   */
  const addFeeRecord = (record: FeeRecord) =>
    setFeeRecords((prev) => [...prev, record]);

  const addLoanRequest = (req: LoanRequest) =>
    setLoanRequests((prev) => [...prev, req]);
  const removeLoanRequest = (id: string) =>
    setLoanRequests((prev) => prev.filter((r) => r.id !== id));

  // Computed admin totals
  const totalCommission = feeRecords
    .filter((f) => f.type === "commission")
    .reduce((s, f) => s + f.amount, 0);
  const totalEntryFees = feeRecords
    .filter((f) => f.type === "entry")
    .reduce((s, f) => s + f.amount, 0);
  const totalExitFees = feeRecords
    .filter((f) => f.type === "exit")
    .reduce((s, f) => s + f.amount, 0);
  const totalAdminEarnings = totalCommission + totalEntryFees + totalExitFees;

  const value: AppState = {
    currentUser,
    users,
    loans,
    repayments,
    loanRequests,
    feeRecords,
    login,
    logout,
    register,
    addLoan,
    updateLoan,
    addRepayment,
    addLoanRequest,
    removeLoanRequest,
    addFeeRecord,
    totalCommission,
    totalEntryFees,
    totalExitFees,
    totalAdminEarnings,
  };

  return createElement(AppContext.Provider, { value }, children);
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
