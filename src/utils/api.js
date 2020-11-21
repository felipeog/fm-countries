import { apiUrl } from '../consts/apiUrl'
import { homeFields } from '../consts/homeFields'
import { countryFields } from '../consts/countryFields'
import { bordersFields } from '../consts/bordersFields'

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
