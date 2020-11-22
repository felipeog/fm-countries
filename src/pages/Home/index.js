import { useEffect, useState, useCallback, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Input, Dropdown } from 'semantic-ui-react'
import CountriesGrid from '../../components/CountriesGrid'
import { regionOptions } from '../../consts/regionOptions'
import { fetchByRegion, fetchByTerm, fetchAll } from '../../utils/api'
import { isValidRegion } from '../../utils/isValidRegion'
import './index.scss'

function Home() {
  const history = useHistory()
  const location = useLocation()
  const searchRef = useRef()
  const timeoutRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [countries, setCountries] = useState(null)
  const [term, setTerm] = useState('')
  const [region, setRegion] = useState('')

  const loadByRegion = useCallback(function (region) {
    fetchByRegion(region)
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(`Home@fetchByRegion >>>>> ${e}`)
        setError(true)
      })
      .finally(() => {
        setTerm('')
        setRegion(region)
        setLoading(false)
      })
  }, [])

  const loadByTerm = useCallback(function (term) {
    fetchByTerm(term)
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(`Home@fetchByTerm >>>>> ${e}`)
        setError(true)
      })
      .finally(() => {
        setRegion('')
        setTerm(term)
        setLoading(false)
        searchRef.current.focus()
      })
  }, [])

  const loadAll = useCallback(function () {
    fetchAll()
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(`Home@fetchAll >>>>> ${e}`)
        setError(true)
      })
      .finally(() => {
        setRegion('')
        setTerm('')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    setCountries(null)

    const query = new URLSearchParams(location.search)
    const [region, term] = [query.get('region'), query.get('term')]

    if (region && isValidRegion(region)) {
      loadByRegion(region)
      return
    }

    if (term) {
      loadByTerm(term)
      return
    }

    loadAll()
  }, [loadByRegion, loadByTerm, loadAll, location])

  function handleSearchChange(e) {
    e.preventDefault()
    clearTimeout(timeoutRef.current)

    const term = e.target.value
    setTerm(term)

    timeoutRef.current = setTimeout(() => {
      history.push({
        search: !term ? '' : `?term=${term}`,
      })
    }, 600)
  }

  function handleRegionChange(_, data) {
    const region = data.value

    history.push({
      search: !region ? '' : `?region=${region}`,
    })
  }

  const inputOptions = {
    icon: 'search',
    iconPosition: 'left',
  }

  const dropdownOptions = {
    clearable: true,
    selection: true,
    selectOnBlur: false,
    selectOnNavigation: false,
  }

  return (
    <div className="Home">
      <Container as="main" key="main">
        <section className="header">
          <h1 className="hidden">Search</h1>

          <Input
            className="header__search"
            aria-label="Country search input"
            disabled={loading}
            onChange={handleSearchChange}
            placeholder="Search for a country..."
            ref={searchRef}
            value={term}
            {...inputOptions}
          />

          <Dropdown
            className="header__select"
            disabled={loading}
            onChange={handleRegionChange}
            options={regionOptions}
            placeholder="Filter by region"
            value={region}
            {...dropdownOptions}
          />
        </section>

        <CountriesGrid
          countries={countries}
          loading={loading || !countries}
          error={error}
          notFound={!countries?.length}
        />
      </Container>
    </div>
  )
}

export default Home
