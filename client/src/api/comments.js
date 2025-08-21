import { http } from './http';

export const commentsApi = {
  remove: (id) => http.delete(`/comments/${id}`).then((r) => r.data),
};

