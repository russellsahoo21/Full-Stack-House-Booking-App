import React from 'react';

/**
 * Authentic, production-grade vector brand icons for Indian & Global payment methods.
 */

// 1. Official Razorpay Logo Mark
export const RazorpayLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`flex items-center justify-center rounded-xl bg-[#02042B] border border-blue-500/30 shadow-md p-1.5 shrink-0 ${className}`}>
    <svg viewBox="0 0 24 24" className="w-full h-full fill-none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.436 0L10.526 7.773L9.352 12.049L15.977 7.752L11.65 24H16.041L22.436 0Z" fill="#3395FF" />
      <path d="M14.26 10.098L3.389 17.166L1.564 24H10.572L14.26 10.098Z" fill="#0B72E7" />
    </svg>
  </div>
);

// 2. Official NPCI Unified Payments Interface (UPI) Logo
export const UpiLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`flex items-center justify-center rounded-xl bg-white dark:bg-white/95 border border-warm-200 dark:border-white/20 shadow-md p-1 shrink-0 ${className}`}>
    <svg viewBox="0 0 44 28" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Green Arrow */}
      <polygon points="8,5 17,14 8,23 3,23 12,14 3,5" fill="#097939" />
      {/* Orange Arrow */}
      <polygon points="15,5 24,14 15,23 10,23 19,14 10,5" fill="#F47920" />
      {/* Bold Italic UPI */}
      <text
        x="24"
        y="19"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="12.5"
        fill="#212529"
        letterSpacing="-0.5"
      >
        UPI
      </text>
    </svg>
  </div>
);

// Mini Google Pay Badge
export const GooglePayBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 42 16" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="42" height="16" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
    <text x="6" y="12" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="9.5" fill="#4285F4">G</text>
    <text x="14" y="12" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="9.5" fill="#EA4335">P</text>
    <text x="21" y="12" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="9.5" fill="#FBBC04">a</text>
    <text x="28" y="12" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="9.5" fill="#34A853">y</text>
  </svg>
);

// Mini PhonePe Badge
export const PhonePeBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 46 16" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="46" height="16" rx="4" fill="#5F259F" />
    <circle cx="8" cy="8" r="5" fill="#FFFFFF" fillOpacity="0.2" />
    <text x="5.5" y="11.5" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8" fill="#FFFFFF">पे</text>
    <text x="16" y="11.5" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#FFFFFF" letterSpacing="-0.2">PhonePe</text>
  </svg>
);

// Mini Paytm Badge
export const PaytmBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 38 16" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="16" rx="4" fill="#002E6E" />
    <text x="4" y="11.5" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8.5" fill="#FFFFFF">Pay</text>
    <text x="21" y="11.5" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8.5" fill="#00BAF2">tm</text>
  </svg>
);

// 3. Official Card Brands Icon (Chip + Mastercard / Visa / RuPay)
export const CardBrandsLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-white/15 shadow-md p-1 shrink-0 ${className}`}>
    <svg viewBox="0 0 36 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="34" height="20" rx="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
      {/* Golden EMV Chip */}
      <rect x="4" y="6" width="6.5" height="5" rx="1.2" fill="#F59E0B" />
      <line x1="4" y1="8.5" x2="10.5" y2="8.5" stroke="#B45309" strokeWidth="0.5" />
      <line x1="7.25" y1="6" x2="7.25" y2="11" stroke="#B45309" strokeWidth="0.5" />
      {/* Mastercard Interlocking Circles */}
      <circle cx="23.5" cy="15" r="4.2" fill="#EB001B" />
      <circle cx="28" cy="15" r="4.2" fill="#F79E1B" fillOpacity="0.88" />
    </svg>
  </div>
);

// Mini Visa Badge
export const VisaBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 32 15" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="15" rx="3.5" fill="#1A1F71" />
    <text x="3.5" y="11" fontFamily="system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="9" fill="#FFFFFF" letterSpacing="0.8">VISA</text>
  </svg>
);

// Mini Mastercard Badge
export const MastercardBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 26 15" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="26" height="15" rx="3.5" fill="#111827" stroke="#374151" strokeWidth="0.5" />
    <circle cx="10" cy="7.5" r="4.3" fill="#EB001B" />
    <circle cx="16" cy="7.5" r="4.3" fill="#F79E1B" fillOpacity="0.88" />
  </svg>
);

// Mini RuPay Badge
export const RuPayBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 40 15" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="15" rx="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
    <text x="3" y="11" fontFamily="system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="8.5" fill="#0070BA">Ru</text>
    <text x="16.5" y="11" fontFamily="system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="8.5" fill="#E55A00">Pay</text>
    <polygon points="33,4 36.5,4 35,11 31.5,11" fill="#0070BA" />
    <polygon points="36.5,4 40,4 38.5,11 35,11" fill="#E55A00" />
  </svg>
);

// 4. Official Netbanking Icon
export const NetbankingLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-sky-950 border border-sky-400/30 shadow-md p-1.5 shrink-0 ${className}`}>
    <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-sky-300" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M12 3l9 5H3l9-5z" />
    </svg>
  </div>
);

// Mini Bank Badges
export const HdfcBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 34 15" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="15" rx="3.5" fill="#004C8F" />
    <text x="3" y="11" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8" fill="#FFF" letterSpacing="0.8">HDFC</text>
  </svg>
);

export const SbiBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 30 15" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="15" rx="3.5" fill="#00A5DF" />
    <circle cx="8" cy="7.5" r="4" fill="#FFFFFF" />
    <circle cx="8" cy="6.2" r="1.5" fill="#00A5DF" />
    <rect x="7.4" y="6.2" width="1.2" height="3.5" fill="#00A5DF" />
    <text x="14" y="11" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="8" fill="#FFF">SBI</text>
  </svg>
);

export const IciciBadge: React.FC<{ className?: string }> = ({ className = 'h-3.5' }) => (
  <svg viewBox="0 0 34 15" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="15" rx="3.5" fill="#B02A30" />
    <text x="3" y="11" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8" fill="#F58220" letterSpacing="0.5">ICICI</text>
  </svg>
);
