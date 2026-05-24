import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for QR Code presence flows.
 *
 * Backend reference — backend/app/controllers/QrCodeController.py
 *   GET  /qrcode/eventos/{evento_id}/gerar           (credenciado)
 *      → { qr_code: string (base64 PNG), token: string, expiry: string }
 *   POST /qrcode/eventos/{evento_id}/confirmar?token=...  (aluno)
 *      → presença registrada (server resolves user from JWT)
 *
 * Server-side token expires in 30 seconds (see QrCodeService.gerar_qrcode),
 * so the professor view should re-fetch periodically while the QR is on screen.
 */
export function useQrCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Erro ao processar QR Code.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /**
   * GET /qrcode/eventos/{eventoId}/gerar
   * Returns { qr_code (base64 PNG), token, expiry }.
   * To render in <img>, prefix with `data:image/png;base64,`.
   */
  const gerarQrCode = useCallback(async (eventoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.qrcode.gerar(eventoId);
      setQrData(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * POST /qrcode/eventos/{eventoId}/confirmar?token=...
   *
   * @param {number} eventoId
   * @param {string} token  - The string read from the QR code by the scanner.
   */
  const confirmarPresenca = useCallback(async (eventoId, token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.qrcode.confirmar(eventoId, token);
      toast.success('Presença confirmada!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const clearQrData = useCallback(() => setQrData(null), []);

  return {
    qrData,
    isLoading,
    error,
    gerarQrCode,
    confirmarPresenca,
    clearQrData,
  };
}

export default useQrCode;
