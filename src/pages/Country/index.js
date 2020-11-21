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
  Message,
} from 'semantic-ui-react'
import { fetchByAlphaCode, fetchByAlphaCodeArray } from '../../utils/api'
import ErrorMessage from '../../components/ErrorMessage'
import './index.css'

function Country() {
  const { goBack } = useHistory()
  const { alpha2Code } = useParams()
  const [loadingCountry, setLoadingCountry] = useState(true)
  const [loadingBorders, setLoadingBorders] = useState(true)
  const [errorCountry, setErrorCountry] = useState(false)
  const [errorBorders, setErrorBorders] = useState(false)
  const [country, setCountry] = useState(null)
  const [borders, setBorders] = useState(null)

  useEffect(() => {
    setLoadingCountry(true)
    setCountry(null)

    fetchByAlphaCode(alpha2Code)
      .then((res) => res.json())
      .then((data) => setCountry(data))
      .catch((e) => {
        console.error(`Country@fetchByAlphaCode >>>>> ${e}`)
        setErrorCountry(true)
      })
      .finally(setLoadingCountry(false))
  }, [alpha2Code])

  useEffect(() => {
    setLoadingBorders(true)
    setBorders(null)

    if (Array.isArray(country?.borders) && country?.borders?.length) {
      const { borders } = country

      fetchByAlphaCodeArray(borders)
        .then((res) => res.json())
        .then((data) => setBorders(data))
        .catch((e) => {
          console.error(`Country@fetchByAlphaCodeArray >>>>> ${e}`)
          setErrorBorders(true)
        })
        .finally(setLoadingBorders(false))
    } else {
      setBorders([])
      setLoadingBorders(false)
    }
  }, [country])

  function renderGrid() {
    if (loadingCountry || !country || loadingBorders || !borders)
      return <Loader active />
    if (errorCountry || errorBorders) return <ErrorMessage />
    if (country?.status)
      return (
        <Message
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
    const languagesList =
      languages?.map(({ name }) => name)?.join(', ') || '---'

    return (
      <>
        <Image src={flag} alt={name} fluid />

        <article className="content">
          <Header as="h1">{name}</Header>

          <div className="content-columns">
            <div className="left">
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

            <div className="right">
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
              borders?.map(({ name, alpha2Code }) => (
                <Link key={alpha2Code} to={`/country/${alpha2Code}`}>
                  <Button basic>{name}</Button>
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
          <h1 className="hidden">Go back</h1>

          <Button basic onClick={goBack}>
            <Icon name="arrow left" /> Back
          </Button>
        </section>

        <section className="grid">
          <h1 className="hidden">Country information</h1>

          {renderGrid()}
        </section>
      </Container>
    </div>
  )
}

export default Country
