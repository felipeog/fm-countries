const apiUrl = 'https://restcountries.eu/rest/v2/'
const homeFields = 'fields=flag;name;population;region;capital;alpha2Code'
const countryFields =
  'fields=flag;name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders'
const bordersFields = 'fields=name;alpha2Code'

export function fetchAll() {
  const service = 'all'
  const queryString = `${service}/?${homeFields}`

  return fetch(`${apiUrl}${queryString}`)
}

export function fetchByRegion(region) {
  const service = !region ? 'all' : `region/${region}`
  const queryString = `${service}/?${homeFields}`

  return fetch(`${apiUrl}${queryString}`)
}

export function fetchByTerm(term) {
  const service = !term ? 'all' : `name/${term}`
  const queryString = `${service}/?${homeFields}`

  return fetch(`${apiUrl}${queryString}`)
}

export function fetchByAlphaCode(alphaCode) {
  const service = 'alpha'
  const queryString = `${service}/${alphaCode}?${countryFields}`

  return fetch(`${apiUrl}${queryString}`)
}

export function fetchByAlphaCodeArray(alphaCodeArray) {
  const service = 'alpha'
  const alphaCodes = `codes=${alphaCodeArray.join(';')}`
  const queryString = `${service}/?${alphaCodes}&${bordersFields}`

  return fetch(`${apiUrl}${queryString}`)
}
