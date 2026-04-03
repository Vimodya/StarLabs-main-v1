import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  User, Music, ShoppingCart, History, Trophy, LogOut,
  MapPin, Calendar, Edit3, Save, X, Trash2, ExternalLink,
  Users, Zap, Gift, ShoppingBag, CheckCircle
} from 'lucide-react';

type TabId = 'profile' | 'artists' | 'cart' | 'history' | 'rewards';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');

  if (!user) { navigate('/login'); return null; }

  const handleLogout = () => { logout(); navigate('/'); };
  const handleSave = () => { updateUser({ name: editName, bio: editBio, location: editLocation }); setEditing(false); };
  const removeFromCart = (id: string) => updateUser({ cart: user.cart.filter(i => i.id !== id) });

  const totalPoints = user.rewards.filter(r => r.earned).reduce((acc, r) => acc + r.points, 0);
  const totalSpent = user.purchaseHistory.reduce((acc, p) => acc + p.price, 0);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'artists', label: 'Following', icon: <Music className="w-4 h-4" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards', icon: <Trophy className="w-4 h-4" /> },
  ];

  const typeBadge: Record<string, { bg: string; text: string; border: string }> = {
    NFT: { bg: 'hsl(270 60% 55% / 0.12)', text: 'hsl(270 50% 45%)', border: 'hsl(270 60% 55% / 0.3)' },
    Token: { bg: 'hsl(205 80% 55% / 0.12)', text: 'hsl(205 70% 40%)', border: 'hsl(205 80% 55% / 0.3)' },
    Bundle: { bg: 'hsl(41 80% 55% / 0.12)', text: 'hsl(36 70% 38%)', border: 'hsl(41 80% 55% / 0.3)' },
  };

  const card = {
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid hsl(196 23% 80%)',
    boxShadow: '0 8px 32px hsl(41 80% 55% / 0.08)',
  };

  const inputStyle = {
    background: 'hsl(198 25% 96%)',
    border: '1px solid hsl(196 23% 76%)',
    color: 'hsl(29 80% 21%)',
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, hsl(198 25% 91%) 0%, hsl(37 70% 91%) 60%, hsl(41 80% 93%) 100%)' }}
    >
      {/* BG blobs */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, hsl(41 80% 55%) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, hsl(36 70% 41%) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Link to="/">
            <img src="/images/logo.png" alt="Star Labs" className="h-9 w-auto opacity-90 hover:opacity-100 transition-opacity" style={{ WebkitFilter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.3))' }} />
          </Link>
          <button
            id="profile-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-sans transition-all"
            style={{ background: 'hsl(0 84% 60% / 0.08)', border: '1px solid hsl(0 84% 60% / 0.25)', color: 'hsl(0 70% 45%)' }}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </header>

        {/* Profile Banner */}
        <div className="rounded-3xl p-8 mb-6 overflow-hidden relative" style={card}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-2xl"
            style={{ background: 'hsl(41 80% 55%)' }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold font-serif border-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(41 80% 55%) 0%, hsl(36 70% 45%) 100%)',
                  color: 'hsl(198 25% 98%)',
                  borderColor: 'hsl(41 80% 55% / 0.4)',
                }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2" style={{ background: 'hsl(120 50% 45%)', borderColor: 'white' }} />
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-serif text-2xl" style={{ color: 'hsl(29 80% 21%)' }}>{user.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold font-sans tracking-wider"
                  style={{ background: 'hsl(41 80% 55% / 0.15)', border: '1px solid hsl(41 80% 55% / 0.3)', color: 'hsl(36 70% 35%)' }}>
                  ⭐ {totalPoints} pts
                </span>
              </div>
              <p className="font-sans text-sm mb-3" style={{ color: 'hsl(29 60% 50%)' }}>{user.email}</p>
              <div className="flex flex-wrap gap-4 text-xs font-sans" style={{ color: 'hsl(29 40% 55%)' }}>
                {user.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{user.location}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{user.followedArtists.length} Artists</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8">
              {[
                { label: 'Purchases', value: user.purchaseHistory.length },
                { label: 'Cart', value: user.cart.length },
                { label: 'Spent', value: `$${totalSpent.toFixed(0)}` },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold font-serif" style={{ color: 'hsl(36 70% 38%)' }}>{s.value}</div>
                  <div className="text-xs font-sans mt-0.5" style={{ color: 'hsl(29 40% 55%)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid hsl(196 23% 82%)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-sans whitespace-nowrap flex-1 transition-all duration-200"
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg, hsl(41 80% 55%) 0%, hsl(36 70% 45%) 100%)',
                color: 'hsl(198 25% 98%)',
                boxShadow: '0 4px 16px hsl(41 80% 55% / 0.3)',
              } : { color: 'hsl(29 60% 45%)' }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-3xl overflow-hidden" style={card}>

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl" style={{ color: 'hsl(29 80% 21%)' }}>Account Details</h2>
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold font-sans transition-all"
                      style={{ background: 'hsl(41 80% 55%)', color: 'hsl(198 25% 98%)' }}>
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-sans transition-all"
                      style={{ border: '1px solid hsl(196 23% 76%)', color: 'hsl(29 60% 45%)' }}>
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-sans transition-all"
                    style={{ border: '1px solid hsl(41 80% 55% / 0.35)', color: 'hsl(36 70% 38%)' }}>
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', value: editName, setter: setEditName, editable: true },
                  { label: 'Email', value: user.email, setter: () => {}, editable: false },
                  { label: 'Location', value: editLocation, setter: setEditLocation, editable: true },
                  { label: 'Member Since', value: new Date(user.joinedDate).toLocaleDateString(), setter: () => {}, editable: false },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans" style={{ color: 'hsl(36 70% 41%)' }}>{f.label}</label>
                    {editing && f.editable ? (
                      <input value={f.value} onChange={e => f.setter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-sans focus:outline-none transition-all"
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                        onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                      />
                    ) : (
                      <p className="text-sm font-sans px-4 py-3 rounded-xl" style={{ background: 'hsl(198 25% 96%)', color: 'hsl(29 80% 25%)', border: '1px solid hsl(196 23% 86%)' }}>
                        {f.value}
                      </p>
                    )}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-sans" style={{ color: 'hsl(36 70% 41%)' }}>Bio</label>
                  {editing ? (
                    <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm font-sans focus:outline-none transition-all resize-none"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'hsl(41 80% 55%)')}
                      onBlur={e => (e.target.style.borderColor = 'hsl(196 23% 76%)')}
                    />
                  ) : (
                    <p className="text-sm font-sans px-4 py-3 rounded-xl min-h-[80px]" style={{ background: 'hsl(198 25% 96%)', color: 'hsl(29 80% 25%)', border: '1px solid hsl(196 23% 86%)' }}>
                      {user.bio || '—'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── FOLLOWING ── */}
          {activeTab === 'artists' && (
            <div className="p-8">
              <h2 className="font-serif text-xl mb-6" style={{ color: 'hsl(29 80% 21%)' }}>
                Followed Artists <span className="text-base ml-1" style={{ color: 'hsl(36 70% 45%)' }}>({user.followedArtists.length})</span>
              </h2>
              {user.followedArtists.length === 0 ? (
                <div className="text-center py-16">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'hsl(41 80% 55%)' }} />
                  <p className="font-sans" style={{ color: 'hsl(29 40% 55%)' }}>You haven't followed any artists yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.followedArtists.map(artist => (
                    <div key={artist.id} className="p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                      style={{ background: 'hsl(198 25% 96%)', border: '1px solid hsl(196 23% 82%)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold font-serif flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, hsl(41 80% 55%) 0%, hsl(36 70% 45%) 100%)', color: 'white' }}>
                          {artist.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm font-sans" style={{ color: 'hsl(29 80% 21%)' }}>{artist.name}</h3>
                          <p className="text-xs font-sans mt-0.5" style={{ color: 'hsl(29 40% 55%)' }}>{artist.genre}</p>
                          <p className="text-xs font-sans mt-1 flex items-center gap-1" style={{ color: 'hsl(36 70% 40%)' }}>
                            <Users className="w-3 h-3" />{artist.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs font-sans px-2 py-0.5 rounded-full" style={{ background: 'hsl(41 80% 55% / 0.12)', border: '1px solid hsl(41 80% 55% / 0.25)', color: 'hsl(36 70% 38%)' }}>
                          <CheckCircle className="w-3 h-3 inline mr-1" />Following
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CART ── */}
          {activeTab === 'cart' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl" style={{ color: 'hsl(29 80% 21%)' }}>
                  Shopping Cart <span className="text-base ml-1" style={{ color: 'hsl(36 70% 45%)' }}>({user.cart.length})</span>
                </h2>
                {user.cart.length > 0 && (
                  <button className="px-4 py-2 rounded-xl text-sm font-bold font-sans transition-all"
                    style={{ background: 'linear-gradient(135deg, hsl(41 80% 55%) 0%, hsl(36 70% 45%) 100%)', color: 'white', boxShadow: '0 4px 16px hsl(41 80% 55% / 0.3)' }}>
                    Checkout · ${user.cart.reduce((a, i) => a + i.price, 0).toFixed(2)}
                  </button>
                )}
              </div>
              {user.cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'hsl(41 80% 55%)' }} />
                  <p className="font-sans" style={{ color: 'hsl(29 40% 55%)' }}>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.cart.map(item => {
                    const badge = typeBadge[item.type];
                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                        style={{ background: 'hsl(198 25% 97%)', border: '1px solid hsl(196 23% 84%)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'hsl(41 80% 55% / 0.1)', border: '1px solid hsl(41 80% 55% / 0.2)' }}>
                          <ShoppingBag className="w-5 h-5" style={{ color: 'hsl(41 80% 45%)' }} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold font-sans truncate" style={{ color: 'hsl(29 80% 21%)' }}>{item.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-sans"
                              style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>{item.type}</span>
                          </div>
                          <p className="text-xs font-sans" style={{ color: 'hsl(29 40% 55%)' }}>by {item.artist}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-bold font-sans" style={{ color: 'hsl(36 70% 38%)' }}>${item.price}</span>
                          <button id={`remove-${item.id}`} onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: 'hsl(0 84% 60% / 0.08)', border: '1px solid hsl(0 84% 60% / 0.25)', color: 'hsl(0 70% 45%)' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY ── */}
          {activeTab === 'history' && (
            <div className="p-8">
              <h2 className="font-serif text-xl mb-6" style={{ color: 'hsl(29 80% 21%)' }}>
                Purchase History <span className="text-base ml-1" style={{ color: 'hsl(36 70% 45%)' }}>({user.purchaseHistory.length})</span>
              </h2>
              {user.purchaseHistory.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'hsl(41 80% 55%)' }} />
                  <p className="font-sans" style={{ color: 'hsl(29 40% 55%)' }}>No purchases yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.purchaseHistory.map(p => {
                    const badge = typeBadge[p.type];
                    return (
                      <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl"
                        style={{ background: 'hsl(198 25% 97%)', border: '1px solid hsl(196 23% 84%)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'hsl(41 80% 55% / 0.1)', border: '1px solid hsl(41 80% 55% / 0.2)' }}>
                          <ShoppingBag className="w-5 h-5" style={{ color: 'hsl(41 80% 45%)' }} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold font-sans truncate" style={{ color: 'hsl(29 80% 21%)' }}>{p.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-sans"
                              style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>{p.type}</span>
                          </div>
                          <p className="text-xs font-sans mb-1" style={{ color: 'hsl(29 40% 55%)' }}>by {p.artist}</p>
                          <div className="flex items-center gap-2 text-xs font-sans" style={{ color: 'hsl(29 30% 60%)' }}>
                            <Calendar className="w-3 h-3" />{new Date(p.purchaseDate).toLocaleDateString()}
                            <span>·</span>
                            <span className="font-mono">{p.txHash}</span>
                            <ExternalLink className="w-3 h-3 cursor-pointer hover:opacity-70" style={{ color: 'hsl(41 80% 45%)' }} />
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="font-bold font-sans" style={{ color: 'hsl(36 70% 38%)' }}>${p.price}</span>
                          <p className="text-xs font-sans mt-0.5" style={{ color: 'hsl(120 50% 40%)' }}>✓ Complete</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 p-4 rounded-2xl flex justify-between items-center"
                    style={{ background: 'hsl(41 80% 55% / 0.08)', border: '1px solid hsl(41 80% 55% / 0.2)' }}>
                    <span className="text-sm font-sans font-medium" style={{ color: 'hsl(29 60% 45%)' }}>Total Spent</span>
                    <span className="text-xl font-bold font-serif" style={{ color: 'hsl(36 70% 35%)' }}>${totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── REWARDS ── */}
          {activeTab === 'rewards' && (
            <div className="p-8">
              {/* Points summary */}
              <div className="rounded-2xl p-5 mb-6 flex items-center gap-5"
                style={{ background: 'linear-gradient(135deg, hsl(41 80% 55% / 0.12) 0%, hsl(36 70% 41% / 0.06) 100%)', border: '1px solid hsl(41 80% 55% / 0.25)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'hsl(41 80% 55% / 0.15)', border: '1px solid hsl(41 80% 55% / 0.3)' }}>
                  <Zap className="w-7 h-7" style={{ color: 'hsl(41 80% 45%)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] font-sans mb-1" style={{ color: 'hsl(36 70% 45%)' }}>Total Points</p>
                  <p className="text-3xl font-bold font-serif" style={{ color: 'hsl(29 80% 21%)' }}>{totalPoints.toLocaleString()}</p>
                  <p className="text-xs font-sans mt-1" style={{ color: 'hsl(29 40% 55%)' }}>
                    {user.rewards.filter(r => r.earned).length} of {user.rewards.length} badges earned
                  </p>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] font-sans mb-1" style={{ color: 'hsl(36 70% 45%)' }}>Next Tier</p>
                  <p className="text-sm font-sans font-semibold" style={{ color: 'hsl(29 80% 21%)' }}>Platinum at 2,000 pts</p>
                  <div className="mt-2 h-1.5 w-32 rounded-full overflow-hidden ml-auto" style={{ background: 'hsl(196 23% 82%)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min((totalPoints / 2000) * 100, 100)}%`, background: 'linear-gradient(90deg, hsl(41 80% 55%), hsl(36 70% 45%))' }} />
                  </div>
                </div>
              </div>

              <h2 className="font-serif text-xl mb-4" style={{ color: 'hsl(29 80% 21%)' }}>Badges & Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.rewards.map(reward => (
                  <div key={reward.id} className={`p-5 rounded-2xl transition-all duration-200 ${!reward.earned ? 'opacity-55 grayscale' : 'hover:scale-[1.02]'}`}
                    style={{
                      background: reward.earned ? 'hsl(198 25% 97%)' : 'hsl(198 25% 94%)',
                      border: reward.earned ? '1px solid hsl(41 80% 55% / 0.3)' : '1px solid hsl(196 23% 82%)',
                    }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{reward.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm font-sans mb-1" style={{ color: 'hsl(29 80% 21%)' }}>{reward.title}</h3>
                        <p className="text-xs font-sans" style={{ color: 'hsl(29 40% 55%)' }}>{reward.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold font-sans flex items-center gap-1" style={{ color: 'hsl(36 70% 38%)' }}>
                        <Gift className="w-3 h-3" />{reward.points} pts
                      </span>
                      {reward.earned ? (
                        <span className="text-xs font-sans" style={{ color: 'hsl(120 50% 38%)' }}>
                          ✓ {reward.earnedDate ? new Date(reward.earnedDate).toLocaleDateString() : 'Earned'}
                        </span>
                      ) : (
                        <span className="text-xs font-sans" style={{ color: 'hsl(29 30% 60%)' }}>Locked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
