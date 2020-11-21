import { Link } from 'react-router-dom'
import { Header, Image, Loader, Button, Message } from 'semantic-ui-react'
import ErrorMessage from '../ErrorMessage'
import './index.scss'

function CountryContent({ country, borders, loading, error, notFound }) {
  if (loading) return <Loader active />
  if (error) return <ErrorMessage />
  if (notFound)
    return (
      <Message
        className="error"
        color="red"
        icon="exclamation"
        header="Not found"
        content="Invalid URL"
      />
    )

  const {
    flag,
    name,
    nativeName,
    population,
    region,
    subregion,
    capital,
    topLevelDomain,
    currencies,
    languages,
  } = country
  const topLevelDomainList = topLevelDomain?.join(', ') || '---'
  const currenciesList =
    currencies?.map(({ name }) => name)?.join(', ') || '---'
  const languagesList = languages?.map(({ name }) => name)?.join(', ') || '---'

  return (
    <section className="CountryContent">
      <h1 className="hidden">Country information</h1>

      <article className="country">
        <Image className="country__flag" src={flag} alt={name} fluid />

        <div className="country__content">
          <Header className="country__name" as="h1">
            {name}
          </Header>

          <div className="country__columns">
            <div className="country__column">
              <p>
                <strong>Native name:</strong> {nativeName}
              </p>
              <p>
                <strong>Population:</strong> {population?.toLocaleString()}
              </p>
              <p>
                <strong>Region:</strong> {region}
              </p>
              <p>
                <strong>Sub region:</strong> {subregion}
              </p>
              <p>
                <strong>Capital:</strong> {capital}
              </p>
            </div>

            <div className="country__column">
              <p>
                <strong>Top level domain:</strong> {topLevelDomainList}
              </p>
              <p>
                <strong>Currencies:</strong> {currenciesList}
              </p>
              <p>
                <strong>Languages:</strong> {languagesList}
              </p>
            </div>
          </div>

          <div className="borders">
            <p className="borders__title">
              <strong>Border countries:</strong>
            </p>

            {borders?.length ? (
              borders?.map(({ name, alpha2Code }) => (
                <Link key={alpha2Code} to={`/country/${alpha2Code}`}>
                  <Button className="borders__button" basic>
                    {name}
                  </Button>
                </Link>
              ))
            ) : (
              <p>---</p>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}

export default CountryContent
