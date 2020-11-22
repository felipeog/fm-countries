export function isValidRegion(region) {
  if (!region || typeof region !== 'string') return false

  const validRegions = ['africa', 'americas', 'asia', 'europe', 'oceania']

  return validRegions.includes(region.toLocaleLowerCase())
}
