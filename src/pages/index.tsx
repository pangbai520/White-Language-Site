import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import PlatformIcon, {type PlatformName} from '../components/PlatformIcon';
import {releaseVersion} from '../data/release';
import styles from './index.module.css';

const helloWorld = `class Greeting {
    let name -> String;

    init(name -> String) {
        self.name = name;
    }

    method write() -> Void {
        print("hello, ", self.name);
    }
}

func main() -> Int {
    let greeting -> Greeting = Greeting("White");
    greeting.write();
    return 0;
}`;

const targets = [
  ['Windows', 'x86-64 / x86'],
  ['Linux', 'x86-64 / x86 / AArch64 / ARMv7'],
  ['macOS', 'Apple silicon / Intel'],
];

function ArrowIcon(): React.JSX.Element {
  return <span aria-hidden="true">↗</span>;
}

function HomeHeader(): React.JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackdrop} aria-hidden="true">W</div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.releaseLine}>
            <span className={styles.releaseDot} />
            <Translate id="home.release" values={{version: releaseVersion}}>{'White {version}'}</Translate>
          </p>
          <h1><Translate id="home.title">White</Translate></h1>
          <p className={styles.lead}>
            <Translate id="home.lead">White is a statically typed language that compiles to native code. The compiler is written in White and uses LLVM for code generation.</Translate>
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/download">
              <Translate id="home.targets.action">Supported systems</Translate>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/docs/intro">
              <Translate id="home.docs.action">Documentation</Translate>
            </Link>
          </div>
          <div className={styles.heroMeta}>
            <span>Apache-2.0</span>
            <span><Translate id="home.meta.compiler">Written in White</Translate></span>
            <span><Translate id="home.meta.output">Built with LLVM</Translate></span>
          </div>
        </div>

        <div className={styles.codeWindow}>
          <div className={styles.codeTitlebar}>
            <div className={styles.windowDots} aria-hidden="true"><span /><span /><span /></div>
            <span>hello.wl</span>
            <span className={styles.codeStatus}>wlc</span>
          </div>
          <CodeBlock language="white">{helloWorld}</CodeBlock>
          <div className={styles.terminalLine}>
            <span>$</span> wlc hello.wl <span className={styles.commandAnd}>&amp;&amp;</span> ./hello
          </div>
          <div className={styles.terminalOutput}>hello, White</div>
        </div>
      </div>
    </header>
  );
}

function LanguageSection(): React.JSX.Element {
  return (
    <section className={styles.languageSection} aria-labelledby="language-title">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}><Translate id="home.language.kicker">Language</Translate></p>
        <h2 id="language-title"><Translate id="home.language.title">Some language basics</Translate></h2>
        <p><Translate id="home.language.lead">White has static types, classes, interfaces, ARC, fallible return values, and a FFI for calling native libraries. The syntax is deliberately kept small.</Translate></p>
      </div>

      <div className={styles.languageRows}>
        <article className={styles.languageRow}>
          <div>
            <span className={styles.rowNumber}>01</span>
            <h3><Translate id="home.language.static.title">Static types</Translate></h3>
            <p><Translate id="home.language.static.body">Types may be written explicitly or inferred with Auto. Auto is resolved by the compiler and does not add a dynamic type at runtime.</Translate></p>
          </div>
          <pre><code>{`let count -> Auto = 10;\nconst limit -> Int = 64;`}</code></pre>
        </article>
        <article className={styles.languageRow}>
          <div>
            <span className={styles.rowNumber}>02</span>
            <h3><Translate id="home.language.errors.title">Errors</Translate></h3>
            <p><Translate id="home.language.errors.body">A function that can fail returns T?. Use ? at the call site and catch the error where it can be handled.</Translate></p>
          </div>
          <pre><code>{`let text -> String = input("name: ")?;\ncatch(err) { print(err); }`}</code></pre>
        </article>
        <article className={styles.languageRow}>
          <div>
            <span className={styles.rowNumber}>03</span>
            <h3><Translate id="home.language.memory.title">Memory</Translate></h3>
            <p><Translate id="home.language.memory.body">Strings, classes, interfaces, and closures are managed with ARC. Classes may define deinit when they need to release a file, handle, or other resource.</Translate></p>
          </div>
          <pre><code>{`deinit() {\n    file.close();\n}`}</code></pre>
        </article>
      </div>
    </section>
  );
}

