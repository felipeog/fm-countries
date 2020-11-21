import { BrowserRouter, Switch, Route } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import Home from './pages/Home'
import Country from './pages/Country'
import NotFound from './pages/NotFound'

function Router() {
  return (
    <BrowserRouter>
      <AppHeader />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/country/:alpha2Code">
          <Country />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
