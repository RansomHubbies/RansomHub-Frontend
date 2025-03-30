import { group } from "console";

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
// export async function sendMessage(sender: string, recipient: string, message: string) {
//   const response = await fetch("http://127.0.0.1:8000/api/chat/send_message", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       sender: sender,
//       recipient: recipient,
//       message: message,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to send message");
//   }

//   return await response.json();
// }
export const sendMessage = async (sender: string, recipient: string, message: string) => {
  try {
    console.log("Sender in api:", sender);
    console.log("Recipient:", recipient);
    console.log("Message:", message);
    const response = await fetch("http://127.0.0.1:8000/api/chat/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: sender,
        recipient: recipient,
        message: message,
      }),
    });
    console.log("Response status:", response);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("API error:", errorDetails);
      throw new Error("Failed to send message");
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const sendGroupMessage = async (sender: string, group: string, message: string) => {
  try {
    console.log("Sender in api:", sender);
    console.log("group:", group);
    console.log("Message:", message);
    const response = await fetch("http://127.0.0.1:8000/api/chat/send_group_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: sender,
        group: group,
        message: message,
      }),
    });
    console.log("Response status:", response);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("API error:", errorDetails);
      throw new Error("Failed to send message");
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