function CompilerSection(): React.JSX.Element {
  const stages = ['.wl', 'Lexer / Parser', 'Typed AST', 'LLVM IR', 'Native'];
  return (
    <section className={styles.compilerSection} aria-labelledby="compiler-title">
      <div className={styles.compilerCopy}>
        <p className={styles.kicker}><Translate id="home.compiler.kicker">Compiler</Translate></p>
        <h2 id="compiler-title"><Translate id="home.compiler.title">How wlc builds a program</Translate></h2>
        <p><Translate id="home.compiler.body">wlc reads White source, checks it, and writes LLVM IR. Clang then produces the executable, object file, assembly, or shared library. wlc itself is built through the same process.</Translate></p>
        <Link to="https://github.com/whitelanguage/white">
          <Translate id="home.compiler.source">Compiler source</Translate> <ArrowIcon />
        </Link>
      </div>
      <ol className={styles.pipeline}>
        {stages.map((stage, index) => (
          <li key={stage}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{stage}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TargetsSection(): React.JSX.Element {
  return (
    <section className={styles.targetsSection} aria-labelledby="targets-title">
      <div className={styles.targetsHeader}>
        <div>
          <p className={styles.kicker}><Translate id="home.platforms.kicker">Platforms</Translate></p>
          <h2 id="targets-title"><Translate id="home.platforms.title">Supported systems</Translate></h2>
        </div>
        <p><Translate id="home.platforms.body">The release pipeline builds and tests wlc for the targets listed here. Cross-compiling for another operating system still requires that system's SDK or sysroot.</Translate></p>
      </div>
      <div className={styles.targetGrid}>
        {targets.map(([system, architectures]) => (
          <div key={system}>
            <span className={styles.targetMark}><PlatformIcon name={system as PlatformName} /></span>
            <h3>{system}</h3>
            <p>{architectures}</p>
          </div>
        ))}
      </div>
      <Link className={styles.textLink} to="/download">
        <Translate id="home.platforms.action">Downloads</Translate> <ArrowIcon />
      </Link>
    </section>
  );
}

function EcosystemSection(): React.JSX.Element {
  return (
    <section className={styles.ecosystemSection} aria-labelledby="ecosystem-title">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}><Translate id="home.ecosystem.kicker">Tools</Translate></p>
        <h2 id="ecosystem-title"><Translate id="home.ecosystem.title">The rest of the project</Translate></h2>
      </div>
      <div className={styles.projectLinks}>
        <Link to="https://github.com/whitelanguage/white">
          <span>wlc</span>
          <strong><Translate id="home.ecosystem.compiler">Compiler and standard library</Translate></strong>
          <ArrowIcon />
        </Link>
        <Link to="https://github.com/whitelanguage/wlls">
          <span>wlls</span>
          <strong><Translate id="home.ecosystem.server">White Language Server</Translate></strong>
          <ArrowIcon />
        </Link>
        <Link to="https://github.com/whitelanguage/vscode-white">
          <span>VS Code</span>
          <strong><Translate id="home.ecosystem.editor">Editor extension</Translate></strong>
          <ArrowIcon />
        </Link>
      </div>
      <div className={styles.limitNote}>
        <strong><Translate id="home.limits.title">Current limitations</Translate></strong>
        <p><Translate id="home.limits.body">ARC does not collect cycles, weak references are not implemented, and the generic system and standard library are still incomplete. White is not ready for general production use yet.</Translate></p>
        <Link to="https://github.com/whitelanguage/white#known-limitations">
          <Translate id="home.limits.action">Read the limitations</Translate> <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout description={translate({message: 'White is a statically typed systems language with a self-hosted compiler.', id: 'home.description'})}>
      <HomeHeader />
      <main>
        <LanguageSection />
        <CompilerSection />
        <TargetsSection />
        <EcosystemSection />
      </main>
    </Layout>
  );
}
