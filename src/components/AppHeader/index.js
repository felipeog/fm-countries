import { useEffect, useState } from 'react'
import { Container, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './index.scss'

const LS_KEY = 'frontend-mentor/dark-theme'

function AppHeader() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const isDarkTheme = JSON.parse(localStorage.getItem(LS_KEY))

    setIsDarkTheme(isDarkTheme)
  }, [])

  useEffect(() => {
    isDarkTheme
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark')

    localStorage.setItem(LS_KEY, JSON.stringify(isDarkTheme))
  }, [isDarkTheme])

  function handleThemeChange() {
    setIsDarkTheme((isDarkTheme) => !isDarkTheme)
  }

  return (
    <div className="AppHeader">
      <Container className="header">
        <Link to="/">
          <Header className="header__title">Where in the world?</Header>
        </Link>

        <div className="toggle" onClick={handleThemeChange}>
          <Icon
            className="toggle__icon"
            name={`moon${isDarkTheme ? '' : ' outline'}`}
          />
          <p className="toggle__text">Dark mode</p>
        </div>
      </Container>
    </div>
  )
}

export default AppHeader
