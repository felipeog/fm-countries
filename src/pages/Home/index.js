import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Container,
  Input,
  Dropdown,
  Card,
  Image,
  Loader,
  Message,
} from 'semantic-ui-react'
import ErrorMessage from '../../components/ErrorMessage'
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

  function renderCountryGrid() {
    if (loading || !countries) return <Loader active />
    if (error) return <ErrorMessage />
    if (!countries?.length)
      return (
        <Message
          className="not-found"
          color="yellow"
          icon="search"
          header="No results"
          content="Please, try another search term"
        />
      )

    return (
      <section className="country-grid">
        <h1 className="hidden">Countries</h1>

        {countries.map(
          ({ flag, name, population, region, capital, alpha2Code }) => (
            <Link key={name} to={`/country/${alpha2Code}`}>
              <Card className="country-grid__card" fluid>
                <Image className="country-grid__flag" src={flag} alt={name} />

                <Card.Content>
                  <Card.Header className="country-grid__name">
                    {name}
                  </Card.Header>
                  <Card.Description className="country-grid__metrics">
                    <p>
                      <strong>Population:</strong> {population.toLocaleString()}
                    </p>
                    <p>
                      <strong>Region:</strong> {region}
                    </p>
                    <p>
                      <strong>Capital:</strong> {capital}
                    </p>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Link>
          )
        )}
      </section>
    )
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

        {renderCountryGrid()}
      </Container>
    </div>
  )
}

export default Home
