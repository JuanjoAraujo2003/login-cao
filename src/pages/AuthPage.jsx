import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import bgImage from '../assets/JAG-STUDIO-UDLA-CONTRACT-0114-WEB-RGB.jpg';


const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-start pt-[10vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})`}}
    >
      <h1 className="text-white text-4xl mb-8 drop-shadow-lg font-semibold tracking-wide">
        Centro de Atencion Odontologica UDLA
      </h1>
      
      <div className="flex mb-8 bg-white/20 rounded-full p-1.5 shadow-lg relative z-10 w-[350px] justify-center">
        <motion.button
          className={`px-8 py-3 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 relative z-2 focus:outline-none ${
            activeTab === 'login' 
              ? 'bg-white text-blue-500' 
              : 'bg-transparent text-white'
          }`}
          onClick={() => setActiveTab('login')}
          whileHover={{ scale: activeTab !== 'login' ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
        >
          Iniciar Sesión
        </motion.button>
        <motion.button
          className={`px-8 py-3 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 relative z-2 focus:outline-none ${
            activeTab === 'signup' 
              ? 'bg-white text-blue-500' 
              : 'bg-transparent text-white'
          }`}
          onClick={() => setActiveTab('signup')}
          whileHover={{ scale: activeTab !== 'signup' ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
        >
          Registrarse
        </motion.button>
      </div>
      
      <div className="w-full flex justify-center items-center">
        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Login />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <SignUp />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;