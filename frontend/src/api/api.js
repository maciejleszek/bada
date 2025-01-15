export const fetchUsers = async () => {
  const response = await fetch('http://127.0.0.1:5000/api/users/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.json();
};
