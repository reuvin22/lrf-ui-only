import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import Button from "../Button";

function TransportationExpenseModal({ open, setOpen, sites = [] }) {
  const [expenses, setExpenses] = useState([
    { amount: "", route: "", site: sites[0] || "" }
  ]);

  if (!open) return null;

  const addExpense = () => {
    setExpenses([...expenses, { amount: "", route: "", site: sites[0] || "" }]);
  };

  const deleteExpense = (index) => {
    if (expenses.length > 1) {
      const updated = [...expenses];
      updated.splice(index, 1);
      setExpenses(updated);
    }
  };

  const updateExpense = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">交通費</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* INFO */}
        <p className="text-sm text-gray-600 mb-4">
          ※ 定期代の入力は不要です<br />
          ※ 臨時の交通費（電車・バス）のみ入力してください
        </p>

        {/* EXPENSES */}
        <div className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="border rounded-xl p-4 space-y-3">

              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">交通費 {index + 1}</span>
                {expenses.length > 1 && (
                  <button
                    onClick={() => deleteExpense(index)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600">金額 (¥)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={expense.amount}
                  onChange={(e) => updateExpense(index, "amount", e.target.value)}
                  placeholder="580"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600">経路 (任意)</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={expense.route}
                  onChange={(e) => updateExpense(index, "route", e.target.value)}
                  placeholder="新宿→Site A"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600">サイト</label>
                <select
                  className="w-full border rounded-lg p-2 mt-1"
                  value={expense.site}
                  onChange={(e) => updateExpense(index, "site", e.target.value)}
                >
                  {sites.length > 0 ? (
                    sites.map((site, i) => <option key={i} value={site}>{site}</option>)
                  ) : (
                    <option value="">サイトなし</option>
                  )}
                </select>
              </div>

            </div>
          ))}
        </div>

        {/* ADD ANOTHER */}
        <button
          onClick={addExpense}
          className="mt-4 flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-800"
        >
          <Plus size={16} /> 追加
        </button>

        {/* SUMMARY */}
        <div className="mt-6 border-t pt-4 space-y-2">
          {expenses.map((expense, index) => (
            <p key={index} className="text-sm">
              ■ ¥{expense.amount || "0"} {expense.route || ""} ({expense.site})
            </p>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 mt-6">
          <Button
            buttonStyle="primary"
            text="完了"
            onClick={() => setOpen(false)}
          />
          <Button
            buttonStyle="secondary"
            text="スキップ（交通費なし）"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default TransportationExpenseModal;