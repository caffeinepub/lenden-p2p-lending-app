# LenDen - P2P Lending App

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- User registration and login (lender/borrower roles)
- Loan request creation by borrower (amount up to 1 Lakh, duration, purpose)
- Loan offer/approval by lender with interest rate setting
- Promissory Note (PN) generation for each loan agreement
- Loan repayment tracking with installment records
- Interest calculation (simple interest on loan amount)
- Legal action status tracking (Normal / Pending / Action Initiated)
- Dashboard with KPI cards: active loans, total amount, remaining payment
- Transaction history table
- Legal documents section

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: User management (lender/borrower), loan lifecycle (requested -> active -> repaid/defaulted), repayment installments, legal status
2. Backend: Interest calculation, promissory note metadata storage
3. Frontend: Auth screens, dashboard, loan creation, loan detail, repayment, legal docs
4. Max loan amount enforced: 1,00,000 INR
