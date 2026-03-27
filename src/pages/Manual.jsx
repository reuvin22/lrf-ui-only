import React from 'react';
import { Clock, MapPin, Calculator, Users, Car, FileText, Upload, Lock } from 'lucide-react';

function Manual() {
  const sections = [
    {
      icon: Clock,
      title: "入力方法",
      description: `「今日」画面でリアルタイムにセグメントを開始/終了するか、手動で開始時刻と終了時刻を指定してセグメントを追加できます。`
    },
    {
      icon: MapPin,
      title: "セグメント種類",
      description: `移動: 場所間の移動。現場: 担当現場での作業（割り当てられた現場を選択）。オフィス作業: 事務作業。`
    },
    {
      icon: Calculator,
      title: "残業計算",
      description: `8時間を超える場合は1.25倍の計算。休憩時間は総勤務時間に応じて自動で差し引かれます。`
    },
    {
      icon: Users,
      title: "人日計算",
      description: `その日に現場セグメントがある場合、その現場に対して1人日としてカウントされます。`
    },
    {
      icon: Car,
      title: "交通費",
      description: `通勤定期代は入力不要です。その日の臨時の電車・バス等の交通費のみ入力してください。`
    },
    {
      icon: FileText,
      title: "下請け報告",
      description: `現場責任者のみ。準委任および請負作業について個別に報告します。「一括設定」を使用して同じ時間を設定可能です。`
    },
    {
      icon: Upload,
      title: "OCRアップロード",
      description: `領収書や請求書を撮影します。カテゴリと現場を選択してください。金額はOCRで自動読み取りされます。`
    },
    {
      icon: Lock,
      title: "締め日",
      description: `当月のデータは翌月10日まで編集可能です。それ以降はロックされ、閲覧のみ可能です。`
    },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100">
      <div className="bg-white px-5 py-4 border-b">
        <span className="font-semibold text-lg">マニュアル</span>
      </div>
      <div className="p-4 space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-sm flex items-start gap-4"
          >
            <div className="bg-green-100 p-3 rounded-xl">
              <section.icon className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">
                {section.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Manual;