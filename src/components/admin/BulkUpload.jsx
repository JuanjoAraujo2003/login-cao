import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useUsers } from '../../contexts/UsersContext';
import { 
  Upload, 
  FileSpreadsheet, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';

const BulkUpload = ({ onUploadSuccess }) => {
  const { addBulkUsers } = useUsers();
  const [uploadedData, setUploadedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [step, setStep] = useState('upload'); // upload, preview, results

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Validar estructura del Excel
          const validatedData = validateExcelData(jsonData);
          setUploadedData(validatedData.valid);
          setErrors(validatedData.errors);
          setPreviewData(validatedData.valid.slice(0, 10)); // Mostrar solo primeros 10
          setStep('preview');
        } catch (error) {
          setErrors([{ row: 0, message: 'Error al leer el archivo Excel' }]);
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.readAsBinaryString(file);
    }
  }, []);

  const validateExcelData = (data) => {
    const valid = [];
    const errors = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; 
      
      // Verificar que tenga las columnas correctas
      const email = row['correo'] || row['email'] || row['usuario'];
      const cedula = row['cedula'] || row['contraseña'] || row['password'];
      
      if (!email || !cedula) {
        errors.push({
          row: rowNumber,
          message: 'Faltan columnas requeridas (correo y cedula)'
        });
        return;
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push({
          row: rowNumber,
          message: `Email inválido: ${email}`
        });
        return;
      }
      
      // Validar cédula (solo números, mínimo 6 dígitos)
      if (!/^\d{6,}$/.test(cedula.toString())) {
        errors.push({
          row: rowNumber,
          message: `Cédula inválida: ${cedula} (debe ser solo números, mínimo 6 dígitos)`
        });
        return;
      }
      
      valid.push({
        email: email.toLowerCase().trim(),
        cedula: cedula.toString().trim(),
        row: rowNumber
      });
    });
    
    return { valid, errors };
  };

  const processUpload = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    try {
      // TODO: Integrar con backend - POST /api/admin/bulk-upload
      // const response = await fetch('/api/admin/bulk-upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ users: uploadedData })
      // });
      // const results = await response.json();
      
      // SIMULACIÓN - remover en producción
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Agregar usuarios al contexto (local state)
      const addedUsers = addBulkUsers(uploadedData);
      
      // Calcular resultados reales
      const results = {
        total: uploadedData.length,
        successful: addedUsers.length,
        failed: 0,
        duplicates: 0
      };
      
      setUploadResults(results);
      setStep('results');
    } catch (error) {
      setErrors([{ row: 0, message: 'Error al procesar la carga masiva' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      { correo: 'usuario1@example.com', cedula: '1234567890' },
      { correo: 'usuario2@example.com', cedula: '0987654321' }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'plantilla_usuarios.xlsx');
  };

  const resetUpload = () => {
    setUploadedData([]);
    setPreviewData([]);
    setErrors([]);
    setUploadResults(null);
    setStep('upload');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Upload className="h-8 w-8 text-green-600" />
            Carga Masiva de Usuarios
          </h2>
          <p className="text-gray-600 mt-2">Carga múltiples usuarios desde un archivo Excel</p>
        </div>
        
        <motion.button
          onClick={downloadTemplate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="h-5 w-5" />
          Descargar Plantilla
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Instrucciones</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <p className="font-medium mb-2">Formato del archivo Excel:</p>
                  <ul className="space-y-1">
                    <li>• Columna "correo": Email del usuario</li>
                    <li>• Columna "cedula": Cédula (será la contraseña)</li>
                    <li>• Solo números en la cédula (mín. 6 dígitos)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Formatos soportados:</p>
                  <ul className="space-y-1">
                    <li>• .xlsx (Excel 2007+)</li>
                    <li>• .xls (Excel 97-2003)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Zona de Drop */}
            <motion.div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-25'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input {...getInputProps()} />
              
              <motion.div
                className="flex flex-col items-center gap-4"
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <FileSpreadsheet className={`h-16 w-16 ${isDragActive ? 'text-green-500' : 'text-gray-400'}`} />
                
                {isDragActive ? (
                  <div>
                    <p className="text-xl font-semibold text-green-600">¡Suelta el archivo aquí!</p>
                    <p className="text-green-500">Procesaremos tu archivo Excel</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                      Arrastra tu archivo Excel aquí
                    </p>
                    <p className="text-gray-500 mb-4">o haz clic para seleccionar un archivo</p>
                    <motion.div 
                      className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block"
                      whileHover={{ backgroundColor: '#059669' }}
                    >
                      Seleccionar Archivo
                    </motion.div>
                  </div>
                )}
              </motion.div>
              
              {isProcessing && (
                <motion.div
                  className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-3 text-blue-600">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="text-lg font-semibold">Procesando archivo...</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-green-50 border border-green-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-900">{uploadedData.length}</p>
                      <p className="text-green-700">Usuarios válidos</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-900">{errors.length}</p>
                      <p className="text-red-700">Errores encontrados</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{uploadedData.length + errors.length}</p>
                      <p className="text-blue-700">Total procesados</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Errores */}
              {errors.length > 0 && (
                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Errores Encontrados
                  </h3>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-800 bg-red-100 rounded p-2">
                        Fila {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Preview de datos */}
              <motion.div 
                className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa (Primeros 10 registros)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Cédula</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Fila</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((user, index) => (
                        <motion.tr 
                          key={index}
                          className="border-b border-gray-200 hover:bg-white"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          <td className="py-2 px-4">{user.email}</td>
                          <td className="py-2 px-4 font-mono">{user.cedula}</td>
                          <td className="py-2 px-4 text-gray-500">{user.row}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Botones de acción */}
              <motion.div 
                className="flex gap-4 justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={resetUpload}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="h-5 w-5" />
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={processUpload}
                  disabled={uploadedData.length === 0}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: uploadedData.length > 0 ? 1.05 : 1 }}
                  whileTap={{ scale: uploadedData.length > 0 ? 0.95 : 1 }}
                >
                  <Upload className="h-5 w-5" />
                  Procesar {uploadedData.length} Usuarios
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              className="bg-blue-100 rounded-full p-8 mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-16 w-16 text-blue-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Procesando usuarios...</h3>
            <p className="text-gray-600 text-center max-w-md">
              Estamos creando {uploadedData.length} usuarios en el sistema. 
              Este proceso puede tomar unos momentos.
            </p>
            <motion.div 
              className="w-64 bg-gray-200 rounded-full h-2 mt-6"
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div 
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}

        {step === 'results' && uploadResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center py-8">
              <motion.div
                className="bg-green-100 rounded-full p-8 mx-auto w-fit mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-16 w-16 text-green-600" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">¡Carga Completada!</h3>
              <p className="text-gray-600 mb-8">El proceso de carga masiva ha finalizado exitosamente</p>

              {/* Resultados detallados */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-3xl font-bold text-blue-900">{uploadResults.total}</p>
                  <p className="text-blue-700">Total procesados</p>
                </motion.div>

                <motion.div 
                  className="bg-green-50 border border-green-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-3xl font-bold text-green-900">{uploadResults.successful}</p>
                  <p className="text-green-700">Exitosos</p>
                </motion.div>

                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-3xl font-bold text-red-900">{uploadResults.failed}</p>
                  <p className="text-red-700">Fallidos</p>
                </motion.div>

                <motion.div 
                  className="bg-orange-50 border border-orange-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-3xl font-bold text-orange-900">{uploadResults.duplicates}</p>
                  <p className="text-orange-700">Duplicados</p>
                </motion.div>
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={resetUpload}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Nueva Carga
                </motion.button>
                
                <motion.button
                  onClick={() => onUploadSuccess && onUploadSuccess()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Users className="h-5 w-5" />
                  Ver Usuarios
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkUpload;