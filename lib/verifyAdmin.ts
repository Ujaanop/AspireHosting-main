import { promises as fs } from 'fs'
import path from 'path'

const ADMINS_FILE = path.join(process.cwd(), 'app', 'config', 'sections', 'statusAdmins.json')

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(ADMINS_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return (data.admins ?? []).some(
      (a: { username: string; password: string }) =>
        a.username === username && a.password === password
    )
  } catch { return false }
}
