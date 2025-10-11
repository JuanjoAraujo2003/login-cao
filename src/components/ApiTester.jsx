import React, { useState } from 'react';
import { authService } from '../services/apiService';

const ApiTester = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testGetUsers = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔄 Iniciando prueba de getUsers...');
      console.log('📡 URL de la API:', import.meta.env.VITE_APP_CAO_API_DES_URL);
      
      const startTime = Date.now();
      const response = await authService.getUsers();
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('✅ Respuesta exitosa:', response);
      console.log(`⏱️ Tiempo de respuesta: ${duration}ms`);

      setResult({
        success: true,
        data: response,
        duration: duration,
        timestamp: new Date().toLocaleString()
      });

    } catch (error) {
      console.error('❌ Error en la prueba:', error);
      
      const errorInfo = {
        success: false,
        timestamp: new Date().toLocaleString()
      };

      if (error.response) {
        // Error de respuesta del servidor
        errorInfo.status = error.response.status;
        errorInfo.statusText = error.response.statusText;
        errorInfo.data = error.response.data;
        errorInfo.headers = error.response.headers;
      } else if (error.request) {
        // Error de red/timeout
        errorInfo.type = 'Network Error';
        errorInfo.message = 'No se pudo conectar con el servidor';
      } else {
        // Error de configuración
        errorInfo.type = 'Configuration Error';
        errorInfo.message = error.message;
      }

      setError(errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-5 max-w-4xl mx-auto font-sans">
      <h2 className="text-gray-800 mb-5 text-2xl font-semibold">🧪 Probador de API - getUsers</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
        <h4 className="text-blue-700 mb-2 font-semibold text-lg">Información de la prueba</h4>
        <p className="text-gray-700 my-1 text-sm"><strong>Endpoint:</strong> /api/User/obtenerUsuarios</p>
        <p className="text-gray-700 my-1 text-sm"><strong>Método:</strong> GET</p>
        <p className="text-gray-700 my-1 text-sm"><strong>URL Base:</strong> {import.meta.env.VITE_APP_CAO_API_DES_URL || 'No configurada'}</p>
        <p className="text-gray-700 my-1 text-sm"><strong>URL Completa:</strong> {import.meta.env.VITE_APP_CAO_API_DES_URL}/api/User/obtenerUsuarios</p>
      </div>
    
      <div>
        <button 
          onClick={testGetUsers} 
          disabled={isLoading}
          className={`bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none rounded-lg px-6 py-3 text-base font-semibold mr-2 mb-2 transition-all duration-300 ${
            isLoading 
              ? 'opacity-70 cursor-not-allowed' 
              : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/40'
          }`}
        >
          {isLoading && (
            <div className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
          )}
          {isLoading ? 'Probando...' : '🚀 Probar getUsers'}
        </button>
        
        <button 
          onClick={clearResults} 
          disabled={isLoading}
          className={`bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none rounded-lg px-6 py-3 text-base font-semibold mr-2 mb-2 transition-all duration-300 ${
            isLoading 
              ? 'opacity-70 cursor-not-allowed' 
              : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/40'
          }`}
        >
          🗑️ Limpiar resultados
        </button>
      </div>

      {isLoading && (
        <div className="mt-5 p-4 rounded-lg bg-green-50 border border-green-200">
          <h3 className="text-green-700 mb-2 text-base font-semibold">⏳ Ejecutando prueba...</h3>
          <p className="text-gray-700 my-1 text-sm">Esperando respuesta del servidor...</p>
        </div>
      )}

      {result && (
        <div className="mt-5 p-4 rounded-lg bg-green-50 border border-green-200">
          <h3 className="text-green-700 mb-2 text-base font-semibold">
            ✅ Prueba exitosa
            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-500 text-white ml-2">
              SUCCESS
            </span>
          </h3>
          <p className="text-gray-700 my-1 text-sm"><strong>Timestamp:</strong> {result.timestamp}</p>
          <p className="text-gray-700 my-1 text-sm"><strong>Tiempo de respuesta:</strong> {result.duration}ms</p>
          <p className="text-gray-700 my-1 text-sm"><strong>Datos recibidos:</strong></p>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs my-2 whitespace-pre-wrap break-words">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200">
          <h3 className="text-red-700 mb-2 text-base font-semibold">
            ❌ Error en la prueba
            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-red-500 text-white ml-2">
              ERROR
            </span>
          </h3>
          <p className="text-gray-700 my-1 text-sm"><strong>Timestamp:</strong> {error.timestamp}</p>
          
          {error.status && (
            <>
              <p className="text-gray-700 my-1 text-sm"><strong>Código de estado:</strong> {error.status} - {error.statusText}</p>
              <p className="text-gray-700 my-1 text-sm"><strong>Respuesta del servidor:</strong></p>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs my-2 whitespace-pre-wrap break-words">
                {JSON.stringify(error.data, null, 2)}
              </pre>
            </>
          )}
          
          {error.type && (
            <>
              <p className="text-gray-700 my-1 text-sm"><strong>Tipo de error:</strong> {error.type}</p>
              <p className="text-gray-700 my-1 text-sm"><strong>Mensaje:</strong> {error.message}</p>
            </>
          )}
          
          <p className="text-gray-700 my-1 text-sm"><strong>Detalles completos del error:</strong></p>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs my-2 whitespace-pre-wrap break-words">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTester;