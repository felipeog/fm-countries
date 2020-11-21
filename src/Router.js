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
        <Route exact path="/" component={Home} />
        <Route exact path="/country/:alpha2Code" component={Country} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
