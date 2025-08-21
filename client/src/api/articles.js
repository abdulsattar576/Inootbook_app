import { http } from './http';

export const articlesApi = {
  list: (params) => http.get('/articles', { params }).then((r) => r.data),
  get: (id) => http.get(`/articles/${id}`).then((r) => r.data),
  create: (data) => http.post('/articles', data).then((r) => r.data),
  update: (id, data) => http.put(`/articles/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/articles/${id}`).then((r) => r.data),
  like: (id) => http.post(`/articles/${id}/like`).then((r) => r.data),
  comment: (id, content) => http.post(`/articles/${id}/comment`, { content }).then((r) => r.data),
  analytics: () => http.get('/articles/analytics/summary').then((r) => r.data),
};

