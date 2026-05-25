import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import toast from 'react-hot-toast';

export function useQrCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao processar QR Code.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const gerarQrCode = useCallback(async (eventoId) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.qrcode.gerar(eventoId);
      setQrData(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const confirmarPresenca = useCallback(async (eventoId, token) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.qrcode.confirmar(eventoId, token);
      toast.success('Presenca confirmada!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const clearQrData = useCallback(() => setQrData(null), []);

  return { qrData, isLoading, error, gerarQrCode, confirmarPresenca, clearQrData };
}

export default useQrCode;
