// Utility to convert epoch seconds to local date/time string
function epochToLocaleString(epoch: number): string {
  return new Date(epoch * 1000).toLocaleString();
}

// Map for alphaChar expansion
const alphaCharMap: Record<string, string> = {
  'E': 'East',
  'C': 'Central',
  'W': 'West',
  'S': 'Sierra (IFR)',
  'T': 'Tango (Turbulence)',
  'Z': 'Zulu (Icing)'
};

// Map for hazard expansion
const hazardMap: Record<string, string> = {
  'MTN OBSCN': 'Mountain Obscuration',
  'IFR': 'Instrument Flight Rules',
  'TURB': 'Turbulence',
  'ICE': 'Icing',
  'CONVECTIVE': 'Convective',
  'ASH': 'Volcanic Ash'
};

// Map for severity
const severityMap: Record<number, string> = {
  0: 'None',
  1: 'Light',
  2: 'Light-Moderate',
  3: 'Moderate (AIRMET)',
  4: 'Moderate-Severe',
  5: 'Severe (SIGMET)'
};

// Convert degrees to compass direction
function degreesToCompass(degrees: number | null): string | null {
  if (degrees === null || degrees === undefined) return null;
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

// Format coords as lat, lon strings
function formatCoords(coords: any[]): string[] {
  return coords.map((pt) => `${pt.lat}, ${pt.lon}`);
}

export function makeSigmetHumanReadable(sigmet: any): any {
  return {
    ...sigmet,
    validTimeFrom: sigmet.validTimeFrom ? epochToLocaleString(sigmet.validTimeFrom) : sigmet.validTimeFrom,
    validTimeTo: sigmet.validTimeTo ? epochToLocaleString(sigmet.validTimeTo) : sigmet.validTimeTo,
    alphaChar: sigmet.alphaChar && alphaCharMap[sigmet.alphaChar] ? `${sigmet.alphaChar} (${alphaCharMap[sigmet.alphaChar]})` : sigmet.alphaChar,
    hazard: sigmet.hazard && hazardMap[sigmet.hazard] ? `${sigmet.hazard} (${hazardMap[sigmet.hazard]})` : sigmet.hazard,
    severity: sigmet.severity !== undefined && severityMap[sigmet.severity] ? `${sigmet.severity} (${severityMap[sigmet.severity]})` : sigmet.severity,
    movementDir: degreesToCompass(sigmet.movementDir) || sigmet.movementDir,
    coords: Array.isArray(sigmet.coords) ? formatCoords(sigmet.coords) : sigmet.coords
  };
} 