export type ReleaseTarget = {
  id: string;
  os: 'Windows' | 'macOS' | 'Linux';
  architecture: string;
  triple: string;
  package: string;
};

export type MirrorAsset = {
  os: ReleaseTarget['os'];
  architecture: string;
  file: string;
  folder: string;
};

export type MirrorRelease = {
  version: string;
  assets: MirrorAsset[];
};

type GitHubAsset = {
  name: string;
};

type GitHubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
};

export const mirrorBaseUrl = 'https://static.white-lang.org';

export const releaseTargets: ReleaseTarget[] = [
  {id: 'windows-x64', os: 'Windows', architecture: 'x86-64', triple: 'x86_64-pc-windows-gnu', package: 'Installer / ZIP'},
  {id: 'windows-x86', os: 'Windows', architecture: 'x86', triple: 'i686-pc-windows-gnu', package: 'Installer / ZIP'},
  {id: 'macos-arm64', os: 'macOS', architecture: 'Apple silicon', triple: 'aarch64-apple-darwin', package: 'tar.gz'},
  {id: 'macos-x64', os: 'macOS', architecture: 'Intel', triple: 'x86_64-apple-darwin', package: 'tar.gz'},
  {id: 'linux-x64', os: 'Linux', architecture: 'x86-64', triple: 'x86_64-unknown-linux-gnu', package: 'tar.gz'},
  {id: 'linux-x86', os: 'Linux', architecture: 'x86', triple: 'i686-unknown-linux-gnu', package: 'tar.gz'},
  {id: 'linux-arm64', os: 'Linux', architecture: 'AArch64', triple: 'aarch64-unknown-linux-gnu', package: 'tar.gz'},
  {id: 'linux-armv7', os: 'Linux', architecture: 'ARMv7', triple: 'armv7-unknown-linux-gnueabihf', package: 'tar.gz'},
];

function architectureName(name: string): string {
  const architectures: Record<string, string> = {
    amd64: 'x86-64',
    x64: 'x86-64',
    x32: 'x86',
    i386: 'x86',
    i686: 'x86',
    x86: 'x86',
    aarch64: 'AArch64',
    arm64: 'AArch64',
    armv7: 'ARMv7',
  };
  return architectures[name.toLowerCase()] ?? name;
}

type CandidateAsset = Omit<MirrorAsset, 'folder'>;

function parseAsset(file: string, version: string): CandidateAsset | null {
  const escapedVersion = version.replace(/\./g, '\\.');
  const windows = file.match(new RegExp(`^WhiteLanguage-Windows-(.+)-Setup-${escapedVersion}\\.exe$`, 'i'));
  if (windows) { return {os: 'Windows', architecture: architectureName(windows[1]), file}; }

  const archive = file.match(new RegExp(`^whitelang-(linux|macos)-(.+)-${escapedVersion}\\.tar\\.gz$`, 'i'));
  if (!archive) { return null; }
  return {os: archive[1].toLowerCase() === 'linux' ? 'Linux' : 'macOS', architecture: architectureName(archive[2]), file};
}

async function findMirrorAsset(asset: CandidateAsset, version: string, latest: boolean): Promise<MirrorAsset | null> {
  const folders = latest ? ['latest', `v${version}`] : [`v${version}`];

  for (const folder of folders) {
    try {
      const response = await fetch(`${mirrorBaseUrl}/${folder}/${asset.file}`, {method: 'HEAD', cache: 'no-store'});
      if (response.ok) { return {...asset, folder}; }
    } catch {
      // An unavailable mirror entry is the same as a missing release asset here.
    }
  }
  return null;
}

function compareVersions(left: string, right: string): number {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (rightParts[index] ?? 0) - (leftParts[index] ?? 0);
    if (difference !== 0) { return difference; }
  }
  return 0;
}

export async function loadMirrorReleases(): Promise<MirrorRelease[]> {
  const response = await fetch('https://api.github.com/repos/pangbai520/White-Language-Release/releases?per_page=100');
  if (!response.ok) { throw new Error(`GitHub returned ${response.status}`); }

  const releases = await response.json() as GitHubRelease[];
  const candidates = releases.flatMap(release => {
    const version = release.tag_name.replace(/^v/, '');
    if (release.draft || release.prerelease || !/^\d+\.\d+(?:\.\d+)?$/.test(version)) { return []; }
    const assets = release.assets.map(asset => parseAsset(asset.name, version)).filter((asset): asset is CandidateAsset => asset !== null);
    return assets.length === 0 ? [] : [{version, assets}];
  });

  candidates.sort((left, right) => compareVersions(left.version, right.version));
  const checked = await Promise.all(candidates.map(async (release, index) => {
    const assets = await Promise.all(release.assets.map(asset => findMirrorAsset(asset, release.version, index === 0)));
    return {version: release.version, assets: assets.filter((asset): asset is MirrorAsset => asset !== null)};
  }));
  return checked.filter(release => release.assets.length > 0);
}

export function mirrorAssetUrl(release: MirrorRelease, asset: MirrorAsset): string {
  return `${mirrorBaseUrl}/${asset.folder}/${asset.file}`;
}
