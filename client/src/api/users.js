import { http } from './http';

export const usersApi = {
  list: () => http.get('/users').then((r) => r.data),
  count: () => http.get('/users/count').then((r) => r.data),
};

