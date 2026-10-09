import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const config = JSON.parse(readFileSync('oc-port-agent.json', 'utf8'));
const packet = JSON.parse(readFileSync('.oc-port/context/packet.json', 'utf8'));
const directory = resolve('.oc-port/reference');
mkdirSync('.oc-port', { recursive: true });
const git = args => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
if (!existsSync(join(directory, '.git'))) git(['clone', '--no-checkout', config.upstream.repository, directory]);
const origin = git(['-C', directory, 'remote', 'get-url', 'origin']).trim();
if (origin !== config.upstream.repository) throw new Error('Reference origin does not match the configured private upstream');
git(['-C', directory, 'fetch', '--no-tags', 'origin', config.upstream.ref]);
git(['-C', directory, 'checkout', '--detach', packet.plan.to]);
if (git(['-C', directory, 'rev-parse', 'HEAD']).trim() !== packet.plan.to) throw new Error('Reference checkout is not pinned to the proposal');
console.log(`Pinned Rust reference to ${packet.plan.to}`);
