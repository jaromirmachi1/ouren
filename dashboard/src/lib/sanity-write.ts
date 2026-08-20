import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_TOKEN

export const isSanityWriteConfigured = Boolean(
  projectId && projectId !== 'your-project-id' && token,
)

export const sanityWriteClient = isSanityWriteConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      token: token!,
      useCdn: false,
    })
  : null
