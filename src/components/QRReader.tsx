import { QrCode, Camera, X } from 'lucide-react';
import { useState } from 'react';
import { useLiff } from '../contexts/LiffContext';

interface QRReaderProps {
  onClose: () => void;
  onResult: (result: string) => void;
}

export function QRReader({ onClose, onResult }: QRReaderProps) {
  const { liff, isInClient } = useLiff();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    if (!liff || !isInClient) {
      setError('QRコードスキャンはLINE内ブラウザでのみ利用可能です');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await liff.scanCodeV2();
      if (result) {
        onResult(result.value);
        onClose();
      }
    } catch (err) {
      console.error('QRスキャンエラー:', err);
      setError('QRコードの読み取りに失敗しました');
    } finally {
      setIsScanning(false);
    }
  };

  // モック環境での疑似スキャン
  const mockScan = () => {
    const mockResults = [
      'https://example.com',
      'Hello LIFF!',
      'QR Code Test Data',
      'https://line.me',
      'Mock QR Result: ' + new Date().toLocaleTimeString()
    ];
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    onResult(randomResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">QRコードリーダー</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-blue-50 rounded-full">
              <QrCode size={48} className="text-blue-500" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-gray-600">
              {isInClient 
                ? 'QRコードをスキャンしてください' 
                : '開発環境ではモックデータを返します'}
            </p>

            <button
              onClick={isInClient ? startScan : mockScan}
              disabled={isScanning}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={20} />
              {isScanning ? 'スキャン中...' : 'スキャン開始'}
            </button>
          </div>

          {!isInClient && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-700">
                実際のQRスキャン機能はLINE内ブラウザでのみ動作します
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}