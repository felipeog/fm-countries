import { Link } from 'react-router-dom'
import { Card, Image, Loader, Message } from 'semantic-ui-react'
import ErrorMessage from '../ErrorMessage'
import './index.scss'

function CountriesGrid({ countries, loading, error, notFound }) {
  if (loading) return <Loader active />
  if (error) return <ErrorMessage />
  if (notFound)
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
    <section className="CountriesGrid">
      <h1 className="hidden">Countries</h1>

      <div className="grid">
        {countries.map(
          ({ flag, name, population, region, capital, alpha2Code }) => (
            <Link key={name} to={`/country/${alpha2Code}`}>
              <Card className="grid__card" fluid>
                <Image className="grid__flag" src={flag} alt={name} />

                <Card.Content>
                  <Card.Header className="grid__name">{name}</Card.Header>
                  <Card.Description className="grid__metrics">
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
      </div>
    </section>
  )
}

export default CountriesGrid
