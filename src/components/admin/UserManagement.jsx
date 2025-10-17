import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  Plus,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActions, setShowActions] = useState(null);

  // Datos de ejemplo
  const mockUsers = [
    { id: 1, email: 'admin@udla.edu.ec', cedula: '1234567890', status: 'active', role: 'admin', createdAt: '2024-01-15' },
    { id: 2, email: 'doctor1@udla.edu.ec', cedula: '0987654321', status: 'active', role: 'doctor', createdAt: '2024-01-16' },
    { id: 3, email: 'secretaria@udla.edu.ec', cedula: '1122334455', status: 'inactive', role: 'secretary', createdAt: '2024-01-17' },
    { id: 4, email: 'estudiante1@udla.edu.ec', cedula: '5566778899', status: 'active', role: 'student', createdAt: '2024-01-18' },
    { id: 5, email: 'coordinador@udla.edu.ec', cedula: '9988776655', status: 'active', role: 'coordinator', createdAt: '2024-01-19' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUsers(mockUsers);
    setIsLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cedula.includes(searchTerm)
      );
    }

    // Filtrar por estado
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => user.status === selectedFilter);
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      doctor: 'bg-blue-100 text-blue-800',
      secretary: 'bg-green-100 text-green-800',
      student: 'bg-yellow-100 text-yellow-800',
      coordinator: 'bg-indigo-100 text-indigo-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Administrador',
      doctor: 'Doctor',
      secretary: 'Secretaria',
      student: 'Estudiante',
      coordinator: 'Coordinador'
    };
    return roles[role] || role;
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowActions(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            onClick={loadUsers}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </motion.button>
          
          <motion.button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </motion.button>
        </div>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-xl p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por email o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="all">Todos los usuarios</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total de Usuarios</p>
              <p className="text-3xl font-bold text-blue-900">{users.length}</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Usuarios Activos</p>
              <p className="text-3xl font-bold text-green-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Usuarios Inactivos</p>
              <p className="text-3xl font-bold text-red-900">
                {users.filter(u => u.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-red-500 rounded-full p-3">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabla de usuarios */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Cargando usuarios...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Usuario</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Rol</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Fecha de Registro</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500 font-mono">{user.cedula}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="relative">
                          <motion.button
                            onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreVertical className="h-5 w-5 text-gray-600" />
                          </motion.button>

                          <AnimatePresence>
                            {showActions === user.id && (
                              <motion.div
                                className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]"
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors duration-150"
                                >
                                  <Eye className="h-4 w-4 text-gray-600" />
                                  Ver detalles
                                </button>
                                <button
                                  onClick={() => {
                                    // Editar usuario
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors duration-150"
                                >
                                  <Edit className="h-4 w-4 text-gray-600" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => {
                                    toggleUserStatus(user.id);
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors duration-150"
                                >
                                  {user.status === 'active' ? (
                                    <>
                                      <UserX className="h-4 w-4 text-gray-600" />
                                      Desactivar
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 text-gray-600" />
                                      Activar
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left transition-colors duration-150 text-red-600 border-t border-gray-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
                <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modal de detalles (si selectedUser existe) */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detalles del Usuario</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cédula</label>
                  <p className="text-lg text-gray-900 font-mono">{selectedUser.cedula}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rol</label>
                  <p className="text-lg text-gray-900">{getRoleText(selectedUser.role)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <p className="text-lg text-gray-900">
                    {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                  <p className="text-lg text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-6 transition-colors duration-200"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;