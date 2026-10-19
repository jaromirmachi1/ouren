import type { Project } from '../types';
import { buildInventory } from './inventory';
import { activeProjects as staticActiveProjects, soldProjects as staticSoldProjects } from './projects';

export type ProjectChannel = 'residential' | 'sale' | 'rent';

const PROJECT_CHANNELS: ProjectChannel[] = ['residential', 'sale', 'rent'];

export type SanityProject = {
  _id: string;
  name: string;
  slug: string;
  location?: string;
  channels?: string[];
  channel?: ProjectChannel | string;
  type?: Project['type'];
  layout?: string;
  status?: Project['status'];
  price?: string;
  units?: number;
  areaSqm?: number;
  year?: number;
  featured?: boolean;
  websiteUrl?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  descriptionCs?: string;
  descriptionEn?: string;
};

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production';
const apiVersion = (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) || '2025-01-01';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

const projectsQuery = `*[_type == "project"] | order(featured desc, name asc) {
  _id,
  name,
  "slug": slug.current,
  location,
  channels,
  channel,
  type,
  layout,
  status,
  price,
  units,
  areaSqm,
  year,
  featured,
  websiteUrl,
  descriptionCs,
  descriptionEn,
  "imageUrl": coalesce(image.asset->url, coverImageUrl),
  "galleryUrls": gallery[].asset->url
}`;

export function normalizeChannels(channels?: unknown, legacy?: unknown): ProjectChannel[] {
  const fromArray = Array.isArray(channels)
    ? channels.filter((value): value is ProjectChannel =>
        PROJECT_CHANNELS.includes(value as ProjectChannel),
      )
    : [];
  if (fromArray.length) return [...new Set(fromArray)];

  if (typeof legacy === 'string' && PROJECT_CHANNELS.includes(legacy as ProjectChannel)) {
    return [legacy as ProjectChannel];
  }

  return ['residential'];
}

export type MappedProject = Project & { channels: ProjectChannel[]; layout?: string };

export function mapSanityProject(doc: SanityProject): MappedProject {
  const units = typeof doc.units === 'number' ? doc.units : 0;
  const slug = doc.slug || doc._id;
  const type = doc.type === 'house' || doc.type === 'commercial' ? doc.type : 'apartment';
  const status =
    doc.status === 'reserved' || doc.status === 'sold' || doc.status === 'inProgress'
      ? doc.status
      : 'available';
  const gallery = (doc.galleryUrls ?? []).filter(Boolean);
  const channels = normalizeChannels(doc.channels, doc.channel);
  const residential = channels.includes('residential');

  return {
    id: doc._id,
    name: doc.name,
    location: doc.location || '',
    type,
    status,
    price: doc.price || '',
    units,
    areaSqm: typeof doc.areaSqm === 'number' && doc.areaSqm > 0 ? doc.areaSqm : undefined,
    image: doc.imageUrl || PLACEHOLDER_IMAGE,
    year: doc.year || new Date().getFullYear(),
    slug,
    websiteUrl: doc.websiteUrl,
    gallery: gallery.length ? gallery : undefined,
    channels,
    layout: doc.layout || undefined,
    description:
      doc.descriptionCs || doc.descriptionEn
        ? {
            cs: doc.descriptionCs || doc.descriptionEn || '',
            en: doc.descriptionEn || doc.descriptionCs || '',
          }
        : undefined,
    inventory: residential && units > 0 ? buildInventory(slug, units) : [],
  };
}

function projectsQueryUrl() {
  const path = `/v${apiVersion}/data/query/${dataset}`;
  if (import.meta.env.DEV) {
    return new URL(`/sanity-api${path}`, window.location.origin);
  }
  return new URL(`https://${projectId}.api.sanity.io${path}`);
}

export async function querySanity<T>(query: string): Promise<T[] | null> {
  if (!projectId || projectId === 'your-project-id') return null;
  const url = projectsQueryUrl();
  url.searchParams.set('query', query);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const json = (await response.json()) as { result?: T[] };
    return json.result ?? [];
  } catch {
    return null;
  }
}

export async function fetchRemoteProjects(): Promise<MappedProject[] | null> {
  if (!projectId || projectId === 'your-project-id') return null;

  const url = projectsQueryUrl();
  url.searchParams.set('query', projectsQuery);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const json = (await response.json()) as { result?: SanityProject[] };
    const rows = json.result ?? [];
    if (!rows.length) return null;
    return rows.map(mapSanityProject);
  } catch {
    return null;
  }
}

function isResidential(project: { channels?: ProjectChannel[] }) {
  return Boolean(project.channels?.includes('residential'));
}

export async function loadActiveProjects(): Promise<Project[]> {
  const remote = await fetchRemoteProjects();
  if (!remote) return staticActiveProjects;
  return remote.filter((project) => isResidential(project) && project.status !== 'sold');
}

export async function loadSoldProjects(): Promise<Project[]> {
  const remote = await fetchRemoteProjects();
  if (!remote) return staticSoldProjects;
  const sold = remote.filter((project) => isResidential(project) && project.status === 'sold');
  return sold.length ? sold : staticSoldProjects;
}

export async function loadProjectBySlug(slug: string): Promise<Project | undefined> {
  const remote = await fetchRemoteProjects();
  const fromStatic =
    staticActiveProjects.find((project) => project.slug === slug) ??
    staticSoldProjects.find((project) => project.slug === slug);

  if (!remote) return fromStatic;
  return (
    remote.find((project) => isResidential(project) && project.slug === slug) ?? fromStatic
  );
}
