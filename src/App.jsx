import React, { useState } from 'react';
import { Clock, MapPin, ShieldCheck, Plus, CheckCircle2, X, MessageSquare, Phone, User } from 'lucide-react';

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

const INITIAL_MATCHES = [
  {
    id: '1',
    clubId: 'padelhub',
    clubName: 'PADELHUB',
    area: 'Seaport / Southie',
    time: '10:00 AM – 11:30 AM',
    date: 'Tuesday, Sep 1',
    tier: 'Low Intermediate',
    price: 22.00,
    spotsFilled: 3,
    totalSpots: 4,
    players: [
      { name: 'Alex M.', phone: '+1 617-555-0192', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
      { name: 'David K.', phone: '+1 617-555-0144', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
      { name: 'Sofia R.', phone: '+1 857-555-0188', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' }
    ]
  },
  {
    id: '2',
    clubId: 'sensa',
    clubName: 'Sensa Padel',
    area: 'Hyde Park',
    time: '11:30 AM – 1:00 PM',
    date: 'Tuesday, Sep 1',
    tier: 'Intermediate',
    price: 22.50,
    spotsFilled: 2,
    totalSpots: 4,
    players: [
      { name: 'Lucas T.', phone: '+1 617-555-0111', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
      { name: 'Emma W.', phone: '+1 617-555-0122', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' }
    ]
  }
];

const SLOTS = [
  'Mon 10:00 AM – 1:00 PM',
  'Tue 11:30 AM – 2:30 PM',
  'Wed 10:00 AM – 1:00 PM',
  'Thu 11:30 AM – 2:30 PM',
  'Fri 09:30 AM – 12:30 PM'
];

export default function App() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [confirmedMatch, setConfirmedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedSlots, setSelectedSlots] = useState(['Mon 10:00 AM – 1:00 PM']);
  const [savedStatus, setSavedStatus] = useState(false);
  
  // Perfil del Jugador
  const [playerName, setPlayerName] = useState('Luis F.');
  const [playerPhone, setPlayerPhone] = useState('+1 617 000 0000');

  // Modal Host
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClubId, setNewClubId] = useState('padelhub');
  const [newDate, setNewDate] = useState('Thursday, Sep 3');
  const [newTime, setNewTime] = useState('10:00 AM – 11:30 AM');
  const [newTier, setNewTier] = useState('Low Intermediate');

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleCreateMatch = (e) => {
    e.preventDefault();
    const club = CLUBS.find(c => c.id === newClubId) || CLUBS[1];
    const newMatchObj = {
      id: Date.now().toString(),
      clubId: club.id,
      clubName: club.name,
      area: club.area,
      time: newTime,
      date: newDate,
      tier: newTier,
      price: club.price,
      spotsFilled: 1,
      totalSpots: 4,
      players: [
        { name: playerName, phone: playerPhone, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' }
      ]
    };

    setMatches([newMatchObj, ...matches]);
    setShowCreateModal(false);
  };

  const handleConfirmJoin = (e) => {
    e.preventDefault();
    const updated = matches.map(m => {
      if (m.id === selectedMatch.id) {
        const updatedPlayers = [
          ...m.players,
          { name: playerName, phone: playerPhone, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' }
        ];
        const newObj = {
          ...m,
          spotsFilled: m.spotsFilled + 1,
          players: updatedPlayers
        };
        if (newObj.spotsFilled === 4) {
          setConfirmedMatch(newObj);
        }
        return newObj;
      }
      return m;
    });

    setMatches(updated);
    setSelectedMatch(null);
  };

  const filteredMatches = matches.filter(m => 
    selectedClub === 'all' || m.clubId === selectedClub
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans border-x border-slate-900 shadow-2xl relative pb-16">
      {/* Header */}
      <header className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black tracking-tight text-emerald-400">BOSTON PADEL</h1>
          <p className="text-[11px] text-slate-400 font-medium">Multi-Club Autonomous Matchmaking</p>
        </div>
        <div className="text-right flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
          <User size={12} className="text-emerald-400" />
          <span className="text-[11px] font-bold text-slate-200">{playerName}</span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">2.55</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-900 mx-4 mt-3 rounded-xl border border-slate-800 text-xs">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`py-2 text-center font-bold rounded-lg transition ${activeTab === 'feed' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'}`}
        >
          Open Daytime Matches
        </button>
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`py-2 text-center font-bold rounded-lg transition ${activeTab === 'schedule' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'}`}
        >
          My Weekly Schedule
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
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">90 MINS</span>
          </div>

          <div className="space-y-3">
            {filteredMatches.map(match => {
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
                      <div className="flex -space-x-1.5">
                        {match.players.map((p, i) => (
                          <img key={i} src={p.avatar} alt={p.name} title={p.name} className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
                        ))}
                        {Array.from({ length: match.totalSpots - match.spotsFilled }).map((_, i) => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-dashed border-slate-700 bg-slate-800/40 flex items-center justify-center text-slate-500">
                            <Plus size={12} />
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {match.spotsFilled}/4 Players
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedMatch(match)}
                      disabled={hasJoined || isFull}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        hasJoined 
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' 
                          : isFull
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <CheckCircle2 size={13} /> You're In
                        </>
                      ) : isFull ? (
                        'Match Full'
                      ) : (
                        `Join • $${match.price.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        /* Schedule Tab */
        <main className="flex-1 p-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-white">Your Player Identity</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" 
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">WhatsApp / Phone</label>
                <input 
                  type="text" 
                  value={playerPhone} 
                  onChange={(e) => setPlayerPhone(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-white">Select Preferred Clubs</h2>
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
              <h2 className="text-sm font-bold text-white">Your Free Daytime Windows</h2>
              <p className="text-xs text-slate-400 mt-1">Tap slots to toggle availability:</p>
            </div>

            <div className="space-y-2 text-xs">
              {SLOTS.map((slot) => {
                const isSelected = selectedSlots.includes(slot);
                return (
                  <button 
                    key={slot} 
                    onClick={() => toggleSlot(slot)}
                    className={`w-full p-3 rounded-xl border text-left font-medium transition flex justify-between items-center ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{slot}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                      {isSelected ? 'Available' : 'Tap to add'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition mt-2 flex items-center justify-center gap-1.5"
            >
              {savedStatus ? (
                <>
                  <CheckCircle2 size={16} /> Preferences Saved!
                </>
              ) : (
                'Save Weekly Preferences'
              )}
            </button>
          </div>
        </main>
      )}

      {/* Modal: Join Match & Confirm Phone */}
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">WhatsApp / Cell for Match Group</label>
                <input 
                  type="text" 
                  value={playerPhone} 
                  onChange={(e) => setPlayerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" 
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

      {/* Modal: Match Complete Celebration (4/4 Players) */}
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
                  <span className="font-medium text-slate-200">{p.name}</span>
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
              <h3 className="text-base font-bold text-white">Host a Daytime Match</h3>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="padelhub">PADELHUB ($22.00/pp)</option>
                  <option value="sensa">Sensa Padel ($22.50/pp)</option>
                  <option value="dedham">Padel Boston ($22.50/pp)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date</label>
                <input 
                  type="text" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" 
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Time Window (90 Min)</label>
                <input 
                  type="text" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200" 
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Skill Tier</label>
                <select 
                  value={newTier} 
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
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