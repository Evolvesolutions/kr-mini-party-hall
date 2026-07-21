import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CalendarCheck, Users, Images,
  Home, LogOut, Menu, X, Trash2, Edit, Plus, CheckCircle,
  XCircle, Clock, ChevronRight, Building2, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://kr-mini-party-hall-server.onrender.com';

function Admin() {
  const { token, user, logout, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [halls, setHalls] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [galleryForm, setGalleryForm] = useState({ title: '', image_url: '', category: '' });
  const [hallForm, setHallForm] = useState({ name: '', capacity: '', dining_capacity: '', area: '', price: '', description: '', features: '', image_url: '', time_slots: [], packages_included: '' });
  const [editingHallId, setEditingHallId] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [hallLoading, setHallLoading] = useState(false);
  const [galleryFile, setGalleryFile] = useState(null);
  const [hallFile, setHallFile] = useState(null);
  const navigate = useNavigate();

  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineForm, setOfflineForm] = useState({
    customer_name: '',
    customer_phone: '',
    event_date: '',
    time_slot: 'Morning (8:00 AM – 3:00 PM)',
    hall_id: ''
  });
  const [offlineLoading, setOfflineLoading] = useState(false);

  useEffect(() => {
    if (token && isAdmin) {
      fetchData();
    }
  }, [token, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, usersRes, galleryRes, hallsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/gallery`),
        fetch(`${API_URL}/api/halls`)
      ]);
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
      if (hallsRes.ok) setHalls(await hallsRes.json());
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}/status?new_status=${newStatus}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch { setError('Error updating booking status'); }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else setError('Error deleting booking');
    } catch { setError('Error deleting booking'); }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.image_url;
  };

  const addGalleryImage = async (e) => {
    e.preventDefault();
    setGalleryLoading(true);
    try {
      let imageUrl = galleryForm.image_url;
      if (galleryFile) imageUrl = await uploadImage(galleryFile);

      const res = await fetch(`${API_URL}/api/admin/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...galleryForm, image_url: imageUrl })
      });
      if (res.ok) {
        setGalleryForm({ title: '', image_url: '', category: '' });
        setGalleryFile(null);
        fetchData();
      }
    } catch { setError('Error adding image'); }
    finally { setGalleryLoading(false); }
  };

  const deleteGalleryImage = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { setError('Error deleting image'); }
  };

  const addHall = async (e) => {
    e.preventDefault();
    setHallLoading(true);
    try {
      let imageUrl = hallForm.image_url;
      if (hallFile) imageUrl = await uploadImage(hallFile);

      const url = editingHallId ? `${API_URL}/api/admin/halls/${editingHallId}` : `${API_URL}/api/admin/halls`;
      const method = editingHallId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...hallForm, image_url: imageUrl, capacity: parseInt(hallForm.capacity), dining_capacity: parseInt(hallForm.dining_capacity) || 0, price: parseFloat(hallForm.price) })
      });
      if (res.ok) {
    setHallForm({ name: '', capacity: '', dining_capacity: '', area: '', price: '', description: '', features: '', image_url: '', time_slots: [], packages_included: '' });
        setHallFile(null);
        setEditingHallId(null);
        fetchData();
      } else {
        const errorData = await res.json();
        setError(errorData.detail || 'Error saving hall');
      }
    } catch { setError('Error saving hall'); }
    finally { setHallLoading(false); }
  };

  const cancelEdit = () => {
    setEditingHallId(null);
    setHallForm({ name: '', capacity: '', dining_capacity: '', area: '', price: '', description: '', features: '', image_url: '', time_slots: [], packages_included: '' });
    setHallFile(null);
  };

  const editHall = (hall) => {
    setEditingHallId(hall.id);
    setHallForm({
      name: hall.name,
      capacity: hall.capacity.toString(),
      dining_capacity: (hall.dining_capacity || 0).toString(),
      area: hall.area,
      price: hall.price.toString(),
      description: hall.description,
      features: hall.features,
      image_url: hall.image_url,
      time_slots: hall.time_slots || [],
      packages_included: hall.packages_included || ''
    });
    setHallFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHall = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/halls/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { setError('Error deleting hall'); }
  };

  const addOfflineBooking = async (e) => {
    e.preventDefault();
    setOfflineLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/offline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(offlineForm)
      });
      if (res.ok) {
        setOfflineModalOpen(false);
        setOfflineForm({
          customer_name: '',
          customer_phone: '',
          event_date: '',
          time_slot: 'Morning (8:00 AM – 3:00 PM)',
          hall_id: ''
        });
        fetchData();
      } else {
        const errorData = await res.json();
        setError(errorData.detail || 'Error creating offline booking');
      }
    } catch {
      setError('Error creating offline booking');
    } finally {
      setOfflineLoading(false);
    }
  };

  if (!token || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Admin privileges required to access this page.</p>
          <button onClick={() => navigate('/login')} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: bookings.filter(b => b.status === 'pending').length },
    { id: 'users', label: 'Users', icon: Users, badge: users.length },
    { id: 'gallery', label: 'Gallery', icon: Images, badge: gallery.length },
    { id: 'halls', label: 'Halls', icon: Building2, badge: halls.length },
  ];

  const stats = [
    { label: 'Total Bookings', value: bookings.length, color: 'from-purple-500 to-purple-700', icon: CalendarCheck },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'from-yellow-400 to-yellow-600', icon: Clock },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'from-green-500 to-green-700', icon: CheckCircle },
    { label: 'Total Users', value: users.length, color: 'from-pink-500 to-pink-700', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-40 flex flex-col w-64 h-full bg-gradient-to-b from-[#1a0533] to-[#2d0a5e] shadow-2xl"
          >
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">Grand Kalyana</h1>
                <p className="text-purple-300 text-xs mt-0.5">Admin Panel</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
              {navItems.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${activeTab === id
                      ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm'
                      : 'text-purple-200 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={activeTab === id ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300'} />
                    {label}
                  </div>
                  {badge > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === id ? 'bg-purple-400 text-white' : 'bg-white/20 text-purple-200'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Bottom links */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-sm text-purple-200 hover:bg-white/10 hover:text-white rounded-xl transition-all"
              >
                <Home size={18} className="text-purple-400" />
                Go to Home
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium capitalize">{activeTab}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Users size={15} className="text-purple-600" />
            </div>
            <span className="hidden sm:block">{user?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <XCircle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {stats.map(({ label, value, color, icon: Icon }) => (
                      <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}>
                        <div className="flex items-center justify-between mb-4">
                          <Icon size={24} className="opacity-80" />
                          <span className="text-3xl font-bold">{value}</span>
                        </div>
                        <p className="text-sm font-medium opacity-80">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Recent Bookings</h3>
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{b.customer_name}</p>
                          <p className="text-xs text-gray-400">{new Date(b.event_date).toLocaleDateString()} · {b.event_type}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{b.status}</span>
                      </div>
                    ))}
                    {bookings.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No bookings yet</p>}
                  </div>
                </motion.div>
              )}

              {/* Bookings */}
              {activeTab === 'bookings' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Bookings ({bookings.length})</h2>
                    <button onClick={() => setOfflineModalOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2">
                      <Plus size={16} /> Add Offline Booking
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {bookings.length === 0 ? (
                      <p className="text-gray-400 text-center py-12">No bookings found</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50">
                            <tr>
                              {['Customer', 'Contact', 'Event', 'Date & Time', 'Guests', 'Address & Req', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {bookings.map(b => (
                              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                  <p className="text-sm font-semibold text-gray-800">{b.customer_name}</p>
                                  <p className="text-xs text-gray-400">{b.customer_email}</p>
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">{b.customer_phone}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{b.event_type}</td>
                                <td className="px-5 py-4">
                                  <p className="text-sm text-gray-800">{new Date(b.event_date).toLocaleDateString()}</p>
                                  <p className="text-xs text-gray-400">{b.time_slot || '—'}</p>
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-600">{b.guest_count}</td>
                                <td className="px-5 py-4 max-w-[200px]">
                                  <p className="text-xs text-gray-600 truncate" title={b.customer_address}>{b.customer_address || 'No Address'}</p>
                                  <p className="text-xs text-gray-400 truncate mt-0.5" title={b.special_requirements}>{b.special_requirements || 'No Requirements'}</p>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                      b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{b.status}</span>
                                </td>
                                <td className="px-5 py-4 text-sm space-x-2">
                                  {b.status === 'pending' && (
                                    <>
                                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-green-600 hover:text-green-800 font-medium">Confirm</button>
                                      <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="text-red-500 hover:text-red-700 font-medium">Cancel</button>
                                    </>
                                  )}
                                  <button onClick={() => deleteBooking(b.id)} className="text-gray-500 hover:text-red-600 font-medium flex items-center gap-1">
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Users */}
              {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Users ({users.length})</h2>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            {['Name', 'Email', 'Role'].map(h => (
                              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 text-sm text-gray-800 font-medium">{u.name || '—'}</td>
                              <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                              <td className="px-5 py-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${u.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                  }`}>{u.is_admin ? 'Admin' : 'User'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {activeTab === 'gallery' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery Management</h2>

                  {/* Add Image Form */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Plus size={18} className="text-purple-600" /> Add New Image</h3>
                    <form onSubmit={addGalleryImage} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={galleryForm.title}
                          onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          placeholder="e.g. Grand Wedding Setup"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Upload Image *</label>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={e => {
                            if (e.target.files[0]) {
                              setGalleryFile(e.target.files[0]);
                              setGalleryForm({ ...galleryForm, image_url: URL.createObjectURL(e.target.files[0]) });
                            }
                          }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                        <input
                          type="text"
                          value={galleryForm.category}
                          onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                          placeholder="e.g. Wedding, Reception"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        {galleryForm.image_url && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1">Preview:</p>
                            <img src={galleryForm.image_url?.replace('http://localhost:8000', API_URL)} alt="preview" className="h-24 w-40 object-cover rounded-lg border" onError={e => e.target.style.display = 'none'} />
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={galleryLoading}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                          <Plus size={16} />
                          {galleryLoading ? 'Adding...' : 'Add to Gallery'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Gallery Grid */}
                  {gallery.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
                      <Images size={40} className="mx-auto mb-3 opacity-40" />
                      <p>No gallery images yet. Add your first image above!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.map(img => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group rounded-xl overflow-hidden bg-white shadow-sm aspect-square"
                        >
                          <img src={img.image_url?.replace('http://localhost:8000', API_URL)} alt={img.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center px-2">
                              <p className="text-white text-sm font-semibold mb-1">{img.title}</p>
                              {img.category && <p className="text-white/70 text-xs mb-3">{img.category}</p>}
                              <button
                                onClick={() => deleteGalleryImage(img.id)}
                                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Halls */}
              {activeTab === 'halls' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Halls Management</h2>

                  {/* Add Hall Form */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      {editingHallId ? <Edit size={18} className="text-purple-600" /> : <Plus size={18} className="text-purple-600" />}
                      {editingHallId ? 'Edit Hall' : 'Add New Hall'}
                    </h3>
                    <form onSubmit={addHall} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                        <input type="text" required value={hallForm.name} onChange={e => setHallForm({ ...hallForm, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Upload Image {editingHallId ? '(leave empty to keep current)' : '*'}</label>
                        <input type="file" accept="image/*" required={!editingHallId} onChange={e => {
                          if (e.target.files[0]) {
                            setHallFile(e.target.files[0]);
                            setHallForm({ ...hallForm, image_url: URL.createObjectURL(e.target.files[0]) });
                          }
                        }} className="w-full border border-gray-200 rounded-lg px-3 py-[7px] text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Capacity (number) *</label>
                        <input type="number" required value={hallForm.capacity} onChange={e => setHallForm({ ...hallForm, capacity: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Dining Capacity (number)</label>
                        <input type="number" value={hallForm.dining_capacity} onChange={e => setHallForm({ ...hallForm, dining_capacity: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="e.g. 300" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Area (e.g. 15,000 sq ft) *</label>
                        <input type="text" required value={hallForm.area} onChange={e => setHallForm({ ...hallForm, area: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price (number) *</label>
                        <input type="number" step="0.01" required value={hallForm.price} onChange={e => setHallForm({ ...hallForm, price: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Features (one per line) *</label>
                        <textarea required value={hallForm.features} onChange={e => setHallForm({ ...hallForm, features: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" rows="3" placeholder="e.g. Premium Sound System&#10;Crystal Chandeliers&#10;VIP Lounge"></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Packages Included (one per line)</label>
                        <textarea value={hallForm.packages_included} onChange={e => setHallForm({ ...hallForm, packages_included: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" rows="3" placeholder="e.g. Basic Package&#10;Premium Package"></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-2">Available Times *</label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hallForm.time_slots.includes('Morning (8 AM - 3 PM)')}
                              onChange={(e) => {
                                const newSlots = e.target.checked
                                  ? [...hallForm.time_slots, 'Morning (8 AM - 3 PM)']
                                  : hallForm.time_slots.filter(s => s !== 'Morning (8 AM - 3 PM)');
                                setHallForm({ ...hallForm, time_slots: newSlots });
                              }}
                              className="rounded text-purple-600 focus:ring-purple-400 w-4 h-4"
                            />
                            Morning (8 AM - 3 PM)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hallForm.time_slots.includes('Evening (5 PM - 11 PM)')}
                              onChange={(e) => {
                                const newSlots = e.target.checked
                                  ? [...hallForm.time_slots, 'Evening (5 PM - 11 PM)']
                                  : hallForm.time_slots.filter(s => s !== 'Evening (5 PM - 11 PM)');
                                setHallForm({ ...hallForm, time_slots: newSlots });
                              }}
                              className="rounded text-purple-600 focus:ring-purple-400 w-4 h-4"
                            />
                            Evening (5 PM - 11 PM)
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Description *</label>
                        <textarea required value={hallForm.description} onChange={e => setHallForm({ ...hallForm, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" rows="3"></textarea>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-3">
                        <button type="submit" disabled={hallLoading} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                          {editingHallId ? <Edit size={16} /> : <Plus size={16} />} 
                          {hallLoading ? 'Saving...' : (editingHallId ? 'Update Hall' : 'Add Hall')}
                        </button>
                        {editingHallId && (
                          <button type="button" onClick={cancelEdit} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Halls List */}
                  {halls.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
                      <Building2 size={40} className="mx-auto mb-3 opacity-40" />
                      <p>No halls yet. Add your first hall above!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {halls.map(hall => (
                        <div key={hall.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 h-48 sm:h-auto relative">
                            <img src={hall.image_url?.replace('http://localhost:8000', API_URL)} alt={hall.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800">{hall.name}</h4>
                                <span className="text-purple-600 font-bold text-sm">₹{hall.price}</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1"><Users size={12} className="inline mr-1" /> {hall.capacity} Guests | <Maximize size={12} className="inline mr-1" /> {hall.area}</p>
                              {hall.packages_included && hall.packages_included.trim() !== "" && (
                                <p className="text-xs text-blue-600 mb-1 font-medium">Included: {hall.packages_included}</p>
                              )}
                              {hall.time_slots && hall.time_slots.length > 0 && (
                                <p className="text-xs text-purple-600 mb-1 font-medium"><Clock size={12} className="inline mr-1" /> {hall.time_slots.join(', ')}</p>
                              )}
                              <p className="text-xs text-gray-600 line-clamp-2">{hall.description}</p>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                              <button onClick={() => editHall(hall)} className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium">
                                <Edit size={12} /> Edit
                              </button>
                              <button onClick={() => deleteHall(hall.id)} className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium">
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
      {/* Offline Booking Modal */}
      {offlineModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-bold text-lg text-gray-800">Add Offline Booking</h3>
              <button onClick={() => setOfflineModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addOfflineBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name *</label>
                <input type="text" required value={offlineForm.customer_name} onChange={e => setOfflineForm({ ...offlineForm, customer_name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Phone (Optional)</label>
                <input type="text" value={offlineForm.customer_phone} onChange={e => setOfflineForm({ ...offlineForm, customer_phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hall *</label>
                <select required value={offlineForm.hall_id} onChange={e => setOfflineForm({ ...offlineForm, hall_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                  <option value="">Select a Hall</option>
                  {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Event Date *</label>
                <input type="date" required value={offlineForm.event_date} onChange={e => setOfflineForm({ ...offlineForm, event_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Time Slot *</label>
                <select required value={offlineForm.time_slot} onChange={e => setOfflineForm({ ...offlineForm, time_slot: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                  <option value="Morning (8:00 AM – 3:00 PM)">Morning</option>
                  <option value="Evening (5:00 PM – 11:00 PM)">Evening</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" disabled={offlineLoading} className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {offlineLoading ? 'Saving...' : 'Block Date'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Admin;
