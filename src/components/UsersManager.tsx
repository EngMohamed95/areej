import React, { useState } from 'react';
import { Pencil, Plus, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { StaffUser } from '../types';

interface UsersManagerProps {
  users: StaffUser[];
  activeUserId?: string;
  tenantId: string;
  lang: 'ar' | 'en';
  onSave: (user: StaffUser & { pin?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = (tenantId: string) => ({
  id: '', tenantId, name: '', email: '', phone: '', role: 'staff' as StaffUser['role'], isActive: true, pin: ''
});

export default function UsersManager({ users, activeUserId, tenantId, lang, onSave, onDelete }: UsersManagerProps) {
  const [form, setForm] = useState(emptyForm(tenantId));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setForm(emptyForm(tenantId));
    setEditing(false);
    setError('');
  };

  const edit = (user: StaffUser) => {
    setEditing(true);
    setForm({ ...user, phone: user.phone || '', pin: '' });
    setError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || (!editing && form.pin.length < 4)) {
      setError(lang === 'ar' ? 'الاسم ورمز دخول من 4 أرقام على الأقل مطلوبان.' : 'Name and a PIN of at least 4 digits are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        id: form.id || `usr-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        pin: form.pin || undefined
      });
      reset();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save user.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user: StaffUser) => {
    const approved = window.confirm(lang === 'ar' ? `حذف المستخدم ${user.name}؟` : `Delete ${user.name}?`);
    if (!approved) return;
    try {
      await onDelete(user.id);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete user.');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-rose-600" />{lang === 'ar' ? 'مستخدمو النظام' : 'System Users'}</h3>
            <p className="text-xs text-gray-400 mt-1">{lang === 'ar' ? 'المستخدمون والصلاحيات تُقرأ مباشرة من MySQL.' : 'Users and roles are loaded directly from MySQL.'}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">{users.length}</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map(user => (
            <div key={user.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 flex items-center justify-center"><UserRound className="w-5 h-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.name}</span>
                  {!user.isActive && <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{lang === 'ar' ? 'موقوف' : 'Inactive'}</span>}
                </div>
                <div className="text-xs text-gray-400 truncate">{user.email || user.phone || user.id}</div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-violet-50 text-violet-700">{user.role}</span>
              <button type="button" onClick={() => edit(user)} aria-label="Edit user" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Pencil className="w-4 h-4" /></button>
              <button type="button" disabled={user.id === activeUserId} onClick={() => void remove(user)} aria-label="Delete user" className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={submit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-4 h-fit">
        <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2"><Plus className="w-4 h-4 text-rose-600" />{editing ? (lang === 'ar' ? 'تعديل المستخدم' : 'Edit user') : (lang === 'ar' ? 'إضافة مستخدم' : 'Add user')}</h3>
        <input value={form.name} onChange={e => setForm(current => ({ ...current, name: e.target.value }))} placeholder={lang === 'ar' ? 'الاسم' : 'Name'} className="w-full px-3 py-2 border rounded-xl bg-transparent" />
        <input type="email" value={form.email} onChange={e => setForm(current => ({ ...current, email: e.target.value }))} placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} className="w-full px-3 py-2 border rounded-xl bg-transparent" />
        <input value={form.phone} onChange={e => setForm(current => ({ ...current, phone: e.target.value }))} placeholder={lang === 'ar' ? 'الهاتف' : 'Phone'} className="w-full px-3 py-2 border rounded-xl bg-transparent" />
        <input type="password" inputMode="numeric" value={form.pin} onChange={e => setForm(current => ({ ...current, pin: e.target.value }))} placeholder={editing ? (lang === 'ar' ? 'رمز جديد (اتركه فارغًا دون تغيير)' : 'New PIN (blank keeps current)') : (lang === 'ar' ? 'رمز الدخول' : 'Login PIN')} className="w-full px-3 py-2 border rounded-xl bg-transparent" />
        <select value={form.role} onChange={e => setForm(current => ({ ...current, role: e.target.value as StaffUser['role'] }))} className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900">
          <option value="owner">Owner</option><option value="manager">Manager</option><option value="staff">Staff</option>
        </select>
        <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={form.isActive} onChange={e => setForm(current => ({ ...current, isActive: e.target.checked }))} />{lang === 'ar' ? 'المستخدم نشط' : 'User is active'}</label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button disabled={saving} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black disabled:opacity-50">{saving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ في MySQL' : 'Save to MySQL')}</button>
          {editing && <button type="button" onClick={reset} className="px-4 rounded-xl border text-xs font-bold">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>}
        </div>
      </form>
    </div>
  );
}
