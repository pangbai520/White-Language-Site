import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import PlatformIcon from '../components/PlatformIcon';
import {loadMirrorReleases, mirrorAssetUrl, releaseTargets, type MirrorRelease, type ReleaseTarget} from '../data/release';
import styles from './download.module.css';

const systems: ReleaseTarget['os'][] = ['Windows', 'macOS', 'Linux'];

function TargetCard({target}: {target: ReleaseTarget}): React.JSX.Element {
  return (
    <article className={styles.targetCard}>
      <div className={styles.cardHeading}>
        <div>
          <h3>{target.architecture}</h3>
          <code>{target.triple}</code>
        </div>
        <span className={styles.packageType}>{target.package}</span>
      </div>
    </article>
  );
}

function MirrorReleaseGroup({release, latest = false}: {release: MirrorRelease; latest?: boolean}): React.JSX.Element {
  return (
    <section className={styles.releaseGroup} aria-labelledby={`release-${release.version}`}>
      <div className={styles.releaseHeading}>
        <h3 id={`release-${release.version}`}>White {release.version}</h3>
        {latest && <span><Translate id="download.mirror.latest">Latest available release</Translate></span>}
      </div>
      <div className={styles.releaseAssets}>
        {release.assets.map(asset => (
          <Link key={`${release.version}-${asset.file}`} className={styles.downloadLink} to={mirrorAssetUrl(release, asset)}>
            <span className={styles.downloadIcon}><PlatformIcon name={asset.os} /></span>
            <span>
              <strong>{asset.os}</strong>
              <small>{asset.architecture}</small>
            </span>
            <span className={styles.downloadArrow} aria-hidden="true">↓</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TargetGroup({system}: {system: ReleaseTarget['os']}): React.JSX.Element {
  const targets = releaseTargets.filter(target => target.os === system);
  return (
    <section className={styles.targetGroup} aria-labelledby={`target-${system}`}>
      <div className={styles.groupHeading}>
        <h2 id={`target-${system}`}>{system}</h2>
        <span><Translate id="download.targets.count" values={{count: targets.length}}>{'{count} architectures'}</Translate></span>
      </div>
      <div className={styles.cardGrid}>
        {targets.map(target => <TargetCard key={target.id} target={target} />)}
      </div>
    </section>
  );
}

export default function Download(): React.JSX.Element {
  const [releases, setReleases] = useState<MirrorRelease[]>([]);
  const [releaseError, setReleaseError] = useState(false);

  useEffect(() => {
    loadMirrorReleases().then(setReleases).catch(() => setReleaseError(true));
  }, []);

  const latestRelease = releases[0];
  const archivedReleases = releases.slice(1);

  return (
    <Layout title={translate({message: 'Download', id: 'download.pageTitle'})} description={translate({message: 'White release targets and binary availability.', id: 'download.pageDescription'})}>
      <main>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <p className={styles.version}><Translate id="download.releaseLabel">Releases</Translate></p>
            <h1><Translate id="download.title">Download White</Translate></h1>
            <p className={styles.intro}><Translate id="download.intro">White is built for Windows, Linux, and macOS. Download links are shown only for files that have been published to the public mirror.</Translate></p>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.sectionLead}>
            <p className={styles.kicker}><Translate id="download.mirror.kicker">Downloads</Translate></p>
            <h2><Translate id="download.mirror.title">Latest available release</Translate></h2>
          </div>

          {!latestRelease && !releaseError && <p className={styles.releaseState}><Translate id="download.loading">Loading releases…</Translate></p>}
          {releaseError && <p className={styles.releaseState}><Translate id="download.loadError">The release list could not be loaded. Try again in a moment.</Translate></p>}
          {latestRelease && <div className={styles.releaseList}><MirrorReleaseGroup release={latestRelease} latest /></div>}

          {archivedReleases.length > 0 && <>
            <div className={styles.sectionLead}>
              <p className={styles.kicker}><Translate id="download.archive.kicker">Archive</Translate></p>
              <h2><Translate id="download.archive.title">Earlier releases</Translate></h2>
            </div>
            <div className={styles.releaseList}>
              {archivedReleases.map(release => <MirrorReleaseGroup key={release.version} release={release} />)}
            </div>
          </>}

          <div className={styles.sectionLead}>
            <p className={styles.kicker}><Translate id="download.targets.kicker">Platforms</Translate></p>
            <h2><Translate id="download.targets.title">Supported platforms</Translate></h2>
          </div>

          {systems.map(system => <TargetGroup key={system} system={system} />)}

          <section className={styles.sourceBlock}>
            <div>
              <p className={styles.kicker}><Translate id="download.source.kicker">Source</Translate></p>
              <h2><Translate id="download.source.title">Build the compiler from the repository</Translate></h2>
            </div>
            <div>
              <p><Translate id="download.source.body">The compiler, standard library, tests, and bootstrap instructions live in the main White repository. Building from source requires an existing wlc toolchain.</Translate></p>
              <Link className={styles.sourceLink} to="https://github.com/whitelanguage/white#rebuilding-the-compiler">
                <Translate id="download.source.action">Open the build instructions</Translate> <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
