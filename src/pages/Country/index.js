import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Container, Button, Icon } from 'semantic-ui-react'
import CountryContent from '../../components/CountryContent'
import { fetchByAlphaCode, fetchByAlphaCodeArray } from '../../utils/api'
import './index.scss'

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

  return (
    <div className="Country">
      <Container as="main">
        <section className="header">
          <h1 className="hidden">Go back</h1>

          <Button className="header__back-button" basic onClick={goBack}>
            <Icon name="arrow left" /> Back
          </Button>
        </section>

        <CountryContent
          country={country}
          borders={borders}
          loading={loadingCountry || !country || loadingBorders || !borders}
          error={errorCountry || errorBorders}
          notFound={country?.status}
        />
      </Container>
    </div>
  )
}

export default Country
