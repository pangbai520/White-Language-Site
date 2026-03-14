import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './index.module.css';

function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      const i = loopNum % words.length;
      const fullText = words[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 30 : 100);
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span style={{ color: 'var(--ifm-color-primary)', fontFamily: 'var(--ifm-font-family-monospace)' }}>
      {text}<span className="cursor">|</span>
    </span>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    fetch('https://api.github.com/repos/pangbai520/White-Language/tags')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLatestVersion(data[0].name.replace(/^v/, ''));
        }
      })
      .catch(() => {});
  }, []);
  
  const typewriterWords = [
    translate({message: "predictable performance.", id: "homepage.typewriter.1"}),
    translate({message: "seamless C interoperability.", id: "homepage.typewriter.2"}),
    translate({message: "building self-hosted compilers.", id: "homepage.typewriter.3"}),
    translate({message: "modern VS Code tooling.", id: "homepage.typewriter.4"})
  ];

  return (
    <header className={clsx('hero', 'heroBanner')}>
      <div className="container">
        <h1 className="heroTitle">{siteConfig.title}</h1>
        <p className="heroSubtitle">
          <Translate id="homepage.subtitle">A system programming language for </Translate>
          <Typewriter words={typewriterWords} />
        </p>
        <div className="quickInstall" style={{ textAlign: 'center', background: 'transparent', border: 'none' }}>
          <Link
            className="button button--secondary button--lg"
            to="/download"
            style={{ 
              padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '8px',
              backgroundColor: 'rgb(27, 85, 192)', color: '#ffffff', border: 'none',
              boxShadow: '0 4px 14px 0 rgba(33, 83, 177, 0.39)'
            }}>
            <Translate id="homepage.downloadButton">Download WhiteLang</Translate>
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <Link className="button button--primary button--lg" to="/docs/intro" style={{ backgroundColor: '#60c4d6', color: '#ffffff' }}>
            <Translate id="homepage.readDocsButton">Read the Docs</Translate>
          </Link>
          <Link className="button button--secondary button--lg" to="https://github.com/pangbai520/White-Language">
            <Translate id="homepage.viewSourceButton">View Source</Translate>
          </Link>
        </div>
        <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#8b949e' }}>
          <Translate id="homepage.versionInfo" values={{ version: latestVersion }}>
            {'Version {version} • Available for Windows, macOS, and Linux'}
          </Translate>
        </p>
      </div>
    </header>
  );
}

function Showcase() {
  return (
    <section className="showcaseSection">
      <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
        <Translate id="homepage.showcase.title">High productivity, high performance</Translate>
      </h2>
      <p style={{ textAlign: 'center', color: '#8b949e', marginBottom: '3rem' }}>
        <Translate id="homepage.showcase.description">Statically-typed, self-hosted, and powered by LLVM.</Translate>
      </p>
      <div className="showcaseGrid">
        <div className="codeCard">
          <h3><Translate id="homepage.showcase.feature1.title">Built-in ARC & Safety</Translate></h3>
          <CodeBlock language="rust" title="arc_demo.wl">
{`import "builtin"

func main() -> Int {
    let message -> String = "Hello, WhiteLang!";
    let items -> Vector(String) = [];
    items.append(message);
    builtin.print(items[0]);
}`}
          </CodeBlock>
        </div>
        <div className="codeCard">
          <h3><Translate id="homepage.showcase.feature2.title">Seamless C FFI</Translate></h3>
          <CodeBlock language="rust" title="ffi_demo.wl">
{`extern func puts(s -> String) -> Int from "C";

func main() -> Int {
    puts("Calling C directly!");
    return 0;
}`}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title={translate({message: "Home", id: "homepage.pageTitle"})}
      description={translate({message: "White Language: Predictable Control, Modern Ergonomics.", id: "homepage.pageDescription"})}>
      <HomepageHeader />
      <main><Showcase /></main>
    </Layout>
  );
}