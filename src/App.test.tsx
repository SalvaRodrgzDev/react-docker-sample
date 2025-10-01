import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'

test('renders heading and increments counter', async () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument()

  const button = screen.getByRole('button', { name: /count is/i })
  await userEvent.click(button)
  expect(button).toHaveTextContent(/count is\s*1/i)
})
