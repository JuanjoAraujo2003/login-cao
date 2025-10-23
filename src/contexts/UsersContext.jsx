import React, { createContext, useContext, useState } from 'react';

const UsersContext = createContext();

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'admin@udla.edu.ec',
      cedula: '1234567890',
      name: 'Administrador',
      status: 'active',
      role: 'admin',
      createdAt: '2025-10-15',
      source: 'manual'
    },
    {
      id: 2,
      email: 'freddy.perez.ramirez@udla.edu.ec',
      cedula: '0987654321',
      name: 'Juan Pérez',
      status: 'active',
      role: 'profesor',
      createdAt: '2025-10-10',
      source: 'manual'
    },
    {
      id: 3,
      email: 'roberto.aguilar@udla.edu.ec',
      cedula: '1122334455',
      name: 'Roberto Aguilar',
      status: 'inactive',
      role: 'coordinator',
      createdAt: '2025-10-20',
      source: 'manual'
    }
  ]);

  const addBulkUsers = (newUsers) => {
    const usersToAdd = newUsers.map((user, index) => ({
      id: Date.now() + index, 
      email: user.email,
      cedula: user.cedula,
      name: extractNameFromEmail(user.email),
      status: 'active',
      role: 'student',
      createdAt: new Date().toISOString().split('T')[0],
      source: 'bulk-upload'
    }));

    setUsers(prevUsers => [...prevUsers, ...usersToAdd]);
    return usersToAdd;
  };

  const updateUser = (userId, updates) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const deleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const toggleUserStatus = (userId) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  // Helper function to extract name from email
  const extractNameFromEmail = (email) => {
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const value = {
    users,
    addBulkUsers,
    updateUser,
    deleteUser,
    toggleUserStatus
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};