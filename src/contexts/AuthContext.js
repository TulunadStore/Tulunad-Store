// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper function to normalize phone numbers by removing all non-digit characters
const normalizePhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber !== 'string') {
    return ''; // Return empty string or handle as an error case
  }
  return phoneNumber.replace(/\D/g, ''); // Removes all non-digit characters
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = localStorage.getItem('tulunadUsers');
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Error parsing stored users from localStorage:", error);
      return [];
    }
  });

  // Effect to load the last logged-in user from local storage
  useEffect(() => {
    const lastLoggedInUserIdentifier = localStorage.getItem('lastLoggedInTulunadUser');
    if (lastLoggedInUserIdentifier) {
      const user = users.find(u => {
        // If the stored identifier is an email, check against user's email
        if (u.email && u.email === lastLoggedInUserIdentifier) {
          return true;
        }
        // If the stored identifier might be a phone number, normalize both for comparison
        if (u.phone) {
          const normalizedStoredPhone = normalizePhoneNumber(u.phone);
          const normalizedLastLoggedInIdentifier = normalizePhoneNumber(lastLoggedInUserIdentifier);
          return normalizedStoredPhone === normalizedLastLoggedInIdentifier;
        }
        return false;
      });
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    }
  }, [users]); // Re-run when 'users' state changes

  // Effect to save users to local storage whenever 'users' state changes
  useEffect(() => {
    // We only store the last 10 users to prevent local storage from growing too large
    localStorage.setItem('tulunadUsers', JSON.stringify(users.slice(-10)));
  }, [users]);

  // Handles user registration
  const signup = ({ email, phone, password, firstName, lastName }) => {
    // Normalize phone number if provided
    const normalizedPhone = phone ? normalizePhoneNumber(phone) : null;

    // Check if email is already registered
    if (email && users.some(user => user.email === email)) {
      toast.error('Email already registered.');
      return { success: false, message: 'Email already registered.' };
    }

    // Check if normalized phone number is already registered
    if (normalizedPhone && users.some(user => user.phone === normalizedPhone)) {
      toast.error('Phone number already registered.');
      return { success: false, message: 'Phone number already registered.' };
    }

    // Create a new user object
    const newUser = {
      id: Date.now(), // Unique ID for the user
      firstName,
      lastName,
      email,
      phone: normalizedPhone, // Store the normalized phone number
      password, // IMPORTANT: In a real application, you MUST hash this password before storing!
      createdAt: new Date().toISOString(),
      notificationSettings: {  // Default notification settings
        emailNotifications: true,
        pushNotifications: true,
        orderUpdates: true,
        promotions: true,
        priceDrops: true
      },
      addresses: []  // Initialize empty addresses array
    };

    // Add the new user to the users array
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser); // Set the new user as the current user
    setIsAuthenticated(true); // Set authentication status to true
    // Remember the last logged-in identifier (email or normalized phone)
    localStorage.setItem('lastLoggedInTulunadUser', email || normalizedPhone);
    toast.success('Signup successful! Welcome to Tulunad Store!');
    return { success: true, message: 'Signup successful!' };
  };

  // Handles user login
  const login = ({ email, phone, password }) => {
    // Normalize phone number if provided for login attempt
    const normalizedPhone = phone ? normalizePhoneNumber(phone) : null;

    console.log("--- Attempting Login ---");
    console.log("Input Credentials: ", { email, phone, password });
    console.log("Normalized Phone for comparison: ", normalizedPhone);

    // Find the user based on email or normalized phone number and password
    const user = users.find(u => {
      // Log each user being checked during phone login attempt for detailed debugging
      if (normalizedPhone) {
        console.log(`Checking user (ID: ${u.id}): Email: ${u.email}, Stored Phone: ${u.phone}, Stored Password: ${u.password}`);
      }

      // Check for email login
      const isEmailMatch = email && u.email === email && u.password === password;
      // Check for phone login (using normalized phone numbers for comparison)
      // Ensure u.phone exists before normalizing it
      const isPhoneMatch = normalizedPhone && u.phone && normalizePhoneNumber(u.phone) === normalizedPhone && u.password === password;

      return isEmailMatch || isPhoneMatch;
    });

    if (user) {
      console.log("User found:", user);
      setCurrentUser(user); // Set the found user as the current user
      setIsAuthenticated(true); // Set authentication status to true
      // Remember the last logged-in identifier (email or normalized phone)
      localStorage.setItem('lastLoggedInTulunadUser', email || normalizedPhone);
      toast.success('Login successful!');
      return { success: true, message: 'Login successful!' };
    } else {
      console.log("Login failed: User not found or credentials mismatch.");
      toast.error('Invalid credentials.'); // Show error if user not found or password incorrect
      return { success: false, message: 'Invalid credentials.' };
    }
  };

  // Handles user logout
  const logout = () => {
    setCurrentUser(null); // Clear current user
    setIsAuthenticated(false); // Set authentication status to false
    localStorage.removeItem('lastLoggedInTulunadUser'); // Clear last logged-in user from storage
    toast('Logged out successfully!', { icon: '👋' }); // Show logout toast
  };

  // Handles updating user profile data
  const updateProfile = (updatedData) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData }; // Merge existing and updated data
      setCurrentUser(updatedUser); // Update current user state
      // Update the user in the global users array
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
      );
      toast.success('Profile updated successfully!');
      return { success: true };
    }
    toast.error('Could not update profile.');
    return { success: false };
  };

  // Handles updating user notification settings
  const updateNotificationSettings = (newSettings) => {
    if (!currentUser) {
      toast.error('No user logged in');
      return { success: false, message: 'No user logged in' };
    }

    try {
      const updatedUser = {
        ...currentUser,
        notificationSettings: newSettings
      };

      setCurrentUser(updatedUser); // Update current user state
      // Update the user in the global users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      toast.success('Notification settings updated!');
      return { success: true };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
      return { success: false, message: error.message };
    }
  };

  // Handles updating user addresses (add, update, delete, set default)
  const updateUserAddresses = (addressData, action) => {
    if (!currentUser) {
      toast.error('No user logged in');
      return { success: false, message: 'No user logged in' };
    }

    try {
      let updatedAddresses = [...(currentUser.addresses || [])]; // Get existing addresses

      if (action === 'add') {
        updatedAddresses.push(addressData); // Add new address
      } else if (action === 'update') {
        // Update an existing address
        updatedAddresses = updatedAddresses.map(addr =>
          addr.id === addressData.id ? addressData : addr
        );
      } else if (action === 'delete') {
        // Delete an address
        updatedAddresses = updatedAddresses.filter(addr => addr.id !== addressData);
      } else if (action === 'setDefault') {
        // Set an address as default, unsetting others
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressData // addressData is the ID of the address to set as default
        }));
      }

      const updatedUser = { ...currentUser, addresses: updatedAddresses }; // Create updated user object

      setCurrentUser(updatedUser); // Update current user state
      // Update the user in the global users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      // Provide specific success messages based on action
      let successMessage = 'Address updated';
      if (action === 'add') successMessage = 'Address added';
      if (action === 'delete') successMessage = 'Address deleted';
      if (action === 'setDefault') successMessage = 'Default address updated';

      toast.success(successMessage);
      return { success: true };
    } catch (error) {
      console.error('Error updating addresses:', error);
      toast.error('Failed to update address');
      return { success: false, message: error.message };
    }
  };

  // Context value provided to children
  const value = {
    currentUser,
    isAuthenticated,
    signup,
    login,
    logout,
    updateProfile,
    updateNotificationSettings,
    updateUserAddresses
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
