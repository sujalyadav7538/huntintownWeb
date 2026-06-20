import { useState, FormEvent } from 'react';
import { User } from '../types';
import { MOCK_USERS, INITIAL_USER } from '../data';
import { Check, Mail, Lock, UserPlus } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../utils';

interface LoginModalProps {
  onLogin: (user: User, token: string) => void;
  onClose?: () => void;
  isOpen: boolean;
  currentUserId?: string;
}

export default function LoginModal({ onLogin, onClose, isOpen, currentUserId }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customLocation, setCustomLocation] = useState('Noida, Sector 62');
  const [activeTab, setActiveTab] = useState<'signin' | 'preset' | 'forge'>('signin');

  if (!isOpen) return null;

  const handleSelectUser = (user: User) => {
    onLogin(user, '');
    if (onClose) onClose();
  };

  const handleCreateCustom = (e: FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customRole.trim()) return;

    const newUser: User = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      avatar: getAvatarUrl(customName.trim()),
      role: customRole.trim(),
      location: customLocation.trim(),
      skills: ['Interior Design', 'Home Decor', 'Custom Carpentry'],
      bio: 'Verified resident inside the HuntInTown network.',
      rating: 4.8,
      reputation: 20
    };

    onLogin(newUser, '');
    if (onClose) onClose();
  };

  const handleSimulatedSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Naturally simulate logging in as the default user (Arjun Mehta) or another mock
    onLogin(INITIAL_USER, '');
    if (onClose) onClose();
  };
  console.log("loginmaodal")
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121214] rounded-2xl border border-[#232327] max-w-sm w-full overflow-hidden text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-250">
        
        {/* Top Header Section matching design #2 - Welcome Back block */}
        <div className="p-5 text-center border-b border-[#1e1e21] bg-[#17171a] relative">
          <div className="absolute top-2 right-2">
            <button 
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-400 font-bold text-xs"
            >
              ✕
            </button>
          </div>
          <div className="text-[#FF3F3F] font-black text-xl tracking-tighter uppercase font-display mb-1">
            HuntInTown
          </div>
          <h2 className="text-base font-black text-white font-display">Welcome Back 👋</h2>
          <p className="text-[10px] text-zinc-400 font-semibold tracking-wide mt-0.5">Login to continue connection exchanges</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#1e1e21] bg-[#161619] justify-around">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border-b-2 ${
              activeTab === 'signin' ? 'border-[#FF3F3F] text-[#FF3F3F]' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In Form
          </button>
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border-b-2 ${
              activeTab === 'preset' ? 'border-[#FF3F3F] text-[#FF3F3F]' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Presets Simulation
          </button>
          <button
            onClick={() => setActiveTab('forge')}
            className={`flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border-b-2 ${
              activeTab === 'forge' ? 'border-[#FF3F3F] text-[#FF3F3F]' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            New Identity
          </button>
        </div>

        {/* Content Portal */}
        <div className="p-5">
          {activeTab === 'signin' && (
            <form onSubmit={handleSimulatedSubmit} className="space-y-3.5">
              
              {/* Login with Google (Directly from Mockup Screen #2 Auth!) */}
              <button 
                type="button"
                onClick={() => handleSelectUser(INITIAL_USER)}
                className="w-full py-2 bg-white hover:bg-zinc-100 text-zinc-900 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-200 cursor-pointer"
              >
                <img 
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
                  alt="Google" 
                  className="w-3.5 h-3.5"
                />
                <span>Login with Google</span>
              </button>

              {/* Login with Mobile */}
              <button 
                type="button"
                onClick={() => setActiveTab('preset')}
                className="w-full py-2 bg-[#232327] hover:bg-zinc-800 text-zinc-100 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
              >
                <span>📱 Login with Mobile Code</span>
              </button>

              <div className="flex items-center gap-2 py-0.5 my-1">
                <span className="h-[1px] bg-zinc-800 flex-1" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF3F3F]">or continue with email</span>
                <span className="h-[1px] bg-zinc-800 flex-1" />
              </div>

              {/* Email Form */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase">Password</label>
                    <span className="text-[8px] text-[#FF3F3F] hover:underline cursor-pointer">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black rounded-lg text-xs uppercase tracking-wider font-display transition cursor-pointer mt-2"
                >
                  Login Sim
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[10px] text-zinc-500">
                  Don't have an account? <span className="text-[#FF3F3F] hover:underline font-bold cursor-pointer" onClick={() => setActiveTab('forge')}>Sign up</span>
                </p>
              </div>
            </form>
          )}

          {activeTab === 'preset' && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase block font-mono">Select Preset Character</span>
              
              {/* Default */}
              <div
                id="login-preset-alex"
                onClick={() => handleSelectUser(INITIAL_USER)}
                className={`p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition ${
                  currentUserId === INITIAL_USER.id 
                    ? 'border-[#FF3F3F] bg-red-950/20 text-white' 
                    : 'border-zinc-800 bg-[#161619] hover:bg-zinc-800'
                }`}
              >
                <img src={getAvatarUrl(INITIAL_USER.name, INITIAL_USER.avatar)} alt={INITIAL_USER.name} className="w-8.5 h-8.5 rounded-full object-cover" onError={(e) => handleAvatarError(e, INITIAL_USER.name)} referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-black text-white">{INITIAL_USER.name} <span className="font-normal text-[9px] text-[#FF3F3F]">(Default Star)</span></span>
                  <span className="block text-[9px] text-zinc-400 truncate">{INITIAL_USER.role}</span>
                </div>
                {currentUserId === INITIAL_USER.id && <Check className="w-4 h-4 text-[#FF3F3F]" />}
              </div>

              {/* Mock items */}
              {MOCK_USERS.map(u => (
                <div
                  key={u.id}
                  id={`login-preset-${u.id}`}
                  onClick={() => handleSelectUser(u)}
                  className={`p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition ${
                    currentUserId === u.id 
                      ? 'border-[#FF3F3F] bg-red-950/20 text-white' 
                      : 'border-zinc-800 bg-[#161619] hover:bg-zinc-800'
                  }`}
                >
                  <img src={getAvatarUrl(u.name, u.avatar)} alt={u.name} className="w-8 h-8 rounded-full object-cover" onError={(e) => handleAvatarError(e, u.name)} referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-black text-white">{u.name}</span>
                    <span className="block text-[9px] text-zinc-400 truncate">{u.role}</span>
                  </div>
                  {currentUserId === u.id && <Check className="w-4 h-4 text-[#FF3F3F]" />}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'forge' && (
            <form onSubmit={handleCreateCustom} className="space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                <input
                  id="custom-login-name"
                  type="text"
                  placeholder="e.g. Mary Gallagher"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1">Profession / Role</label>
                <input
                  id="custom-login-role"
                  type="text"
                  placeholder="e.g. Master Carpenter, Local Landlord"
                  required
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1">Sector Coordinate</label>
                <input
                  id="custom-login-location"
                  type="text"
                  required
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                />
              </div>

              <div className="pt-2">
                <button
                  id="submit-register-custom"
                  type="submit"
                  className="w-full py-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Identity & Log In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
