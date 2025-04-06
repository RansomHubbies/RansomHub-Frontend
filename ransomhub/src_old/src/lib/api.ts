import { group } from "console";
import {getCSRFTokenFromCookie} from "../app/api"

const API_URL = 'http://127.0.0.1:8000/api/'
export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const csrfToken = getCSRFTokenFromCookie();
    if (!token) return { error: "User is not authenticated." };
    const response = await fetch(`${API_URL}users/get_users`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
      },
      credentials: "include"
  });
    if (!response.ok) {
      console.log("error:", response.json())
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
    const token = localStorage.getItem("access_token");
    const csrfToken = getCSRFTokenFromCookie();
    if (!token) return { error: "User is not authenticated." };
    const response = await fetch(`${API_URL}chat/create_group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        name: groupName,
        members: members
      }),
      credentials: "include"
      
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
export const fetchGroups = async (username: string | null) => {
  try {
    console.log("username:", username);
    if (!username){
      return []
    }
    const token = localStorage.getItem("access_token");
    const csrfToken = getCSRFTokenFromCookie();
    if (!token) return { error: "User is not authenticated." };
    const response = await fetch(`${API_URL}chat/get_groups?user=${username}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
      },
      credentials: "include"
  });
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const sendMessage = async (sender: string, recipient: string, message: string) => {
  try {
    // console.log("Sender in api:", sender);
    // console.log("Recipient:", recipient);
    // console.log("Message:", message);
    const token = localStorage.getItem("access_token");
    const csrfToken = getCSRFTokenFromCookie();
    const response = await fetch(`${API_URL}chat/send_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
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
    const token = localStorage.getItem("access_token");
    const csrfToken = getCSRFTokenFromCookie();
    const response = await fetch(`${API_URL}chat/send_group_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        sender: sender,
        group: group,
        message: message,
      }),
      credentials: "include",
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
export const addGroupMembers = async (groupUsername: string, memberUsernames: string[]) => {
  try {
    const token = localStorage.getItem("access_token");
    const csrfToken = getCSRFTokenFromCookie();
    const response = await fetch(`${API_URL}chat/add_group_members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        group_username: groupUsername,
        members_usernames: memberUsernames,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to add group members");
    }

    return await response.json();
  } catch (error) {
    console.error("API error adding group members:", error);
    throw error;
  }
};

