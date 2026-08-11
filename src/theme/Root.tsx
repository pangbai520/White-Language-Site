import React, {useEffect, type ReactNode} from 'react';

function saveTheme() {
  const host = window.location.hostname;
  if (host !== 'white-lang.org' && !host.endsWith('.white-lang.org')) { return; }
  const theme = document.documentElement.dataset.theme;
  if (theme !== 'light' && theme !== 'dark') { return; }
  document.cookie = `wl-theme=${theme}; Domain=.white-lang.org; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

export default function Root({children}: {children: ReactNode}): React.JSX.Element {
  useEffect(() => {
    saveTheme();
    const observer = new MutationObserver(saveTheme);
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
