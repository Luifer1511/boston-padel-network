import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ShieldCheck, Plus, CheckCircle2, X, Phone, User, Crown, Info, LogOut } from 'lucide-react';
import { supabase } from './supabase';

const CLUBS = [
  { id: 'all', name: 'All Clubs', price: null, area: 'Greater Boston' },
  { id: 'padelhub', name: 'PADELHUB', price: 22.00, area: 'Seaport / Southie' },
  { id: 'sensa', name: 'Sensa Padel', price: 22.50, area: 'Hyde Park' },
  { id: 'dedham', name: 'Padel Boston', price: 22.50, area: 'Dedham' },
];

const TIERS = [
  { label: 'Beginner', range: '< 1.8', color: 'bg-slate-700 text-slate-200' },
  { label: 'High Beginner', range: '1.8 – 2.3', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  { label: 'Low Intermediate', range: '2.3 – 2.6', color: 'bg-teal-500/10 text-teal-400 border border-teal-500/20' },
  { label: 'Intermediate', range: '2.6 – 3.1', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  { label: 'High Intermediate', range: '3.1 – 3.7', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  { label: 'Low Advanced', range: '3.7 – 4.5', color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  { label: 'Advanced', range: '4.5+', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
];

// Franjas horarias flexibles y modernas
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '08:00 AM – 12:00 PM' },
  { id: 'noon', label: 'Midday / Lunch', time: '12:00 PM – 03:00 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '03:00 PM – 06:00 PM' },
  { id: 'evening', label: 'Evening / Prime', time: '06:00 PM – 10:00 PM' },
];

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [confirmedMatch, setConfirmedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  
  // Disponibilidad flexible por franjas
  const [selectedSlots, setSelectedSlots] = useState(['morning', 'evening']);
  
  const [toastMsg, setToastMsg] = useState('');
  
  const [playerName, setPlayerName] = useState('Luis F.');
  const [playerPhone, setPlayerPhone] = useState('+1 617 000 0000');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClubId, setNewClubId] = useState('padelhub');
  
  const [newDate, setNewDate] = useState('2026-09-01');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDuration, setNewDuration] = useState('90 Mins');
  const [newTier, setNewTier] = useState('Low Intermediate');

  // Cargar desde Supabase al abrir la app
  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('id', { ascending: false });
        
      if (!error && data) {
        setMatches(data);
      }
    };
    fetchMatches();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const toggleSlot = (id) => {
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(s => s !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  const handleSavePreferences = () => {
    showToast('Availability preferences saved!');
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    const club = CLUBS.find(c => c.id === newClubId) || CLUBS[1];
    const formattedTimeWindow = `${newTime} (${newDuration})`;

    const newMatchObj = {
      clubId: club.id,
      clubName: club.name,
      area: club.area,
      time: formattedTimeWindow,
      date: newDate,
      tier: newTier,
      price: club.price,
      spotsFilled: 1,
      totalSpots: 4,
      players: [
        { name: playerName, phone: playerPhone, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' }
      ]
    };

    const { data, error } = await supabase
      .from('matches')
      .insert([newMatchObj])
      .select();

    if (!error && data) {
      setMatches([data[0], ...matches]);
      setShowCreateModal(false);
      showToast('Match published successfully!');
    } else {
      console.error(error);
      showToast('Error publishing match.');
    }
  };

  const handleConfirmJoin = async (e) => {
    e.preventDefault();
    const matchToUpdate = matches.find(m => m.id === selectedMatch.id);
    
    const updatedPlayers = [
      ...matchToUpdate.players,
      { name: playerName, phone: playerPhone, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' }
    ];
    const newSpotsFilled = matchToUpdate.spotsFilled + 1;

    const { data, error } = await supabase
      .from('matches')
      .update({ spotsFilled: newSpotsFilled, players: updatedPlayers })
      .eq('id', selectedMatch.id)
      .select();

    if (!error && data) {
      const updated = matches.map(m => m.id === selectedMatch.id ? data[0] : m);
      setMatches(updated);
      setSelectedMatch(null);
      if (newSpotsFilled === 4) {
        setConfirmedMatch(data[0]);
      } else {
        showToast('Successfully joined the match!');
      }
    } else {
      console.error(error);
    }
  };

  const handleLeaveMatch = async (matchId) => {
    const matchToUpdate = matches.find(m => m.id === matchId);
    const filteredPlayers = matchToUpdate.players.filter(p => p.name !== playerName);
    const newSpotsFilled = matchToUpdate.spotsFilled - 1;

    const { data, error } = await supabase
      .from('matches')
      .update({ spotsFilled: newSpotsFilled, players: filteredPlayers })
      .eq('id', matchId)
      .select();

    if (!error && data) {
      const updated = matches.map(m => m.id === matchId ? data[0] : m);
      setMatches(updated);
      showToast('You left the match.');
    }
  };

  const filteredMatches = matches.filter(m => 
    selectedClub === 'all' || m.clubId === selectedClub
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans border-x border-slate-900 shadow-2xl relative pb-16">
      
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-2 rounded-full font-bold text-xs shadow-lg shadow-emerald-500/20 z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <header className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black tracking-tight text-emerald-400">BOSTON PADEL</h1>
          <p className="text-[11px] text-slate-400 font-medium">Autonomous Matchmaking Network</p>
        </div>
        <div className="text-right flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
          <User size={12} className="text-emerald-400" />
          <span className="text-[11px] font-bold text-slate-200">{playerName.split(' ')[0]}</span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">2.55</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-900 mx-4 mt-3 rounded-xl border border-slate-800 text-xs">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`py-2 text-center font-bold rounded-lg transition ${activeTab === 'feed' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'}`}
        >
          Open Matches
        </button>
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`py-2 text-center font-bold rounded-lg transition ${activeTab === 'schedule' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'}`}
        >
          My Availability
        </button>
      </div>

      {activeTab === 'feed' ? (
        <main className="flex-1 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1 mr-2">
              {CLUBS.map(club => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub(club.id)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    selectedClub === club.id 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {club.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-1.5 px-2.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 flex-shrink-0"
            >
              <Plus size={14} /> Host
            </button>
          </div>

          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-300">
              <strong className="text-emerald-400">Smart Match:</strong> 4 schedules auto-confirm courts.
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">FLEX TIME</span>
          </div>

          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-300">No active matches</h3>
                  <p className="text-xs text-slate-500 mt-1">There are no matches available for this club right now.</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="text-emerald-400 font-bold text-xs hover:text-emerald-300"
                >
                  + Be the first to host one
                </button>
              </div>
            ) : (
              filteredMatches.map(match => {
                const hasJoined = match.players.some(p => p.name === playerName);
                const isFull = match.spotsFilled >= match.totalSpots;
                const tierConfig = TIERS.find(t => t.label === match.tier) || TIERS[3];

                return (
                  <div key={match.id} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <MapPin size={13} />
                          {match.clubName} <span className="text-slate-500 font-normal">({match.area})</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">{match.date}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> {match.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tierConfig.color}`}>
                          {match.tier}
                        </span>
                        <p className="text-[11px] font-bold text-slate-300 mt-1">${match.price.toFixed(2)}/pp</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5 relative">
                          {match.players.map((p, i) => (
                            <div key={i} className="relative z-10">
                              <img src={p.avatar} alt={p.name} title={p.name} className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
                              {i === 0 && (
                                <div className="absolute -top-1.5 -right-1 bg-amber-400 rounded-full p-0.5 border border-slate-900 shadow-sm">
                                  <Crown size={8} className="text-slate-950" />
                                </div>
                              )}
                            </div>
                          ))}
                          {Array.from({ length: match.totalSpots - match.spotsFilled }).map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-dashed border-slate-700 bg-slate-800/40 flex items-center justify-center text-slate-500 z-0 relative ml-[-6px]">
                              <Plus size={12} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 ml-1">
                          {match.spotsFilled}/4 
                        </span>
                      </div>

                      {hasJoined ? (
                        <button
                          onClick={() => handleLeaveMatch(match.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-800 text-rose-400 border border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/80"
                        >
                           <LogOut size={13} /> Leave
                        </button>
                      ) : isFull ? (
                        <button
                           disabled
                           className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 cursor-not-allowed"
                        >
                          Match Full
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10"
                        >
                          Join • ${match.price.toFixed(2)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      ) : (
        /* Schedule Tab */
        <main className="flex-1 p-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative z-10">
            <h2 className="text-sm font-bold text-white">Your Player Identity</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 transition" 
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">WhatsApp</label>
                <input 
                  type="text" 
                  value={playerPhone} 
                  onChange={(e) => setPlayerPhone(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 transition" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-white">Preferred Clubs</h2>
            <div className="space-y-2">
              {CLUBS.filter(c => c.id !== 'all').map(club => (
                <label key={club.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs cursor-pointer hover:border-slate-700 transition">
                  <div>
                    <span className="font-semibold text-slate-200">{club.name}</span>
                    <span className="text-slate-500 ml-1.5 font-normal">({club.area})</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 rounded" />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Daily Time Windows</h2>
              <p className="text-xs text-slate-400 mt-1">Select your preferred time slots for automated matching:</p>
            </div>

            <div className="space-y-2 text-xs">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlots.includes(slot.id);
                return (
                  <button 
                    key={slot.id} 
                    onClick={() => toggleSlot(slot.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex justify-between items-center ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-200">{slot.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{slot.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                      {isSelected ? 'Active' : 'Tap to add'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleSavePreferences}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition mt-2"
            >
              Save Availability
            </button>
          </div>
        </main>
      )}

      {/* Modal: Join Match */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Join Match • {selectedMatch.clubName}</h3>
            
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Session:</span>
                <span className="text-slate-200 font-medium">{selectedMatch.date} • {selectedMatch.time}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Split Amount:</span>
                <span className="text-emerald-400 font-black text-sm">${selectedMatch.price.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmJoin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Your Name</label>
                <input 
                  type="text" 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">WhatsApp / Cell</label>
                <input 
                  type="text" 
                  value={playerPhone} 
                  onChange={(e) => setPlayerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none" 
                  required
                />
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-2.5">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Pre-authorization only. Billed when match hits 4/4 players.</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Confirm & Pre-Auth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Match Complete (4/4) */}
      {confirmedMatch && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-black text-white">MATCH CONFIRMED (4/4)</h3>
              <p className="text-xs text-slate-400">{confirmedMatch.clubName} • {confirmedMatch.time}</p>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-slate-300 mb-1">Confirmed Lineup:</p>
              {confirmedMatch.players.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-900 last:border-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-200">{p.name}</span>
                    {i === 0 && <Crown size={10} className="text-amber-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Phone size={10} /> {p.phone}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setConfirmedMatch(null)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Done & Open Match Group
            </button>
          </div>
        </div>
      )}

      {/* Modal: Host Match */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Host a Match</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Club Venue</label>
                <select 
                  value={newClubId} 
                  onChange={(e) => setNewClubId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="padelhub">PADELHUB ($22.00/pp)</option>
                  <option value="sensa">Sensa Padel ($22.50/pp)</option>
                  <option value="dedham">Padel Boston ($22.50/pp)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none" 
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Start Time</label>
                <select 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Duration</label>
                <select 
                  value={newDuration} 
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="60 Mins">60 Mins (1 Hour)</option>
                  <option value="90 Mins">90 Mins (1.5 Hours)</option>
                  <option value="120 Mins">120 Mins (2 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Skill Tier</label>
                <select 
                  value={newTier} 
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  {TIERS.map(t => (
                    <option key={t.label} value={t.label}>{t.label} ({t.range})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/10 mt-2"
              >
                Publish Match (You are Host)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}