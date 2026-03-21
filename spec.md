# LenDen Mokoko

## Current State
EMI calculator is embedded inside NewLoanRequest.tsx with a flat-rate formula, visual bar, 4 breakdown cards, and a 3-row mini schedule table.

## Requested Changes (Diff)

### Add
- Standalone EMI Calculator page (EmiCalculatorPage.tsx) accessible from Dashboard/Navbar
- Full EMI amortization schedule table (all months)
- Pie/donut chart showing principal vs interest vs commission split
- Summary stats: Total interest saved comparison at different rates
- Tabs: Simple EMI view vs Full Schedule

### Modify
- Improve inline EMI calculator in NewLoanRequest with cleaner visuals, animated counter for EMI amount, and reducing balance method option
- Navbar and Dashboard to include EMI Calculator link

### Remove
- Nothing removed

## Implementation Plan
1. Create EmiCalculatorPage.tsx with full-featured calculator: sliders, animated EMI display, donut chart (SVG), full amortization table, tabs for summary vs schedule
2. Add EMI Calculator route in App.tsx
3. Add EMI Calculator button in Dashboard quick actions and Navbar menu
4. Enhance inline EMI section in NewLoanRequest with better visuals
