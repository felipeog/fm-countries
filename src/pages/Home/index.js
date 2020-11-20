import { useEffect, useState } from 'react'
import {
  Container,
  Input,
  Dropdown,
  Card,
  Image,
  Loader,
} from 'semantic-ui-react'
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
    if (error) return <p>Error</p>

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
          />

          <Dropdown
            placeholder="Filer by region"
            selection
            options={[
              {
                key: 0,
                text: 'All',
                value: 0,
              },
            ]}
          />
        </div>

        <div className="grid">{renderGrid()}</div>
      </Container>
    </div>
  )
}

export default Home
