# LenDen Mokoko

## Current State
App has loan offers page, ad commission tracking, support page, advertise page, admin dashboard.

## Requested Changes (Diff)

### Add
- Real brand loan offer cards: Home Loan, Gold Loan, Muthoot Finance, Bajaj Finserv, Bajaj Markets
- "Trending" section with animated hot badge and marquee/scroll effect
- Instant money promise messaging throughout: "Paisa Turant Milega", "100% Bharosa", "16 Min Mein Account Mein"
- Active advertisement banners (rotating/animated) on dashboard and landing page
- Commission demand notice: "Har loan par 7% commission aapko milega"
- Trust badges and social proof: user count, loan disbursed amount, 5-star ratings

### Modify
- LoanOffersPage: add branded offers (Muthoot, Bajaj Finserv, Bajaj Markets, Home Loan, Gold Loan sections)
- LandingPage: add trending banner, instant money promise, brand logos section
- Dashboard: add rotating ad banner at top
- AppAdvertisement: make more prominent and active with animations

### Remove
- Nothing removed.

## Implementation Plan
1. Update LoanOffersPage with branded offer sections and trending badges.
2. Add TrendingBanner component with marquee/animated scroll.
3. Update LandingPage with instant money promise, trust section, brand logos.
4. Update Dashboard with rotating ad carousel.
5. Ensure commission messaging is visible on all loan offer interactions.
