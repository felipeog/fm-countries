import { useEffect, useState, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Input, Dropdown } from 'semantic-ui-react'
import CountriesGrid from '../../components/CountriesGrid'
import { regionOptions } from '../../consts/regionOptions'
import { fetchByRegion, fetchByTerm, fetchAll } from '../../utils/api'
import './index.scss'

function Home() {
  const history = useHistory()
  const searchRef = useRef()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [countries, setCountries] = useState(null)
  const [term, setTerm] = useState('')
  const [region, setRegion] = useState('')
  const [typingTimeoutId, setTypingTimeoutId] = useState(null)

  const loadByRegion = useCallback(
    function (region) {
      setLoading(true)
      setCountries(null)

      history.push({
        search: !region ? '' : `?region=${region}`,
      })

      fetchByRegion(region)
        .then((res) => res.json())
        .then((data) => setCountries(data))
        .catch((e) => {
          console.error(`Home@fetchByRegion >>>>> ${e}`)
          setError(true)
        })
        .finally(() => setLoading(false))
    },
    [history]
  )

  const loadByTerm = useCallback(
    function (term) {
      setLoading(true)
      setCountries(null)

      history.push({
        search: !term ? '' : `?term=${term}`,
      })

      fetchByTerm(term)
        .then((res) => res.json())
        .then((data) => setCountries(data))
        .catch((e) => {
          console.error(`Home@fetchByTerm >>>>> ${e}`)
          setError(true)
        })
        .finally(() => {
          setLoading(false)
          searchRef.current.focus()
        })
    },
    [history]
  )

  useEffect(() => {
    setLoading(true)

    const query = new URLSearchParams(window.location.search)
    const [region, term] = [query.get('region'), query.get('term')]

    if (region) {
      setRegion(region)
      loadByRegion(region)
      return
    }

    if (term) {
      setTerm(term)
      loadByTerm(term)
      return
    }

    fetchAll()
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(`Home@fetchAll >>>>> ${e}`)
        setError(true)
      })
      .finally(setLoading(false))
  }, [loadByRegion, loadByTerm])

  function handleSearchChange(e) {
    e.preventDefault()
    clearTimeout(typingTimeoutId)

    const term = e.target.value

    setRegion('')
    setTerm(term)

    setTypingTimeoutId(() => setTimeout(() => loadByTerm(term), 600))
  }

  function handleRegionChange(_, data) {
    setRegion(data.value)
    setTerm('')

    loadByRegion(data.value)
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
            icon="search"
            iconPosition="left"
            onChange={handleSearchChange}
            placeholder="Search for a country..."
            ref={searchRef}
            value={term}
          />

          <Dropdown
            className="header__select"
            clearable
            disabled={loading}
            onChange={handleRegionChange}
            options={regionOptions}
            placeholder="Filter by region"
            selection
            selectOnBlur={false}
            selectOnNavigation={false}
            value={region}
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
