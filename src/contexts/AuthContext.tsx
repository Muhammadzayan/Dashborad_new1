import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './UserRoleContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  agentId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  updateUserProfile: (profileData: Partial<Pick<User, 'name' | 'email' | 'department' | 'agentId'>>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  getAllUsers: () => User[];
  deleteUser: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Default demo users
const defaultUsers = [
  {
    id: '1',
    name: 'Muhammad Zayan',
    email: 'admin@igilife.com',
    role: 'admin' as UserRole,
    department: 'Administration',
    agentId: 'ADM001',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    email: 'agent@igilife.com',
    role: 'agent' as UserRole,
    department: 'Sales',
    agentId: 'AGT001',
    password: 'password123'
  },
  {
    id: '3',
    name: 'Ahmed Ali',
    email: 'client@igilife.com',
    role: 'user' as UserRole,
    department: 'Client',
    password: 'password123'
  }
];

// User storage with passwords
interface UserWithPassword extends User {
  password: string;
}

// Initialize users in localStorage if not exists
const initializeUsers = (): UserWithPassword[] => {
  const storedUsers = localStorage.getItem('igilife_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  } else {
    localStorage.setItem('igilife_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
};

// Get all users from localStorage
const getStoredUsers = (): UserWithPassword[] => {
  const storedUsers = localStorage.getItem('igilife_users');
  return storedUsers ? JSON.parse(storedUsers) : defaultUsers;
};

// Save users to localStorage
const saveUsers = (users: UserWithPassword[]): void => {
  localStorage.setItem('igilife_users', JSON.stringify(users));
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize users on first load
  useState(() => initializeUsers());

  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser && foundUser.password === password) {
      // Remove password from user object before storing in context
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Also update the user in the stored users list
      const users = getStoredUsers();
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, role } : u
      );
      saveUsers(updatedUsers);
    }
  };

  const updateUserProfile = async (profileData: Partial<Pick<User, 'name' | 'email' | 'department' | 'agentId'>>): Promise<boolean> => {
    if (!user) return false;

    try {
      const users = getStoredUsers();

      // Check if email is being changed and if it already exists
      if (profileData.email && profileData.email !== user.email) {
        const emailExists = users.find(u => u.id !== user.id && u.email.toLowerCase() === profileData.email.toLowerCase());
        if (emailExists) {
          return false; // Email already exists
        }
      }

      // Update the user in the stored users list
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, ...profileData } : u
      );
      saveUsers(updatedUsers);

      // Update the current user in context and localStorage
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return false;
    }
  };

  const createUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const users = getStoredUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return false; // Email already exists
    }

    const newUser: UserWithPassword = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return true;
  };

  const getAllUsers = (): User[] => {
    const users = getStoredUsers();
    // Return users without passwords
    return users.map(({ password, ...user }) => user);
  };

  const deleteUser = (userId: string): boolean => {
    const users = getStoredUsers();
    const updatedUsers = users.filter(u => u.id !== userId);

    if (updatedUsers.length < users.length) {
      saveUsers(updatedUsers);

      // If the deleted user is currently logged in, log them out
      if (user && user.id === userId) {
        logout();
      }
      return true;
    }
    return false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUserRole,
    updateUserProfile,
    createUser,
    getAllUsers,
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
