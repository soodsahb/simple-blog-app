const API_URL = import.meta.env.VITE_API_URL;


export const fetchData = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const api = {
  
  register: (userData) => 
    fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) => 
    fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),


  getPosts: () => 
    fetchData('/posts'),

  getPost: (id) => 
    fetchData(`/posts/${id}`),

  createPost: (postData) => 
    fetchData('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  updatePost: (id, postData) => 
    fetchData(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  deletePost: (id) => 
    fetchData(`/posts/${id}`, {
      method: 'DELETE',
    }),

  
  toggleLike: (postId) => 
    fetchData(`/posts/${postId}/like`, {
      method: 'POST',
    }),

  addComment: (postId, content) => 
    fetchData(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  deleteComment: (postId, commentId) => 
    fetchData(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    }),
};
