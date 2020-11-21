import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Input,
  Dropdown,
  Card,
  Image,
  Loader,
} from 'semantic-ui-react'
import { regionOptions } from '../../consts/regionOptions'
import './index.css'

function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [countries, setCountries] = useState([])
  const [term, setTerm] = useState('')
  const [region, setRegion] = useState('')

  useEffect(() => {
    setLoading(true)

    fetch(`https://restcountries.eu/rest/v2/all`)
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(e)
        setError(true)
      })
      .finally(setLoading(false))
  }, [])

  function loadByRegion(region) {
    setLoading(true)

    const service = !region ? 'all' : `region/${region}`
    const fields = '?fields=flag;name;population;region;capital;alpha2Code'
    const queryString = `${service}${fields}`

    fetch(`https://restcountries.eu/rest/v2/${queryString}`)
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(e)
        setError(true)
      })
      .finally(setLoading(false))
  }

  function loadByName(term) {
    const queryString = !term ? 'all' : `name/${term}`

    fetch(`https://restcountries.eu/rest/v2/${queryString}`)
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(e)
        setError(true)
      })
      .finally(setLoading(false))
  }

  function handleSearchChange(e) {
    e.preventDefault()

    setTerm(e.target.value)
  }

  function handleSearch(e) {
    e.preventDefault()

    setRegion('')

    loadByName(term)
  }

  function handleRegionChange(_, data) {
    setRegion(data.value)
    setTerm('')

    loadByRegion(data.value)
  }

  function renderGrid() {
    if (loading) return <Loader active />
    if (error)
      return (
        <p>An error occurred. Please, refresh the page or try again later.</p>
      )

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
