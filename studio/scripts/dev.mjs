#!/usr/bin/env node
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';

const HOST = process.env.STUDIO_HOST || '0.0.0.0';
const preferredPort = Number.parseInt(process.env.STUDIO_PORT || '3333', 10);
const maxAttempts = Number.parseInt(process.env.STUDIO_PORT_SCAN_LIMIT || '20', 10);

function canBindPort(port, host) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, host);
  });
}

async function findAvailablePort(startPort, host, attempts) {
  for (let offset = 0; offset < attempts; offset += 1) {
    const port = startPort + offset;
    // Prefer fixed studio port, then fall through to the next available slots.
    if (await canBindPort(port, host)) {
      return port;
    }
  }

  throw new Error(
    `Could not find an available port in range ${startPort}-${startPort + attempts - 1}`,
  );
}

async function main() {
  const port = await findAvailablePort(preferredPort, HOST, maxAttempts);

  if (port !== preferredPort) {
    console.warn(
      `[studio-dev] Port ${preferredPort} is busy, using ${port}. Set STUDIO_PORT to override.`,
    );
  }

  const sanityCmd = process.platform === 'win32' ? 'sanity.cmd' : 'sanity';
  const additionalAllowedHosts =
    process.env.SANITY_STUDIO_ALLOWED_HOSTS || '3333.devk.my.id,devk.my.id,.devk.my.id,localhost,127.0.0.1';

  const child = spawn(sanityCmd, ['dev', '--host', HOST, '--port', String(port)], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: additionalAllowedHosts,
    },
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error('[studio-dev] Failed to start:', error.message);
  process.exit(1);
});
