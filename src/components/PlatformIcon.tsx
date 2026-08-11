import React from 'react';

export type PlatformName = 'Windows' | 'Linux' | 'macOS';

export default function PlatformIcon({name}: {name: PlatformName}): React.JSX.Element {
  if (name === 'Windows') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Windows" fill="currentColor">
        <path d="M2 3.6 10.8 2.4v8.7H2V3.6Zm10.8-1.5L22 .8v10.3h-9.2V2.1ZM2 12.9h8.8v8.7L2 20.4v-7.5Zm10.8 0H22v10.3l-9.2-1.3v-9Z" />
      </svg>
    );
  }

  if (name === 'Linux') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Linux" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="m6 8 4 4-4 4M12 16h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="macOS" fill="currentColor">
      <path d="M8.2 7.2c1.1 0 2.2.7 2.9.7.6 0 1.8-.8 3.2-.8 1.1 0 2.3.4 3.2 1.4-2.8 1.7-2.3 5.7.5 6.8-.6 1.4-1.4 2.8-2.5 4.1-.8.9-1.6 1.8-2.9 1.8-1.2 0-1.6-.7-3.1-.7s-2 .7-3.1.7c-1.2 0-2.1-1.1-2.9-2-2.4-2.8-2.7-6.1-2.7-7.4 0-2.8 1.8-4.4 3.6-4.4 1.3 0 2.6.8 3.8.8Zm5.3-5.1c.1.5.1 1.1-.1 1.7-.3 1.1-1 2.1-1.8 2.7-.6.4-1.5.8-2.3.7-.1-1.2.3-2.3.9-3.1.7-.9 2-1.8 3.3-2Z" />
    </svg>
  );
}
