import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UserManagement from '../components/admin/UserManagement';
import BulkUpload from '../components/admin/BulkUpload';
import { Users, Upload, UserPlus, Settings } from 'lucide-react';

const AdminPage = () => {
  const [activeModule, setActiveModule] = useState('users');

  const modules = [
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      icon: Users,
      description: 'Administrar usuarios del sistema',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bulk-upload',
      title: 'Carga Masiva',
      icon: Upload,
      description: 'Cargar usuarios desde Excel',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'create-user',
      title: 'Crear Usuario',
      icon: UserPlus,
      description: 'Agregar nuevo usuario',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: Settings,
      description: 'Configurar el sistema',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'users':
        return <UserManagement />;
      case 'bulk-upload':
        return <BulkUpload />;
      case 'create-user':
        return <div className="p-8 text-center text-gray-600">Módulo de crear usuario en desarrollo...</div>;
      case 'settings':
        return <div className="p-8 text-center text-gray-600">Módulo de configuración en desarrollo...</div>;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-lg border-b border-gray-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Centro de Atención Odontológica UDLA</p>
            </div>
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-semibold">Administrador</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Navigation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {modules.map((module, index) => {
            const IconComponent = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <motion.div
                key={module.id}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={() => setActiveModule(module.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className={`bg-gradient-to-br ${module.color} p-6 text-white h-full`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="h-8 w-8" />
                    {isActive && (
                      <motion.div
                        className="w-3 h-3 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm opacity-90">{module.description}</p>
                </div>
                
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"
                  whileHover={{ opacity: 0.1 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          key={activeModule}
        >
          {renderActiveModule()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;