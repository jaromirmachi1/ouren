import { fetchRemoteProjects, querySanity, type ProjectChannel } from './projects-source';

export type OfferType = 'sale' | 'rent';

export type Listing = {
  id: string;
  slug: string;
  title: string;
  location: string;
  layout: string;
  area: number;
  landArea?: number;
  price: number;
  offer: OfferType;
  type: 'apartment' | 'house' | 'land' | 'commercial';
  status: 'available' | 'reserved' | 'sold' | 'rented';
  image: string;
  gallery?: string[];
  description: {
    cs: string;
    en: string;
  };
};

function parsePrice(value?: string) {
  if (!value) return 0;
  const digits = value.replace(/[^\d]/g, '');
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toListing(
  project: Awaited<ReturnType<typeof fetchRemoteProjects>> extends Array<infer T> | null ? T : never,
  offer: OfferType,
): Listing {
  const status =
    project.status === 'sold' ? 'sold' : project.status === 'reserved' ? 'reserved' : 'available';

  return {
    id: project.id,
    slug: project.slug,
    title: project.name,
    location: project.location,
    layout: project.layout || (project.type === 'commercial' ? 'Komerční' : project.type === 'house' ? 'Dům' : 'Byt'),
    area: project.areaSqm ?? 0,
    price: parsePrice(project.price),
    offer,
    type: project.type,
    status,
    image: project.image,
    gallery: project.gallery,
    description: project.description ?? { cs: '', en: '' },
  };
}

async function loadListings(channel: Extract<ProjectChannel, 'sale' | 'rent'>): Promise<Listing[]> {
  const remote = await fetchRemoteProjects();
  if (!remote) return [];
  return remote
    .filter((project) => project.channels.includes(channel))
    .map((project) => toListing(project, channel));
}

type StandaloneProperty = {
  _id: string;
  label: string;
  slug?: string;
  kind?: string;
  location?: string;
  layout?: string;
  status?: Listing['status'];
  areaSqm?: number;
  landAreaSqm?: number;
  priceCzk?: number;
  imageUrl?: string;
  galleryUrls?: string[];
  descriptionCs?: string;
  descriptionEn?: string;
};

const propertyProjection = `{
  _id,
  label,
  "slug": slug.current,
  "kind": coalesce(kind, "apartment"),
  location,
  layout,
  status,
  areaSqm,
  landAreaSqm,
  priceCzk,
  descriptionCs,
  descriptionEn,
  "imageUrl": coalesce(image.asset->url, layoutImage.asset->url),
  "galleryUrls": gallery[].asset->url
}`;

const saleFlatsQuery = `*[_type == "unit" && listOnSale == true] | order(label asc) ${propertyProjection}`;
const rentFlatsQuery = `*[_type == "unit" && listOnRent == true] | order(label asc) ${propertyProjection}`;

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

function propertyToListing(property: StandaloneProperty, offer: OfferType): Listing {
  const status =
    property.status === 'sold' || property.status === 'reserved' || property.status === 'rented'
      ? property.status
      : 'available';
  const kind =
    property.kind === 'house' || property.kind === 'land' || property.kind === 'commercial'
      ? property.kind
      : 'apartment';
  const defaultLayout =
    kind === 'house' ? 'Dům' : kind === 'land' ? 'Pozemek' : kind === 'commercial' ? 'Komerční' : 'Byt';
  return {
    id: property._id,
    slug: property.slug || property._id,
    title: property.label,
    location: property.location || '',
    layout: property.layout || defaultLayout,
    area: kind === 'land' ? property.landAreaSqm ?? 0 : property.areaSqm ?? 0,
    landArea:
      kind === 'house' && typeof property.landAreaSqm === 'number' && property.landAreaSqm > 0
        ? property.landAreaSqm
        : undefined,
    price: property.priceCzk ?? 0,
    offer,
    type: kind,
    status,
    image: property.imageUrl || PLACEHOLDER_IMAGE,
    gallery: (property.galleryUrls ?? []).filter((url): url is string => Boolean(url)),
    description: {
      cs: property.descriptionCs || property.descriptionEn || '',
      en: property.descriptionEn || property.descriptionCs || '',
    },
  };
}

async function loadSaleFlats(): Promise<Listing[]> {
  const rows = await querySanity<StandaloneProperty>(saleFlatsQuery);
  return (rows ?? []).map((property) => propertyToListing(property, 'sale'));
}

async function loadRentFlats(): Promise<Listing[]> {
  const rows = await querySanity<StandaloneProperty>(rentFlatsQuery);
  return (rows ?? []).map((property) => propertyToListing(property, 'rent'));
}

export async function loadSaleListings(): Promise<Listing[]> {
  const [projects, flats] = await Promise.all([loadListings('sale'), loadSaleFlats()]);
  return [...flats, ...projects];
}

export async function loadRentListings(): Promise<Listing[]> {
  const [projects, flats] = await Promise.all([loadListings('rent'), loadRentFlats()]);
  return [...flats, ...projects];
}

export async function getSaleListing(slug: string): Promise<Listing | undefined> {
  const listings = await loadSaleListings();
  return listings.find((listing) => listing.slug === slug);
}

export async function getRentListing(slug: string): Promise<Listing | undefined> {
  const listings = await loadRentListings();
  return listings.find((listing) => listing.slug === slug);
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  return (await getSaleListing(slug)) ?? (await getRentListing(slug));
}

/** @deprecated Prefer loadSaleListings / loadRentListings — kept empty for sync imports. */
export const saleListings: Listing[] = [];
export const rentListings: Listing[] = [];
