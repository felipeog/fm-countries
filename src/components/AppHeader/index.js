import { Container, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './index.scss'

function AppHeader() {
  return (
    <div className="AppHeader">
      <Container>
        <Link to="/">
          <Header>Where in the world?</Header>
        </Link>
      </Container>
    </div>
  )
}

export default AppHeader
