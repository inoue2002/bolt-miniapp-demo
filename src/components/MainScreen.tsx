import { useState } from 'react';
import { QrCode, MessageCircle, CreditCard } from 'lucide-react';
import { useLiff } from '../contexts/LiffContext';
import { QRReader } from './QRReader';
import { MemberCard } from './MemberCard';

export function MainScreen() {
  const { isLoggedIn, isInClient, sendMessage } = useLiff();
  const [showQRReader, setShowQRReader] = useState(false);
  const [showMemberCard, setShowMemberCard] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleQRResult = (result: string) => {
    setQrResult(result);
    setShowResult(true);
    setTimeout(() => setShowResult(false), 5000); // 5秒後に自動で消す
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">メインスクリーン</h2>
          <p className="text-gray-600">
            ログインしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      {/* QR結果表示 */}
      {showResult && qrResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">QRコード読み取り結果</h3>
          <p className="text-green-700 text-sm break-all">{qrResult}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">LIFF デモ機能</h2>
        <p className="text-gray-600 mb-6">
          LIFFの様々な機能をお試しください。
        </p>

        <div className="space-y-3">
          {/* QRコードリーダー */}
          <button
            onClick={() => setShowQRReader(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <QrCode size={20} />
            <span className="font-medium">QRコードリーダー</span>
            {!isInClient && (
              <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                MOCK
              </span>
            )}
          </button>

          {/* メッセージ送信 */}
          {isInClient && (
            <button
              onClick={sendMessage}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              <MessageCircle size={20} />
              <span className="font-medium">メッセージ送信</span>
            </button>
          )}

          {/* 会員証表示 */}
          <button
            onClick={() => setShowMemberCard(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
          >
            <CreditCard size={20} />
            <span className="font-medium">デジタル会員証</span>
          </button>
        </div>
      </div>

      {/* QRリーダーモーダル */}
      {showQRReader && (
        <QRReader
          onClose={() => setShowQRReader(false)}
          onResult={handleQRResult}
        />
      )}

      {/* 会員証モーダル */}
      {showMemberCard && (
        <MemberCard onClose={() => setShowMemberCard(false)} />
      )}
    </div>
  );
}