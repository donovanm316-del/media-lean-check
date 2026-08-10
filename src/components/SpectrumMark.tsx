export default function SpectrumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#18181b" />
      <rect x="6" y="14" width="20" height="4" rx="2" fill="url(#spectrum-gradient)" />
      <rect x="14.5" y="10" width="3" height="12" rx="1.5" fill="#fafafa" />
      <defs>
        <linearGradient id="spectrum-gradient" x1="6" y1="0" x2="26" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="0.5" stopColor="#a1a1aa" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}
