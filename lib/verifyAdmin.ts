import { dbGet } from './db'

const ADMINS_KEY = 'admins'
const ADMINS_FILE = 'app/config/sections/statusAdmins.json'

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const data = await dbGet<{ admins: { username: string; password: string }[] }>(
      ADMINS_KEY,
      ADMINS_FILE
    )
    return (data?.admins ?? []).some(
      (a) => a.username === username && a.password === password
    )
  } catch { return false }
}
