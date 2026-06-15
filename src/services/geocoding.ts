/**
 * geocoding — city/place search via Open-Meteo's geocoding API. Free, no API key
 * (same provider as the weather service), called directly from the app. Shared
 * service powering type-ahead location pickers (profile + gardens).
 */

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface GeoPlace {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
}

interface RawResult {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoPlace[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const params = new URLSearchParams({ name: q, count: '6', language: 'en', format: 'json' });
  const res = await fetch(`${BASE_URL}?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);

  const data = (await res.json()) as { results?: RawResult[] };
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

const US_STATE_ABBR: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
  Connecticut: 'CT', Delaware: 'DE', 'District of Columbia': 'DC', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY',
  Louisiana: 'LA', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
  Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

/** A friendly one-line label: "Tampa, FL" (US) or "Paris, France" (elsewhere). */
export function formatPlace(p: GeoPlace): string {
  if (p.countryCode === 'US' && p.admin1) {
    return `${p.name}, ${US_STATE_ABBR[p.admin1] ?? p.admin1}`;
  }
  if (p.country) return `${p.name}, ${p.country}`;
  return p.name;
}

/** A secondary line for disambiguation: region + country ("Florida · United States"). */
export function placeSubtitle(p: GeoPlace): string {
  return [p.admin1, p.country].filter(Boolean).join(' · ');
}
