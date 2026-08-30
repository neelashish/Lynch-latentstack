'use client';

import React, { useState } from 'react';
import { Alert } from './alert-data';
import { X, Plus, AlertCircle } from 'lucide-react';

interface CreateAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newAlert: Alert) => void;
}

const STOCK_OPTIONS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];

const CONDITION_OPTIONS = [
  'Risk increases',
  'Price moves significantly',
  'Momentum becomes positive',
  'Momentum becomes negative',
  'Volatility increases',
];

export const CreateAlert: React.FC<CreateAlertProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [symbol, setSymbol] = useState<string>(STOCK_OPTIONS[0]);
  const [condition, setCondition] = useState<string>(CONDITION_OPTIONS[0]);
  const [threshold, setThreshold] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol || !condition) {
      setError('Please select both a stock symbol and a condition.');
      return;
    }

    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      symbol,
      condition,
      status: 'active',
      createdAt: new Date().toISOString(),
      enabled: true,
      ...(threshold.trim() !== '' ? { threshold: threshold.trim() } : {}),
    };

    onCreate(newAlert);

    // Reset form state and close
    setThreshold('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Plus className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">
              Create New Alert
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stock Symbol Selection */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Stock Symbol
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {STOCK_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Selection */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Alert Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CONDITION_OPTIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Threshold (Optional) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Threshold <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 75 or 5%"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlert;
