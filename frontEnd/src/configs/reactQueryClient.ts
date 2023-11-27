import { QueryClient } from '@tanstack/react-query';

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default reactQueryClient;
