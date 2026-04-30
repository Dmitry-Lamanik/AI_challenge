import type { PropsWithChildren, ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

export function renderWithQueryClient(ui: ReactElement) {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: PropsWithChildren) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  }
}
