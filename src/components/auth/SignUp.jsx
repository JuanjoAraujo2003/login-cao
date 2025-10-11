import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../services/apiService';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setFocused(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field) => {
    setFocused(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones del lado cliente
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Por favor, ingresa un email válido');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    // Limpiar errores previos
    setError('');
    setIsLoading(true);
    
    try {
      // Llamada a la API
      const response = await authService.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registro exitoso:', response);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Opcional: Redirigir al usuario o hacer login automático
      // navigate('/login') o similar
      
    } catch (error) {
      console.error('Error en el registro:', error);
      
      // Manejo de errores específicos
      if (error.response) {
        // El servidor respondió con un error
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            setError(data.message || 'Datos inválidos. Por favor, verifica la información.');
            break;
          case 409:
            setError('El email ya está registrado. Intenta con otro email.');
            break;
          case 422:
            setError('Error de validación. Verifica que todos los campos sean correctos.');
            break;
          case 500:
            setError('Error interno del servidor. Inténtalo más tarde.');
            break;
          default:
            setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
        }
      } else if (error.request) {
        // Error de red
        setError('Error de conexión. Verifica tu conexión a internet.');
      } else {
        // Error desconocido
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full font-sans">
      <motion.div
        className="bg-white/90 rounded-2xl shadow-2xl p-10 w-[450px] max-w-[90%] backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-gray-800 text-center mb-8 font-semibold text-2xl">Crear Cuenta</h1>
        
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
              className="w-full p-4 border-none rounded-xl bg-white/80 shadow-md text-base transition-all duration-300 ease-in-out outline-none focus:shadow-lg focus:shadow-blue-400/40 focus:-translate-y-0.5"
            />
            <label 
              className={`absolute left-4 pointer-events-none transition-all duration-300 ease-in-out rounded ${
                focused.name || formData.name.length > 0 
                  ? '-top-3 text-xs text-blue-500 bg-white/90 px-1' 
                  : 'top-4 text-base text-gray-500'
              }`}
            >
              Nombre
            </label>
          </div>
          
          <div className="relative mb-6">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              className="w-full p-4 border-none rounded-xl bg-white/80 shadow-md text-base transition-all duration-300 ease-in-out outline-none focus:shadow-lg focus:shadow-blue-400/40 focus:-translate-y-0.5"
            />
            <label 
              className={`absolute left-4 pointer-events-none transition-all duration-300 ease-in-out rounded ${
                focused.email || formData.email.length > 0 
                  ? '-top-3 text-xs text-blue-500 bg-white/90 px-1' 
                  : 'top-4 text-base text-gray-500'
              }`}
            >
              Email
            </label>
          </div>
          
          <div className="relative mb-6">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              className="w-full p-4 border-none rounded-xl bg-white/80 shadow-md text-base transition-all duration-300 ease-in-out outline-none focus:shadow-lg focus:shadow-blue-400/40 focus:-translate-y-0.5"
            />
            <label 
              className={`absolute left-4 pointer-events-none transition-all duration-300 ease-in-out rounded ${
                focused.password || formData.password.length > 0 
                  ? '-top-3 text-xs text-blue-500 bg-white/90 px-1' 
                  : 'top-4 text-base text-gray-500'
              }`}
            >
              Contraseña
            </label>
          </div>
          
          <div className="relative mb-6">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
              className="w-full p-4 border-none rounded-xl bg-white/80 shadow-md text-base transition-all duration-300 ease-in-out outline-none focus:shadow-lg focus:shadow-blue-400/40 focus:-translate-y-0.5"
            />
            <label 
              className={`absolute left-4 pointer-events-none transition-all duration-300 ease-in-out rounded ${
                focused.confirmPassword || formData.confirmPassword.length > 0 
                  ? '-top-3 text-xs text-blue-500 bg-white/90 px-1' 
                  : 'top-4 text-base text-gray-500'
              }`}
            >
              Confirmar Contraseña
            </label>
          </div>
          
          {error && (
            <motion.div
              className="text-red-500 text-sm mt-1 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              className="text-green-600 text-sm mt-4 text-center p-3 bg-green-100/50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              ¡Cuenta creada exitosamente!
            </motion.div>
          )}
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none rounded-xl p-4 text-lg font-semibold mt-3 transition-all duration-300 ease-in-out relative ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/40'
            }`}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block mr-2" />
            )}
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </motion.button>
        </form>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <a className="text-blue-500 no-underline font-semibold cursor-pointer hover:underline">
            Iniciar Sesión
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;