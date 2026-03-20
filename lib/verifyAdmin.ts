import { dbGet } from './db'
import { promises as fs } from 'fs'
import path from 'path'

const ADMINS_KEY = 'admins'
const ADMINS_FILE = 'app/config/sections/statusAdmins.json'

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    let data = await dbGet<{ admins: { username: string; password: string }[] }>(
      ADMINS_KEY,
      ADMINS_FILE
    )

    // Bootstrap fallback: if Redis is empty (not seeded yet), read directly from JSON file
    if (!data?.admins?.length) {
      try {
        const raw = await fs.readFile(
          path.join(process.cwd(), ADMINS_FILE),
          'utf-8'
        )
        data = JSON.parse(raw)
      } catch { return false }
    }

    return (data?.admins ?? []).some(
      (a) => a.username === username && a.password === password
    )
  } catch { return false }
}
