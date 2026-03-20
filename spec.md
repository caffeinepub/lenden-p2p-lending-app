# LenDen Mokoko

## Current State
App has: login/register, loan management, repayment tracking, admin dashboard (admin-only), UPI QR payment, legal documents, promissory notes, 7% commission, ₹1 entry fee enforcement.

Missing: Premium Membership feature, Credit Score system.

## Requested Changes (Diff)

### Add
- **Premium Membership page**: Users can buy monthly (₹99/month) or yearly (₹499/year) membership. Payment via admin UPI QR (barkat.6y@ptyes). Members get benefits: higher loan limit (₹1,50,000 vs ₹1,00,000), priority loan approval badge, reduced commission (5% instead of 7%), exclusive member badge on profile.
- **Credit Score page**: Each user gets a score 300-900 based on: repayment history (on-time payments increase score, missed/late decrease), number of loans, loan completion rate. Visual gauge/meter display. Score categories: Poor (300-499), Fair (500-649), Good (650-749), Excellent (750-900).
- **MembershipPage.tsx**: New page with plan cards, benefits list, UPI QR for payment, UTR confirmation input.
- **CreditScorePage.tsx**: New page showing user's score, score breakdown, history, tips to improve.
- **User type update**: Add `isPremium?: boolean`, `membershipExpiry?: string`, `creditScore?: number` fields to User interface.
- **Dashboard updates**: Show credit score card and membership status badge for logged-in user. Add navigation buttons to both new pages.
- **appStore updates**: Add membership purchase logic, credit score calculation based on repayment data, membership fee records.

### Modify
- `src/frontend/src/types/index.ts`: Add isPremium, membershipExpiry, creditScore to User interface. Add membership fee type.
- `src/frontend/src/store/appStore.ts`: Add purchaseMembership function, computeCreditScore function, update seed users with credit scores.
- `src/frontend/src/pages/Dashboard.tsx`: Add credit score card and membership status/button.
- `src/frontend/src/App.tsx`: Add routes for membership and credit-score pages.

### Remove
- Nothing removed.

## Implementation Plan
1. Update types/index.ts with new User fields and membership fee type
2. Update appStore.ts with membership logic and credit score calculation
3. Create MembershipPage.tsx
4. Create CreditScorePage.tsx
5. Update Dashboard.tsx to show credit score card and membership status
6. Update App.tsx to route to new pages
