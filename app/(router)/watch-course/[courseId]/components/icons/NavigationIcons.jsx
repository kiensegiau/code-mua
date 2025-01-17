import { memo } from 'react';

export const PreviousIcon = memo(() => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-white"
  >
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
));

export const NextIcon = memo(() => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-white"
  >
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
)); 