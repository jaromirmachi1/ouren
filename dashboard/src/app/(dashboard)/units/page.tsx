import { UnitsView } from '@/components/views/units-view'
import { getUnits } from '@/lib/sanity'

export default async function UnitsPage() {
  const units = await getUnits()
  return <UnitsView units={units} />
}
