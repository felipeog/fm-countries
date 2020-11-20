import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Country from './pages/Country'

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/country">
          <Country />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
