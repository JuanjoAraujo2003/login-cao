import React from 'react';
import Login from '../components/auth/Login';
import bgImage from '../assets/JAG-STUDIO-UDLA-CONTRACT-0114-WEB-RGB.jpg';

const AuthPage = () => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-start pt-[10vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})`}}
    >
      <h1 className="text-white text-4xl mb-8 drop-shadow-lg font-semibold tracking-wide">
        Centro de Atencion Odontologica UDLA
      </h1>
      
      <div className="w-full flex justify-center items-center">
        <Login />
      </div>
    </div>
  );
};

export default AuthPage;