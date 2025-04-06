export const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/get_users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  export const createGroup = async (groupName: string, members: string[]) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/create_group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          members: members
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };
  export const fetchGroups = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/get_groups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  };
  // export const sendMessage = async (sender: string, recipient: string, message: string) => {
  //   // Ensure users are loaded
  //   if (validUsers.length === 0) await loadUsers();
  
  //   // Validate users exist
  //   const senderExists = validUsers.some(user => user.username === sender);
  //   const recipientExists = validUsers.some(user => user.username === recipient);
  
  //   if (!senderExists || !recipientExists) {
  //     throw new Error('Invalid sender or recipient');
  //   }
  
  //   const response = await fetch('http://127.0.0.1:8000/api/chat/send_message', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`
  //     },
  //     body: JSON.stringify({
  //       sender,
  //       recipient,
  //       message,
  //       timestamp: new Date().toISOString()
  //     })
  //   });
  
  //   return await response.json();
  // };