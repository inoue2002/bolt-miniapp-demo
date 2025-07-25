import { X, Download, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useLiff } from '../contexts/LiffContext';

interface MemberCardProps {
  onClose: () => void;
}

export function MemberCard({ onClose }: MemberCardProps) {
  const { profile, isInClient, liff } = useLiff();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      if (!profile?.userId || !canvasRef.current) return;

      try {
        const canvas = canvasRef.current;
        await QRCode.toCanvas(canvas, profile.userId, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        // データURLとして保存（共有用）
        const dataUrl = canvas.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('QRコード生成エラー:', error);
      }
    };

    generateQR();
  }, [profile?.userId]);

  const shareCard = async () => {
    if (!isInClient || !liff) return;

    try {
      await liff.shareTargetPicker([
        {
          type: 'text',
          text: `私の会員証です！\nユーザーID: ${profile?.userId}`
        }
      ]);
    } catch (error) {
      console.error('共有エラー:', error);
    }
  };

  const downloadCard = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `member-card-${profile?.displayName || 'user'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">デジタル会員証</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 会員証カード */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={profile.pictureUrl || '/user-icon.svg'}
              alt="プロフィール画像"
              className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="flex-1">
              <h4 className="text-lg font-semibold">{profile.displayName}</h4>
              <p className="text-blue-100 text-sm">会員</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-center space-y-3">
              <div>
                <p className="text-xs text-blue-100 mb-1">ユーザーID</p>
                <p className="font-mono text-sm break-all">{profile.userId}</p>
              </div>
              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-2">
                  <canvas
                    ref={canvasRef}
                    className="block"
                    style={{ width: '80px', height: '80px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          {isInClient && (
            <button
              onClick={shareCard}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              <Share2 size={18} />
              会員証を共有
            </button>
          )}

          <button
            onClick={downloadCard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            <Download size={18} />
            画像として保存
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            このQRコードにはあなたのユーザーIDが含まれています
          </p>
        </div>
      </div>
    </div>
  );
}