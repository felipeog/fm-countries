import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Container,
  Header,
  Image,
  Loader,
  Button,
  Icon,
} from 'semantic-ui-react'
import './index.css'

function Country() {
  const { goBack } = useHistory()
  const { alpha2Code } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [country, setCountry] = useState([])

  useEffect(() => {
    setLoading(true)

    const fields =
      '?fields=flag;name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders'

    fetch(`https://restcountries.eu/rest/v2/alpha/${alpha2Code}${fields}`)
      .then((res) => res.json())
      .then((data) => setCountry(data))
      .catch((e) => {
        console.error(e)
        setError(true)
      })
      .finally(setLoading(false))
  }, [alpha2Code])

  function renderGrid() {
    if (loading) return <Loader active />
    if (error)
      return (
        <p>An error occurred. Please, refresh the page or try again later.</p>
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
      borders,
    } = country
    const topLevelDomainList = topLevelDomain?.join(', ') || '---'
    const currenciesList =
      currencies?.map(({ name }) => name)?.join(', ') || '---'
    const languagesList =
      languages?.map(({ name }) => name)?.join(', ') || '---'

    return (
      <>
        <Image src={flag} fluid />

        <article className="content">
          <Header as="h1">{name}</Header>

          <div className="content-columns">
            <div>
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

            <div>
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

          <div className="content-borders">
            <p className="borders-title">
              <strong>Border countries:</strong>
            </p>

            {borders?.length ? (
              borders?.map((border) => (
                <Link to={`/country/${border}`}>
                  <Button basic>{border}</Button>
                </Link>
              ))
            ) : (
              <p>---</p>
            )}
          </div>
        </article>
      </>
    )
  }

  return (
    <div className="Country">
      <Container as="main">
        <section className="header">
          <Button basic onClick={goBack}>
            <Icon name="arrow left" /> Back
          </Button>
        </section>

        <section className="grid">{renderGrid()}</section>
      </Container>
    </div>
  )
}

export default Country
