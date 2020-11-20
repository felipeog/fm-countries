import { useEffect, useState } from 'react'
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

  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((e) => {
        console.error(e)
        setError(true)
      })
      .finally(setLoading(false))
  }, [])

  function renderGrid() {
    if (loading) return <Loader active />
    if (error)
      return (
        <p>An error occurred. Please, refresh the page or try again later.</p>
      )

    return countries.map(({ flag, name, population, region, capital }) => (
      <Card key={name} fluid>
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
    ))
  }

  return (
    <div className="Home">
      <Container>
        <div className="header">
          <Input
            icon="search"
            iconPosition="left"
            placeholder="Search for a country..."
            disabled={loading}
          />

          <Dropdown
            placeholder="Filer by region"
            selection
            clearable
            disabled={loading}
            options={regionOptions}
            selectOnBlur={false}
            selectOnNavigation={false}
            onChange={(_, data) => console.log(data.value)}
          />
        </div>

        <div className="grid">{renderGrid()}</div>
      </Container>
    </div>
  )
}

export default Home
