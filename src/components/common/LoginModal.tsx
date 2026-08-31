import React, { useState } from 'react';
import { useAuth, UserProfile } from '../../context/AuthContext';

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, user, loginAs, logout } = useAuth();
  const [customName, setCustomName] = useState(user.name);
  const [customEmail, setCustomEmail] = useState(user.email);
  const [selectedRole, setSelectedRole] = useState<UserProfile['role']>(user.role);

  if (!loginModalOpen) return null;

  const roles: Array<{ role: UserProfile['role']; desc: string; icon: string }> = [
    {
      role: 'Chief Risk Officer',
      desc: 'Executive level approval for containment protocols & macro scenario overrides.',
      icon: 'admin_panel_settings',
    },
    {
      role: 'Senior Risk Analyst',
      desc: 'Full access to graph traversal simulations, AI explanations, and loan book ingestion.',
      icon: 'insights',
    },
    {
      role: 'Portfolio Manager',
      desc: 'Read-only access to portfolio analytics, exposure heatmaps, and pattern alerts.',
      icon: 'account_balance_wallet',
    },
    {
      role: 'Compliance Auditor',
      desc: 'Dedicated oversight view of immutable audit trails and decision lineage logs.',
      icon: 'verified',
    },
  ];

  const handleSave = () => {
    loginAs(selectedRole, customName, customEmail);
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setLoginModalOpen(false)}
    >
      <div
        id="login-modal-content"
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs font-mono">
              {user.initials}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Institutional Access & Role</h2>
              <p className="text-xs text-slate-500">Manage your credentials and access permissions</p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* User Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Analyst Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Institutional Role
            </label>
            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <span className="material-symbols-outlined text-base">
                        {r.icon}
                      </span>
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>{r.role}</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLoginModalOpen(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
            >
              Save Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
