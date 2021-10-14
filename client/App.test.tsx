import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { App } from './App'
import { rootState } from './state/RootContext'

test('Renders loading screen', () => {
  render(<App />)
  const linkElement = screen.getAllByText(/Loading/i)
  expect(linkElement[0]).toBeInTheDocument()
})

test('Renders login screen when logged out', () => {
  rootState.loginState = 'UNAUTHORIZED'
  render(<App />)
  const linkElement = screen.getAllByText(/SaldoApp Login/i)
  expect(linkElement[0]).toBeInTheDocument()
})

test('Renders dashboard when logged in', () => {
  rootState.loginState = 'LOGGED_IN'
  render(
    <Router>
      <Route component={App} />
    </Router>
  )
  const linkElement = screen.getAllByText(/Saldolista/i)
  expect(linkElement[0]).toBeInTheDocument()
})
