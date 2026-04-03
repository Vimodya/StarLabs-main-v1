import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProfile } from '@/services/api';
import {
  User, Music, ShoppingCart, History, Trophy,
  LogOut, Star, MapPin, Calendar, Edit3, Save, X,
  ShoppingBag, Trash2, ExternalLink, Users, Zap, Gift,
  Bell, CheckCircle, Clock, Package
} from 'lucide-react';

type TabId = 'profile' | 'celebrities' | 'products' | 'orders' | 'notifications' | 'cart' | 'rewards';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');

  useEffect(() => {
    if (user) {
      // Re-fetch profile to get the latest followed lists, products, etc.
      fetchUserProfile().then((res) => {
        // The API response might have the user object nested or top-level.
        // AuthContext's mapApiUser would be better here, but we can just use updateUser.
        const userData = res.user ?? res;
        // Since updateUser in AuthContext expects a Partial<User>, we map relevant fields.
        updateUser({
          followedCelebrityList: userData.followedCelebrityList || [],
          buyProductList: userData.buyProductList || [],
          notifiedProductList: userData.notifiedProductList || [],
          orders: userData.orders || []
        });
      }).catch(err => console.error("Failed to refresh profile:", err));
    }
  }, []);

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
    { id: 'celebrities', label: 'Celebrities', icon: <Users className="w-4 h-4" /> },
    { id: 'products', label: 'My Products', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'notifications', label: 'Waitlist', icon: <Bell className="w-4 h-4" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-4 h-4" /> },
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
                { label: 'Orders', value: user.orders?.length || 0 },
                { label: 'Followed', value: (user.followedCelebrityList?.length || 0) + user.followedArtists.length },
                { label: 'Waitlist', value: user.notifiedProductList?.length || 0 },
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

          {/* ── CELEBRITIES TAB ── */}
          {activeTab === 'celebrities' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">Followed Celebrities 
                <span className="text-[#FBD515] text-base ml-2">
                  ({(user.followedCelebrityList?.length || 0) + (user.followedArtists?.length || 0)})
                </span>
              </h2>
              
              <div className="space-y-8">
                {/* New Celebrity List */}
                {user.followedCelebrityList && user.followedCelebrityList.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.followedCelebrityList.map(celeb => (
                      <div key={celeb.id || celeb._id}
                        className="group p-4 rounded-2xl border border-[#FBD515]/10 hover:border-[#FBD515]/30 transition-all duration-200 cursor-pointer overflow-hidden relative"
                        style={{ background: 'rgba(251,213,21,0.04)' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#FBD515]/30">
                            {celeb.profilePicture ? (
                              <img src={celeb.profilePicture} alt={celeb.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FBD515] to-[#E6A817] text-[#0a0806] font-bold text-xl">
                                {celeb.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-white font-semibold text-sm group-hover:text-[#FBD515] transition-colors">{celeb.name}</h3>
                              {celeb.isVerified && <CheckCircle className="w-3 h-3 text-blue-400 fill-blue-400/20" />}
                            </div>
                            <p className="text-[#9a8a6a] text-xs mt-0.5">{celeb.category}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FBD515]/10 text-[#FBD515]/80 border border-[#FBD515]/20 mt-2 inline-block font-semibold">Following</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legacy Artist List */}
                {user.followedArtists.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-[#9a8a6a] uppercase tracking-wider mb-4">Artists</h3>
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {((user.followedCelebrityList?.length || 0) === 0 && user.followedArtists.length === 0) && (
                  <div className="text-center py-16">
                    <Music className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                    <p className="text-[#9a8a6a]">You haven't followed any celebrities yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY PRODUCTS TAB ── */}
          {activeTab === 'products' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">Purchased Products 
                <span className="text-[#FBD515] text-base ml-2">({user.buyProductList?.length || 0})</span>
              </h2>
              {(!user.buyProductList || user.buyProductList.length === 0) ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                  <p className="text-[#9a8a6a]">You haven't purchased any products yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.buyProductList.map(product => (
                    <div key={product.id || product._id}
                      className="group bg-black/40 rounded-2xl border border-[#FBD515]/10 overflow-hidden hover:border-[#FBD515]/30 transition-all">
                      <div className="aspect-square relative overflow-hidden">
                        <img src={product.images?.[0] || product.image} alt={product.name || product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-[10px] font-bold uppercase border border-green-500/30">
                          Owned
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-white font-bold text-sm truncate">{product.name || product.title}</h3>
                          <span className="text-[#FBD515] font-bold text-xs">
                            {product.currency === 'USD' ? '$' : product.currency} {product.price}
                          </span>
                        </div>
                        <p className="text-[#9a8a6a] text-xs line-clamp-2">{product.subtitle || 'Purchased Product'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NOTIFICATIONS / WAITLIST TAB ── */}
          {activeTab === 'notifications' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">Product Waitlist 
                <span className="text-[#FBD515] text-base ml-2">({user.notifiedProductList?.length || 0})</span>
              </h2>
              {(!user.notifiedProductList || user.notifiedProductList.length === 0) ? (
                <div className="text-center py-16">
                  <Bell className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                  <p className="text-[#9a8a6a]">Your waitlist is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.notifiedProductList.map(product => (
                    <div key={product.id || product._id}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-[#FBD515]/10 bg-black/40 hover:border-[#FBD515]/30 transition-all">
                      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#FBD515]/20">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-white font-bold text-sm">{product.title}</h3>
                        <p className="text-[#9a8a6a] text-xs mt-1">{product.subtitle}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FBD515]/10 text-[#FBD515] border border-[#FBD515]/20 uppercase font-bold tracking-wider">
                            {product.status || 'Coming Soon'}
                          </span>
                        </div>
                      </div>
                      <button className="p-2.5 rounded-xl border border-[#FBD515]/20 text-[#FBD515] hover:bg-[#FBD515]/10 transition-colors">
                        <Bell className="w-4 h-4" />
                      </button>
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

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">Order History 
                <span className="text-[#FBD515] text-base ml-2">({user.orders?.length || 0})</span>
              </h2>
              {(!user.orders || user.orders.length === 0) ? (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-[#FBD515]/30 mx-auto mb-4" />
                  <p className="text-[#9a8a6a]">No orders found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders.map(order => (
                    <div key={order._id}
                      className="p-5 rounded-2xl border border-[#FBD515]/10 bg-black/40 hover:border-[#FBD515]/20 transition-all shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FBD515]/10 flex items-center justify-center border border-[#FBD515]/20">
                            <Package className="w-5 h-5 text-[#FBD515]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#7a6a4a] font-semibold uppercase tracking-wider mb-0.5">Order ID</p>
                            <p className="text-white font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs text-[#7a6a4a] font-semibold uppercase tracking-wider mb-0.5">Date</p>
                            <p className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#7a6a4a] font-semibold uppercase tracking-wider mb-0.5">Total</p>
                            <p className="text-[#FBD515] font-bold text-base">${order.totalAmount.toFixed(2)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                            order.status === 'completed' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}>
                            {order.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {order.status}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-[#9a8a6a] font-mono">x{item.quantity}</span>
                              <span className="text-white font-medium">{item.productName}</span>
                            </div>
                            <span className="text-[#9a8a6a]">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
