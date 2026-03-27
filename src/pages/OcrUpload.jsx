import { useState, useRef } from "react";
import { Camera, Image, Upload } from "lucide-react";
import Button from "../components/Button";

function OcrUpload() {
  const [imagePreview, setImagePreview] = useState(null);
  const libraryInputRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white px-5 py-4 border-b">
        <span className="font-semibold text-lg">書類アップロード</span>
      </div>

      <div className="p-4 space-y-4">
        {/* UPLOAD AREA */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          {imagePreview ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <Button
                buttonStyle="secondary"
                text="削除"
                onClick={() => setImagePreview(null)}
                customButton="w-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="bg-green-100 p-5 rounded-2xl">
                <Camera className="text-green-600" size={28} />
              </div>

              <Button
                buttonStyle="secondary"
                onClick={() => libraryInputRef.current.click()}
                customButton="flex items-center justify-center gap-2 w-full"
                text={
                  <span className="flex items-center gap-2 justify-center">
                    <Image size={18} />
                    画像をアップロード
                  </span>
                }
              />
            </div>
          )}

          <input
            ref={libraryInputRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">
              カテゴリ *
            </label>
            <select className="w-full mt-1 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option>臨時交通費</option>
              <option>交通費</option>
              <option>食事代</option>
              <option>消耗品</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">現場 *</label>
            <select className="w-full mt-1 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option>現場A</option>
              <option>現場B</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">メモ</label>
            <textarea
              placeholder="任意"
              className="w-full mt-1 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <Button
            buttonStyle="primary"
            customButton="flex items-center justify-center gap-2"
            text={
              <span className="flex items-center gap-2 justify-center">
                <Upload size={18} />
                アップロード
              </span>
            }
          />
        </div>

        {/* UPLOADED ITEMS */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            本日アップロード済み
          </p>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="font-medium text-gray-700">
              臨時交通費 現場A 16:20
            </p>
            <p className="text-sm text-orange-500">ステータス: 保留中</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="font-medium text-gray-700">
              下請け請求書 現場A 14:05
            </p>
            <p className="text-sm text-green-600">
              ステータス: 完了 ¥35,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OcrUpload;