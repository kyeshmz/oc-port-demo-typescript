import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { retryDelayMs, retryLabel } from '../dist/retry.js';

const config = JSON.parse(readFileSync('oc-port-agent.json', 'utf8'));
const upstream = process.env.OC_PORT_REFERENCE_DIRECTORY
  || (config.upstream.repository.startsWith('https://') ? resolve('.oc-port/reference') : config.upstream.repository);
if (!existsSync(join(upstream, 'Cargo.toml'))) throw new Error('No pinned Rust reference. Run the tracking policy verification pipeline or set OC_PORT_REFERENCE_DIRECTORY for local checks.');
const packetPath = '.oc-port/context/packet.json';
if (existsSync(packetPath)) {
  const packet = JSON.parse(readFileSync(packetPath, 'utf8'));
  const actualHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: upstream, encoding: 'utf8' }).trim();
  assert.equal(actualHead, packet.plan.to, 'The Rust reference must remain pinned to the proposal commit during verification');
}
const attempts = [0, 1, 2, 3, 4, 10, 32, 0xffffffff];
const output = execFileSync('cargo', ['run', '--quiet', '--manifest-path', join(upstream, 'Cargo.toml'), '--', ...attempts.map(String)], { encoding: 'utf8' });
const rust = JSON.parse(output.trim());
const typescript = attempts.map(retryDelayMs);
assert.deepEqual(typescript, rust, 'TypeScript behavior must match the compiled Rust reference');
assert.equal(retryLabel(3), 'retry-3');
console.log(JSON.stringify({ parity: 'passed', attempts, rust, typescript, preservedTargetFeature: 'retryLabel' }, null, 2));
