import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const PUBLIC_URL = 'http://localhost:5173'
const ADMIN_INTERNAL = 'http://127.0.0.1:3000/admin'

function waitFor(url, timeoutMs = 60000) {
  const started = Date.now()
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url, { redirect: 'manual' })
        if (res.status > 0) {
          resolve()
          return
        }
      } catch {
        // still booting
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`))
        return
      }
      setTimeout(tick, 400)
    }
    tick()
  })
}

const children = []

function shutdown() {
  for (const child of children) {
    child.kill('SIGTERM')
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

const dashboard = spawn('npm', ['run', 'dev'], {
  cwd: path.join(root, 'dashboard'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' },
})
children.push(dashboard)

dashboard.on('exit', (code) => {
  shutdown()
  process.exit(code ?? 0)
})

await waitFor(ADMIN_INTERNAL)

const site = spawn('npx', ['vite'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
})
children.push(site)

site.on('exit', (code) => {
  shutdown()
  process.exit(code ?? 0)
})

setTimeout(() => {
  console.log(`\n  Ouren  ${PUBLIC_URL}\n  Admin  ${PUBLIC_URL}/admin\n`)
}, 800)
