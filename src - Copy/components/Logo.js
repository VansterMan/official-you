// src/components/Logo.js
import React from 'react';

export default function Logo({ size = 120, className = '' }) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#0A9D93', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#0077B6', stopOpacity:1}} />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#logoGradient)" strokeWidth="6"/>
      {/* Portal depth layers */}
      <circle cx="60" cy="60" r="38" fill="none" stroke="url(#logoGradient)" strokeWidth="3" opacity="0.7"/>
      <circle cx="60" cy="60" r="28" fill="none" stroke="url(#logoGradient)" strokeWidth="2.5" opacity="0.5"/>
      {/* Center glowing core */}
      <circle cx="60" cy="60" r="15" fill="url(#logoGradient)" opacity="0.8"/>
      <circle cx="60" cy="60" r="8" fill="white" opacity="0.9"/>
    </svg>
  );
}
