import { useEffect, useState, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Container,
  Input,
  Dropdown,
  Card,
  Image,
  Loader,
} from 'semantic-ui-react'
import ErrorMessage from '../../components/ErrorMessage'
import { regionOptions } from '../../consts/regionOptions'
import { fetchByRegion, fetchByTerm, fetchAll } from '../../utils/api'
import './index.css'

function Home() {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [countries, setCountries] = useState([])
  const [term, setTerm] = useState('')
  const [region, setRegion] = useState('')

  const loadByRegion = useCallback(
    function (region) {
      setLoading(true)

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
        .finally(setLoading(false))
    },
    [history]
  )

  const loadByTerm = useCallback(
    function (term) {
      setLoading(true)

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
        .finally(setLoading(false))
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

    setTerm(e.target.value)
  }

  function handleSearch(e) {
    e.preventDefault()

    setRegion('')

    loadByTerm(term)
  }

  function handleRegionChange(_, data) {
    setRegion(data.value)
    setTerm('')

    loadByRegion(data.value)
  }

  function renderGrid() {
    if (loading) return <Loader active />
    if (error) return <ErrorMessage />

    return countries.map(
      ({ flag, name, population, region, capital, alpha2Code }) => (
        <Link key={name} to={`/country/${alpha2Code}`}>
          <Card fluid>
            <Image src={flag} wrapped />

            <Card.Content>
              <Card.Header>{name}</Card.Header>
              <Card.Description>
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
    )
  }

  return (
    <div className="Home">
      <Container as="main">
        <section className="header">
          <form onSubmit={handleSearch}>
            <Input
              disabled={loading}
              icon="search"
              iconPosition="left"
              onChange={handleSearchChange}
              placeholder="Search for a country..."
              value={term}
            />
          </form>

          <Dropdown
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

        <section className="grid">{renderGrid()}</section>
      </Container>
    </div>
  )
}

export default Home
