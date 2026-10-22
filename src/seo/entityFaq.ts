import type { Listing } from '../data/listings';
import type { Translations } from '../i18n/types';
import type { Project } from '../types';

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

export function listingFaq(listing: Listing, locale: 'cs' | 'en', copy: Translations['entityFaq']) {
  const localeTag = locale === 'cs' ? 'cs-CZ' : 'en-GB';
  const area = listing.area ? `${listing.area.toLocaleString(localeTag)} m²` : '';
  const land =
    listing.landArea && listing.landArea > 0
      ? `${listing.landArea.toLocaleString(localeTag)} m²`
      : '';
  const vars = { name: listing.title, location: listing.location, area, land };
  const sizeA = !area
    ? fill(copy.sizeUnknown, vars)
    : land
      ? fill(copy.sizeLandA, vars)
      : fill(copy.sizeA, vars);

  return {
    title: copy.title,
    items: [
      { q: fill(copy.whereQ, vars), a: fill(copy.whereA, vars) },
      { q: fill(copy.statusQ, vars), a: fill(copy.statusA[listing.status], vars) },
      { q: fill(copy.sizeQ, vars), a: sizeA },
      { q: fill(copy.nextQ, vars), a: fill(copy.nextA, vars) },
    ],
  };
}

export function projectFaq(project: Project, copy: Translations['entityFaq'], statusLabel: string) {
  const available = project.inventory?.filter((unit) => unit.status === 'available').length ?? 0;
  const total = String(project.inventory?.length || project.units || 0);
  const vars = {
    name: project.name,
    location: project.location,
    available: String(available),
    total,
    status: statusLabel,
  };

  return {
    title: copy.projectTitle,
    items: [
      { q: fill(copy.whereQ, vars), a: fill(copy.whereA, vars) },
      {
        q: fill(copy.unitsQ, vars),
        a: fill(available > 0 ? copy.unitsA : copy.unitsNone, vars),
      },
      { q: fill(copy.projectStatusQ, vars), a: fill(copy.projectStatusA, vars) },
      { q: fill(copy.nextQ, vars), a: fill(copy.nextA, vars) },
    ],
  };
}
