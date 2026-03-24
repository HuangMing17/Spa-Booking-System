# Promo Cleanup Log

## Scope
- Backend: `CouponController`, `CouponServiceImpl`, coupon-related repository/entity usage.
- Frontend: `admin/pages/coupons/couponAPI.js`, booking/admin coupon usage points.

## Rule Recheck Before Delete
- Rechecked `promo-cleanup-safety.mdc` before removing any code.
- Limited deletions to coupon API contract duplication inside `couponAPI.js`.
- No non-coupon file/module deletions were performed.

## Usage Mapping (coupon)
- Frontend usage:
  - `Booking.jsx` uses `validateCoupon(code, subtotal)`.
  - `OrderForm.jsx` uses order-level `applyCoupon(orderId, couponCode)` from `orderAPI`.
  - Admin coupon pages use `couponAPI` CRUD/search/valid/expiring endpoints.
- Backend usage:
  - `CouponController` serves `/api/coupons/*`.
  - `CouponServiceImpl` handles create/update/validate/apply/remove logic.
  - Order/cart services have their own order-level coupon operations.

## Cleanup Decisions
- Removed duplicate booking-specific `applyCoupon` implementation in `couponAPI.js` that posted request body to `/api/coupons/apply`.
- Kept a single exported `applyCoupon` re-export from `couponAPI.applyCoupon` (query-params contract).
- Kept booking helper `validateCoupon(code, orderAmount)` as a thin wrapper over unified `couponAPI.validateCoupon`.
- Refactored duplicated backend validation logic in `CouponServiceImpl` into shared helpers:
  - code availability check
  - date range validation
  - coupon lookup by code

## Verification Notes
- IDE lints checked for modified files: no lint errors.
- Build verification attempt failed due missing local Maven setup artifacts:
  - `mvn` not installed in shell path.
  - `.mvn/wrapper/maven-wrapper.properties` missing, so `mvnw.cmd` cannot run.
