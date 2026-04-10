import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

const renderWithStore = (isAuthenticated = false) => {
  const store = configureStore({
    reducer: {
      auth: () => ({
        token: isAuthenticated ? 'mock-token' : null,
        user: isAuthenticated ? { id: 1, name: 'Martin' } : null,
      }),
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('ProtectedRoute', () => {
  it('renders protected content when authenticated', () => {
    renderWithStore(true)
    expect(screen.getByText(/protected content/i)).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    renderWithStore(false)
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})