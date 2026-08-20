import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Customer } from '@/lib/types'

const dataDir = path.join(process.cwd(), '.data')
const dataFile = path.join(dataDir, 'customers.json')
const deletedFile = path.join(dataDir, 'deleted-ids.json')

async function writeJson(file: string, value: unknown) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8')
}

export async function readLocalCustomers(): Promise<Customer[]> {
  try {
    const raw = await readFile(dataFile, 'utf8')
    const parsed = JSON.parse(raw) as Customer[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function upsertLocalCustomer(customer: Customer) {
  const customers = await readLocalCustomers()
  const index = customers.findIndex((item) => item._id === customer._id)
  if (index >= 0) customers[index] = customer
  else customers.unshift(customer)
  await writeJson(dataFile, customers)
}

export async function readDeletedCustomerIds(): Promise<string[]> {
  try {
    const raw = await readFile(deletedFile, 'utf8')
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function removeLocalCustomer(id: string) {
  const customers = (await readLocalCustomers()).filter((customer) => customer._id !== id)
  await writeJson(dataFile, customers)
  const deleted = await readDeletedCustomerIds()
  if (!deleted.includes(id)) {
    deleted.push(id)
    await writeJson(deletedFile, deleted)
  }
}
