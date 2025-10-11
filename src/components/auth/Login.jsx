import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../services/apiService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Por favor, ingresa un email válido');
      return;
    }
    
    // Limpiar errores previos
    setError('');
    setIsLoading(true);
    
    try {
      // Llamada a la API
      const response = await authService.login({
        email: email,
        password: password
      });
      
      console.log('Login exitoso:', response);
      
      // Aquí puedes manejar la respuesta exitosa:
      // - Guardar el token en localStorage
      // - Actualizar el estado de autenticación global
      // - Redirigir al dashboard
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      alert('¡Inicio de sesión exitoso!');
      
      // Limpiar formulario
      setEmail('');
      setPassword('');
      
    } catch (error) {
      console.error('Error en el login:', error);
      
      // Manejo de errores específicos
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            setError('Datos inválidos. Verifica tu email y contraseña.');
            break;
          case 401:
            setError('Email o contraseña incorrectos.');
            break;
          case 403:
            setError('Acceso denegado. Contacta al administrador.');
            break;
          case 404:
            setError('Usuario no encontrado.');
            break;
          case 429:
            setError('Demasiados intentos. Espera un momento e inténtalo de nuevo.');
            break;
          case 500:
            setError('Error interno del servidor. Inténtalo más tarde.');
            break;
          default:
            setError(data.message || 'Error en el inicio de sesión.');
        }
      } else if (error.request) {
        setError('Error de conexión. Verifica tu conexión a internet.');
      } else {
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full font-sans">
      <motion.div
        className="bg-white/90 rounded-2xl shadow-2xl p-10 w-96 max-w-[90%] backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-gray-800 text-center mb-8 font-semibold text-2xl">Iniciar Sesión</h1>
        
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full p-4 border-none rounded-xl bg-white/80 shadow-md text-base transition-all duration-300 ease-in-out outline-none focus:shadow-lg focus:shadow-blue-400/40 focus:-translate-y-0.5"
            />
            <label 
              className={`absolute left-4 pointer-events-none transition-all duration-300 ease-in-out rounded ${
                emailFocused || email.length > 0 
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full p-4 border-none rounded-xl bg-white/80 shadow-md text-base transition-all duration-300 ease-in-out outline-none focus:shadow-lg focus:shadow-blue-400/40 focus:-translate-y-0.5"
            />
            <label 
              className={`absolute left-4 pointer-events-none transition-all duration-300 ease-in-out rounded ${
                passwordFocused || password.length > 0 
                  ? '-top-3 text-xs text-blue-500 bg-white/90 px-1' 
                  : 'top-4 text-base text-gray-500'
              }`}
            >
              Contraseña
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
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </motion.button>
          
          <a className="text-right mt-4 text-blue-500 no-underline text-sm cursor-pointer hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          ¿No tienes una cuenta?{' '}
          <a className="text-blue-500 no-underline font-semibold cursor-pointer hover:underline">
            Regístrate
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;