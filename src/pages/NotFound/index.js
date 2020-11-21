import { Message, Container } from 'semantic-ui-react'
import './index.scss'

function NotFound() {
  return (
    <div className="NotFound">
      <Container as="main">
        <Message
          color="red"
          icon="exclamation"
          header="404"
          content="Page not found"
        />
      </Container>
    </div>
  )
}

export default NotFound
