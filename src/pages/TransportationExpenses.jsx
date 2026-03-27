import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateSegmentId } from "../utils/idGenerator";

const SITE_OPTIONS = [
  { id: 1, name: "サイトA - 新宿タワー" },
  { id: 2, name: "サイトB - 渋谷オフィス" },
  { id: 3, name: "サイトC - 六本木ヒルズ" }
];

function TransportationExpenseScreen({ sites = [], attendanceId, onDone }) {
  const [amount, setAmount] = useState("");
  const [route, setRoute] = useState("");
  const [site, setSite] = useState("");
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  // Add a new expense to local state
  const handleAdd = () => {
    if (!amount || !site) {
      alert("金額とサイトは必須です");
      return;
    }

    const selectedSite = SITE_OPTIONS.find(s => s.id === Number(site));

    const newExpense = {
      attendance_id: generateSegmentId(),
      amount: Number(amount),
      route: route || null,
      site_id: selectedSite.id,
      site_name: selectedSite.name
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setRoute("");
    setSite("");
  };

  // Done: send data to parent and navigate home
  const handleDone = () => {
    onDone && onDone(expenses); // pass expenses back
    navigate("/");              // go back to /
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-6 flex flex-col gap-4">
      <h1 className="text-xl font-bold">交通費</h1>
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <p>※ 定期代は入力不要です</p>
        <p>※ 臨時の交通費（電車・バス）のみ入力してください</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-500">金額</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <span className="mr-2">¥</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">経路（任意）</label>
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="例：新宿 → サイトA"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">サイト</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <span className="text-gray-400 mr-2">📍</span>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700"
            >
              <option value="">サイトを選択</option>
              {SITE_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          + 追加
        </button>
      </div>

      <div className="space-y-2 mt-4">
        {expenses.map((exp, index) => (
          <div
            key={index}
            className="flex justify-between border rounded-lg p-3 text-sm"
          >
            <span>¥{exp.amount}</span>
            <span className="text-gray-600">{exp.route || "-"}</span>
            <span className="text-gray-500">{exp.site_name}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-2 pt-4">
        <button
          onClick={handleDone}
          className="w-full py-3 rounded-lg font-medium bg-green-500 text-white"
        >
          完了
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full text-gray-500 py-2"
        >
          スキップ（交通費なし）
        </button>
      </div>
    </div>
  );
}

export default TransportationExpenseScreen;