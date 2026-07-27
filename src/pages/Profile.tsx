import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Shield, Edit2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/FormFields';
import { getInitials } from '../utils/helpers';

interface ProfileForm {
  name: string;
  email: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileForm>({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const onSubmit = async (_data: ProfileForm) => {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-[#f2f1f5]">
      <div>
        <h2 className="text-2xl font-bold text-[#f2f1f5]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Recruiter Profile
        </h2>
        <p className="text-sm mt-1" style={{ color: '#8b899a' }}>Your account information & preferences</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#111116', border: '1px solid #1f1d27' }}>
        {/* Banner */}
        <div className="h-28" style={{ background: 'linear-gradient(135deg,#c94dff,#7c3aed)' }} />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl border-4"
              style={{ background: '#18161e', color: '#e0b3ff', borderColor: '#111116' }}
            >
              {getInitials(user.name)}
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={editing ? <Check size={14} /> : <Edit2 size={14} />}
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full Name" {...register('name', { required: true })} />
              <Input label="Email" type="email" {...register('email', { required: true })} />
              <Button type="submit" variant="primary" isLoading={isSubmitting} id="save-profile-btn">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#f2f1f5]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {user.name}
              </h3>
              <p className="text-sm" style={{ color: '#8b899a' }}>{user.email}</p>
              {saved && (
                <p className="text-[#5fe0a8] text-xs font-medium animate-fade-in mt-1">✓ Profile updated successfully</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: <User size={18} />, label: 'Full Name', value: user.name },
          { icon: <Mail size={18} />, label: 'Email', value: user.email },
          { icon: <Shield size={18} />, label: 'Role', value: user.role },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl p-4 flex flex-col justify-between"
            style={{ background: '#111116', border: '1px solid #1f1d27' }}
          >
            <div className="p-2 rounded-xl w-fit mb-3" style={{ background: 'rgba(201,77,255,0.1)', color: '#c94dff' }}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#8b899a' }}>{item.label}</p>
              <p className="text-sm font-semibold text-[#f2f1f5] mt-0.5 truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
