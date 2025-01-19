const API_BASE_URL = 'http://127.0.0.1:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred'
    }));
    throw new Error(error.message || 'Network response was not ok');
  }
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

export const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
};

export const fetchEvents = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
};

export const fetchResults = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/results/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
};

// // Results
// export const fetchAllResults = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     throw new Error('No authentication token found');
//   }

//   const response = await fetch(`${API_BASE_URL}/results/`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     credentials: 'include'
//   });
//   return handleResponse(response);
// };

// export const fetchUserResults = async (userId) => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     throw new Error('No authentication token found');
//   }

//   const response = await fetch(`${API_BASE_URL}/results/athlete/${userId}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     credentials: 'include'
//   });
//   return handleResponse(response);
// };
// // 

