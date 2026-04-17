# Deliveroo CreateOrderPage Improvements - COMPLETE ✅

## All Fixes Applied:

**Original Requirements:**
1. ✓ Counties side-by-side (already).
2. ✓ Removed "Find Nearby Businesses" (POI code).
3. ✓ Fixed autocomplete.

**Feedback Fixes:**
- ✓ Business autocomplete: `types=poi,address` → "chicken inn" suggests restaurants in county.
- ✓ Live map both points: Improved query/geocode for pickup/destination coords/markers.

**Final Changes (minimal, no breaks):**
- mapbox.js: POI-prioritized types.
- CreateOrderPage.jsx: Better buildLocationQuery comment/query for businesses.

## Test Results Expected:
- Dev server running → http://localhost:5173/orders/create
- Nairobi + "chicken inn" → POI dropdown → Live map P/D markers.
- Console: Check geocode success.

No other changes made.
