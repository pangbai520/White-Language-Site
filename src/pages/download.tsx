import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

export default function Download() {
  const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown');
  const [versions, setVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) setOs('windows');
    else if (userAgent.indexOf('mac') !== -1) setOs('mac');
    else if (userAgent.indexOf('linux') !== -1) setOs('linux');

    fetch('https://api.github.com/repos/pangbai520/White-Language/tags')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const vList = data.map((tag: any) => tag.name.replace(/^v/, ''));
          setVersions(vList);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch versions:", err);
        setVersions(['0.1.1']);
        setIsLoading(false);
      });
  }, []);

  const CURRENT_VERSION = versions[0] || '0.1.1';

  const getDownloadLink = (platform: 'windows' | 'mac' | 'linux', version: string) => {
    const isLatest = version === CURRENT_VERSION;
    const baseUrl = `https://static.white-lang.org/${isLatest ? 'latest' : 'v' + version}`;
    
    if (platform === 'windows') {
      return `${baseUrl}/WhiteLanguage-Windows-x64-Setup-${version}.exe`;
    } else if (platform === 'mac') {
      return `${baseUrl}/whitelang-macos-arm64.tar-${version}.gz`;
    } else {
      return `${baseUrl}/whitelang-linux-x64.tar-${version}.gz`;
    }
  };

  const GreenButtonStyle = {
    padding: '1rem 3rem',
    fontSize: '1.2rem',
    borderRadius: '8px',
    backgroundColor: '#2cc1e6',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 14px 0 rgba(46, 152, 160, 0.39)',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block'
  };

  return (
    <Layout 
      title={translate({message: "Download WhiteLang", id: "download.pageTitle"})} 
      description={translate({message: "Automatic distribution of the White Language Compiler.", id: "download.pageDescription"})}>
      <main style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>
          <Translate id="download.title">Get White Language</Translate>
        </h1>
        
        {isLoading ? (
          <p style={{ color: '#8b949e' }}>
            <Translate id="download.loading">Fetching latest build information...</Translate>
          </p>
        ) : (
          <>
            <p style={{ fontSize: '1.2rem', color: '#8b949e', marginBottom: '3rem' }}>
              <Translate id="download.currentStable" values={{version: CURRENT_VERSION}}>
                {'Current Stable: v{version} • Statically-typed & Self-hosted'}
              </Translate>
            </p>

            <div style={{ 
              backgroundColor: 'var(--ifm-background-surface-color)', 
              padding: '4rem 2rem', 
              borderRadius: '16px',
              border: '1px solid var(--wl-border-color)',
              marginBottom: '2rem'
            }}>
              {os === 'unknown' ? (
                <p><Translate id="download.selectPlatform">Please select a platform below.</Translate></p>
              ) : (
                <>
                  <h2 style={{ marginBottom: '1.5rem' }}>
                    <Translate id="download.recommendedFor" values={{osName: os.charAt(0).toUpperCase() + os.slice(1)}}>
                      {'Recommended for {osName}'}
                    </Translate>
                  </h2>
                  <Link className="button" to={getDownloadLink(os as any, CURRENT_VERSION)} style={GreenButtonStyle}>
                    <Translate id="download.mainButton" values={{version: CURRENT_VERSION, osLabel: os === 'windows' ? 'Windows' : os === 'mac' ? 'macOS' : 'Linux'}}>
                      {'Download v{version} for {osLabel}'}
                    </Translate>
                  </Link>
                  <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#8b949e' }}>
                    <Translate id="download.setupNote">Includes the wlc compiler and std.</Translate>
                  </p>
                </>
              )}
            </div>

            <button 
              onClick={() => setShowHistory(!showHistory)}
              style={{
                background: 'transparent',
                border: `1px solid var(--wl-border-color)`,
                color: 'var(--ifm-color-primary)',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                cursor: 'pointer',
                marginBottom: '3rem',
                transition: 'all 0.2s'
              }}>
              {showHistory ? (
                <Translate id="download.history.hide">↑ Hide History</Translate>
              ) : (
                <Translate id="download.history.show">↓ View All Versions</Translate>
              )}
            </button>

            {showHistory && (
              <div style={{ textAlign: 'left', animation: 'fadeIn 0.5s' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: '#8b949e' }}>
                      <th style={{ padding: '1rem' }}><Translate id="download.table.version">Version</Translate></th>
                      <th style={{ padding: '1rem' }}><Translate id="download.table.windows">Windows (.exe)</Translate></th>
                      <th style={{ padding: '1rem' }}><Translate id="download.table.macos">macOS (.tar.gz)</Translate></th>
                      <th style={{ padding: '1rem' }}><Translate id="download.table.linux">Linux (.tar.gz)</Translate></th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map(v => (
                      <tr key={v} style={{ borderBottom: '1px solid var(--wl-border-color)' }}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>v{v}</td>
                        <td style={{ padding: '1rem' }}>
                          <Link to={getDownloadLink('windows', v)}><Translate id="download.table.downloadAction">Download</Translate></Link>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <Link to={getDownloadLink('mac', v)}><Translate id="download.table.downloadAction">Download</Translate></Link>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <Link to={getDownloadLink('linux', v)}><Translate id="download.table.downloadAction">Download</Translate></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <p style={{ marginTop: '4rem', color: '#8b949e', fontSize: '0.9rem' }}>
          <Translate id="download.footer.license" values={{ license: <strong>Apache-2.0</strong> }}>
            {'Licensed under {license}.'}
          </Translate>
          <br/>
          <Translate id="download.footer.source" values={{ githubLink: <Link to="https://github.com/pangbai520/White-Language">Source Code</Link> }}>
            {'Check {githubLink} for build instructions.'}
          </Translate>
        </p>
      </main>
    </Layout>
  );
}