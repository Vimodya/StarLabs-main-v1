import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  User, Music, ShoppingCart, History, Trophy,
  LogOut, Star, MapPin, Calendar, Edit3, Save, X,
  ShoppingBag, Trash2, ExternalLink, Users, Zap, Gift
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

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser({ name: editName, bio: editBio, location: editLocation });
    setEditing(false);
  };

  const handleRemoveFromCart = (id: string) => {
    updateUser({ cart: user.cart.filter(item => item.id !== id) });
  };

  const totalPoints = user.rewards.filter(r => r.earned).reduce((acc, r) => acc + r.points, 0);
  const totalSpent = user.purchaseHistory.reduce((acc, p) => acc + p.price, 0);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'artists', label: 'Following', icon: <Music className="w-4 h-4" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards', icon: <Trophy className="w-4 h-4" /> },
  ];

  const badgeColors: Record<string, string> = {
    NFT: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Token: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Bundle: 'bg-[#FBD515]/15 text-[#FBD515] border-[#FBD515]/30',
  };

  return (
    <div className="min-h-screen bg-[#0a0806] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-[#FBD515]/6 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FBD515]/5 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(251,213,21,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,213,21,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Top Nav */}
        <header className="flex items-center justify-between mb-8">
          <a href="/" className="flex items-center gap-2 group">
            <Star className="w-6 h-6 text-[#FBD515] fill-[#FBD515] group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold text-white tracking-widest uppercase">StarLabs</span>
          </a>
          <button
            id="profile-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </header>

        {/* Hero Banner */}
        <div
          className="relative rounded-3xl overflow-hidden mb-6 border border-[#FBD515]/15"
          style={{ background: 'linear-gradient(135deg, rgba(251,213,21,0.12) 0%, rgba(15,10,3,0.98) 70%)' }}
        >
          {/* Banner pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251,213,21,1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
          <div className="relative p-8 flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-[#FBD515]/40"
                style={{ background: 'linear-gradient(135deg, #FBD515 0%, #E6A817 100%)', color: '#0a0806' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0a0806]" />
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FBD515]/15 text-[#FBD515] border border-[#FBD515]/30 font-semibold tracking-wider">
                  ⭐ {totalPoints} pts
                </span>
              </div>
              <p className="text-[#9a8a6a] text-sm mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-4 text-xs text-[#7a6a4a]">
                {user.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location}</span>
                )}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {user.followedArtists.length} Artists</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 sm:gap-6">
              {[
                { label: 'Purchases', value: user.purchaseHistory.length },
                { label: 'Cart', value: user.cart.length },
                { label: 'Spent', value: `$${totalSpent.toFixed(2)}` },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-[#FBD515]">{stat.value}</div>
                  <div className="text-xs text-[#7a6a4a] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl border border-[#FBD515]/15 overflow-x-auto"
          style={{ background: 'rgba(251,213,21,0.04)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`profile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'text-[#0a0806] shadow-lg'
                  : 'text-[#9a8a6a] hover:text-white'
              }`}
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg, #FBD515 0%, #E6A817 100%)',
                boxShadow: '0 0 20px rgba(251,213,21,0.25)',
              } : {}}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-[#FBD515]/15 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(251,213,21,0.05) 0%, rgba(10,8,6,0.95) 70%)' }}>

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Account Details</h2>
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBD515] text-[#0a0806] text-sm font-semibold hover:bg-[#E6A817] transition-colors">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FBD515]/30 text-[#9a8a6a] text-sm hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FBD515]/30 text-[#c8a84b] text-sm hover:border-[#FBD515] transition-colors">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: editName, setValue: setEditName, editable: true },
                  { label: 'Email', value: user.email, setValue: () => {}, editable: false },
                  { label: 'Location', value: editLocation, setValue: setEditLocation, editable: true },
                  { label: 'Member Since', value: new Date(user.joinedDate).toLocaleDateString(), setValue: () => {}, editable: false },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">{field.label}</label>
                    {editing && field.editable ? (
                      <input
                        value={field.value}
                        onChange={e => field.setValue(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FBD515]/30 text-white focus:outline-none focus:border-[#FBD515]/60 transition-all text-sm"
                      />
                    ) : (
                      <p className="text-white text-sm px-4 py-3 rounded-xl bg-black/20 border border-white/5">{field.value}</p>
                    )}
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#c8a84b] uppercase tracking-widest mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      value={editBio}
                      onChange={e => setEditBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FBD515]/30 text-white focus:outline-none focus:border-[#FBD515]/60 transition-all text-sm resize-none"
                    />
                  ) : (
                    <p className="text-white text-sm px-4 py-3 rounded-xl bg-black/20 border border-white/5 min-h-[80px]">{user.bio || '—'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── FOLLOWED ARTISTS TAB ── */}
          {activeTab === 'artists' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">Followed Artists <span className="text-[#FBD515] text-base ml-2">({user.followedArtists.length})</span></h2>
              {user.followedArtists.length === 0 ? (
                <div className="text-center py-16">
                  <Music className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                  <p className="text-[#9a8a6a]">You haven't followed any artists yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.followedArtists.map(artist => (
                    <div key={artist.id}
                      className="group p-4 rounded-2xl border border-[#FBD515]/10 hover:border-[#FBD515]/30 transition-all duration-200 cursor-pointer"
                      style={{ background: 'rgba(251,213,21,0.04)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 border border-[#FBD515]/30"
                          style={{ background: 'linear-gradient(135deg, #FBD515 0%, #E6A817 100%)', color: '#0a0806' }}>
                          {artist.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm group-hover:text-[#FBD515] transition-colors">{artist.name}</h3>
                          <p className="text-[#9a8a6a] text-xs mt-0.5">{artist.genre}</p>
                          <p className="text-[#FBD515]/70 text-xs mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {artist.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FBD515]/10 text-[#FBD515]/80 border border-[#FBD515]/20">Following</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CART TAB ── */}
          {activeTab === 'cart' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  Shopping Cart <span className="text-[#FBD515] text-base ml-2">({user.cart.length})</span>
                </h2>
                {user.cart.length > 0 && (
                  <button className="px-4 py-2 rounded-xl text-sm font-bold text-[#0a0806] transition-all"
                    style={{ background: 'linear-gradient(135deg, #FBD515 0%, #E6A817 100%)', boxShadow: '0 0 20px rgba(251,213,21,0.25)' }}>
                    Checkout · ${user.cart.reduce((acc, i) => acc + i.price, 0).toFixed(2)}
                  </button>
                )}
              </div>
              {user.cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                  <p className="text-[#9a8a6a]">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.cart.map(item => (
                    <div key={item.id}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-[#FBD515]/10 hover:border-[#FBD515]/25 transition-all"
                      style={{ background: 'rgba(251,213,21,0.04)' }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-[#FBD515]/20"
                        style={{ background: 'rgba(251,213,21,0.08)' }}>
                        <ShoppingBag className="w-6 h-6 text-[#FBD515]/60" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white text-sm font-semibold truncate">{item.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${badgeColors[item.type]}`}>{item.type}</span>
                        </div>
                        <p className="text-[#9a8a6a] text-xs">by {item.artist}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-[#FBD515] font-bold">${item.price}</span>
                        <button
                          id={`cart-remove-${item.id}`}
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-8 h-8 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === 'history' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">
                Purchase History <span className="text-[#FBD515] text-base ml-2">({user.purchaseHistory.length})</span>
              </h2>
              {user.purchaseHistory.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                  <p className="text-[#9a8a6a]">No purchases yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.purchaseHistory.map(purchase => (
                    <div key={purchase.id}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-[#FBD515]/10 hover:border-[#FBD515]/25 transition-all"
                      style={{ background: 'rgba(251,213,21,0.04)' }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#FBD515]/20"
                        style={{ background: 'rgba(251,213,21,0.08)' }}>
                        <ShoppingBag className="w-6 h-6 text-[#FBD515]/60" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white text-sm font-semibold truncate">{purchase.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${badgeColors[purchase.type]}`}>{purchase.type}</span>
                        </div>
                        <p className="text-[#9a8a6a] text-xs mb-1">by {purchase.artist}</p>
                        <div className="flex items-center gap-2 text-xs text-[#7a6a4a]">
                          <Calendar className="w-3 h-3" />
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                          <span className="mx-1">·</span>
                          <span className="font-mono">{purchase.txHash}</span>
                          <ExternalLink className="w-3 h-3 text-[#FBD515]/50 hover:text-[#FBD515] cursor-pointer" />
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-[#FBD515] font-bold">${purchase.price}</span>
                        <p className="text-green-400 text-xs text-right mt-0.5">✓ Complete</p>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="mt-4 p-4 rounded-2xl border border-[#FBD515]/20 flex justify-between items-center"
                    style={{ background: 'rgba(251,213,21,0.06)' }}>
                    <span className="text-[#9a8a6a] text-sm font-medium">Total Spent</span>
                    <span className="text-[#FBD515] text-xl font-bold">${totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── REWARDS TAB ── */}
          {activeTab === 'rewards' && (
            <div className="p-8">
              {/* Points Summary */}
              <div className="rounded-2xl p-5 mb-6 border border-[#FBD515]/20 flex items-center gap-5"
                style={{ background: 'linear-gradient(135deg, rgba(251,213,21,0.12) 0%, rgba(230,168,23,0.06) 100%)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-[#FBD515]/30"
                  style={{ background: 'rgba(251,213,21,0.15)' }}>
                  <Zap className="w-7 h-7 text-[#FBD515]" />
                </div>
                <div>
                  <p className="text-[#9a8a6a] text-xs uppercase tracking-widest font-semibold mb-1">Total Points</p>
                  <p className="text-3xl font-black text-[#FBD515]">{totalPoints.toLocaleString()}</p>
                  <p className="text-[#7a6a4a] text-xs mt-1">{user.rewards.filter(r => r.earned).length} of {user.rewards.length} badges earned</p>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                  <p className="text-[#9a8a6a] text-xs uppercase tracking-widest font-semibold mb-1">Next Tier</p>
                  <p className="text-white text-sm font-semibold">Platinum at 2,000 pts</p>
                  <div className="mt-2 h-1.5 w-32 bg-white/10 rounded-full overflow-hidden ml-auto">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#FBD515] to-[#E6A817]"
                      style={{ width: `${Math.min((totalPoints / 2000) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white mb-4">Badges & Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.rewards.map(reward => (
                  <div key={reward.id}
                    className={`p-5 rounded-2xl border transition-all duration-200 ${
                      reward.earned
                        ? 'border-[#FBD515]/30 hover:border-[#FBD515]/50'
                        : 'border-white/8 opacity-60 grayscale'
                    }`}
                    style={{
                      background: reward.earned
                        ? 'linear-gradient(135deg, rgba(251,213,21,0.1) 0%, rgba(10,8,6,0.9) 100%)'
                        : 'rgba(255,255,255,0.02)',
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0 mt-0.5">{reward.icon}</div>
                      <div>
                        <h3 className={`font-bold text-sm mb-1 ${reward.earned ? 'text-white' : 'text-[#7a6a4a]'}`}>{reward.title}</h3>
                        <p className={`text-xs ${reward.earned ? 'text-[#9a8a6a]' : 'text-[#5a4a2a]'}`}>{reward.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-xs font-bold flex items-center gap-1 ${reward.earned ? 'text-[#FBD515]' : 'text-[#5a4a2a]'}`}>
                        <Gift className="w-3 h-3" />
                        {reward.points} pts
                      </span>
                      {reward.earned ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          ✓ {reward.earnedDate ? new Date(reward.earnedDate).toLocaleDateString() : 'Earned'}
                        </span>
                      ) : (
                        <span className="text-xs text-[#5a4a2a]">Locked</span>
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
