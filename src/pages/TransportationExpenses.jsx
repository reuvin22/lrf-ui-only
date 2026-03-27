import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateSegmentId } from "../utils/idGenerator";

const SITE_OPTIONS = [
  { id: 1, name: "Site A - Shinjuku Tower" },
  { id: 2, name: "Site B - Shibuya Office" },
  { id: 3, name: "Site C - Roppongi Hills" }
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
      alert("Amount and Site are required");
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
      <h1 className="text-xl font-bold">Transportation Expenses</h1>
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <p>※ No need to enter commuter pass expenses</p>
        <p>※ Enter ad-hoc transport costs (train/bus) only</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-500">Amount</label>
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
          <label className="text-sm text-gray-500">Route (optional)</label>
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. Shinjuku → Site A"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Site</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <span className="text-gray-400 mr-2">📍</span>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700"
            >
              <option value="">Select site</option>
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
          + Add Another
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
          Done
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full text-gray-500 py-2"
        >
          Skip (no transport cost)
        </button>
      </div>
    </div>
  );
}

export default TransportationExpenseScreen;