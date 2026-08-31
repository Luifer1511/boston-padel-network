import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Crown,
  Info,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { supabase } from './supabase';

const CLUBS = [
  { id: 'all', name: 'All Clubs', price: null, area: 'Greater Boston' },
  { id: 'padelhub', name: 'PADELHUB', price: 22.0, area: 'Seaport / Southie' },
  { id: 'sensa', name: 'Sensa Padel', price: 22.5, area: 'Hyde Park' },
  { id: 'dedham', name: 'Padel Boston', price: 22.5, area: 'Dedham' },
];

const TIERS = [
  { label: 'Beginner', range: '< 1.8' },
  { label: 'High Beginner', range: '1.8 – 2.3' },
  { label: 'Low Intermediate', range: '2.3 – 2.6' },
  { label: 'Intermediate', range: '2.6 – 3.1' },
  { label: 'High Intermediate', range: '3.1 – 3.7' },
  { label: 'Low Advanced', range: '3.7 – 4.5' },
  { label: 'Advanced', range: '4.5+' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '08:00 AM – 12:00 PM', start: '08:00', end: '12:00' },
  { id: 'noon', label: 'Midday / Lunch', time: '12:00 PM – 03:00 PM', start: '12:00', end: '15:00' },
  { id: 'afternoon', label: 'Afternoon', time: '03:00 PM – 06:00 PM', start: '15:00', end: '18:00' },
  { id: 'evening', label: 'Evening / Prime', time: '06:00 PM – 10:00 PM', start: '18:00', end: '22:00' },
];

const START_TIMES = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM', '09:00 PM',
];

function getTodayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60 * 1000).toISOString().split('T')[0];
}

function normalizePlayers(players) {
  return Array.isArray(players) ? players : [];
}

function tierClass(label) {
  if (label === 'Beginner') return 'bg-slate-700 text-slate-200';
  if (label === 'High Beginner') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  if (label === 'Low Intermediate') return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
  if (label === 'Intermediate') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (label === 'High Intermediate') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  if (label === 'Low Advanced') return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
  return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
}

function AuthScreen({ onMagicLinkSent }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSent(true);
    onMagicLinkSent?.();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-emerald-400">BOSTON PADEL</h1>
          <p className="text-sm text-slate-400 mt-1">Autonomous Matchmaking Network</p>
        </div>

        {!sent ? (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Sign in to play</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your email. We’ll send you a secure sign-in link.
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm"
              >
                {loading ? 'Sending…' : 'Send Sign-In Link'}
              </button>
            </form>

            <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Your WhatsApp number will be added to your player profile after sign-in.</span>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Check your email</h2>
            <p className="text-sm text-slate-400 mt-2">
              We sent a secure Boston Padel sign-in link to <strong className="text-slate-200">{email}</strong>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-5 text-xs text-emerald-400 font-bold hover:text-emerald-300"
            >
              Use another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSetup({ session, onCreated }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState('2.50');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 7) {
      setSaving(false);
      setErrorMsg('Please enter a valid padel rating.');
      return;
    }

    const { data, error } = await supabase
      .from('players')
      .insert({
        user_id: session.user.id,
        name: name.trim(),
        phone: phone.trim(),
        rating: parsedRating,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    onCreated(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="mb-6">
          <p className="text-emerald-400 text-xs font-black tracking-wide">BOSTON PADEL</p>
          <h1 className="text-xl font-black text-white mt-1">Create your player profile</h1>
          <p className="text-xs text-slate-400 mt-1">This is what other players will see when you join a match.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Player name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Luis F."
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">WhatsApp / Cell</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 617 555 1234"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Current padel rating</label>
            <input
              type="number"
              min="0"
              max="7"
              step="0.01"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">You can start with your best estimate. We’ll improve rating accuracy later.</p>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl text-sm font-black"
          >
            {saving ? 'Creating profile…' : 'Create Player Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [matches, setMatches] = useState([]);
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [confirmedMatch, setConfirmedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [toastMsg, setToastMsg] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [preferredClubs, setPreferredClubs] = useState(['padelhub', 'sensa', 'dedham']);
  const [selectedSlots, setSelectedSlots] = useState(['morning', 'evening']);

  const [newClubId, setNewClubId] = useState('padelhub');
  const [newDate, setNewDate] = useState(getTodayISO());
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDuration, setNewDuration] = useState('90');
  const [newTier, setNewTier] = useState('Low Intermediate');

  const showToast = (msg) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        setPlayer(null);
        return;
      }

      setProfileLoading(true);

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Profile load error:', error);
      }

      setPlayer(data ?? null);
      setProfileLoading(false);
    };

    loadProfile();
  }, [session?.user?.id]);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['open', 'full', 'confirmed'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Match load error:', error);
      return;
    }

    setMatches((data ?? []).map((m) => ({ ...m, players: normalizePlayers(m.players) })));
  };

  useEffect(() => {
    if (!session || !player) return;

    fetchMatches();

    const channel = supabase
      .channel('boston-padel-matches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        () => fetchMatches()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, player?.id]);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!player?.id) return;

      const [{ data: clubRows }, { data: availabilityRows }] = await Promise.all([
        supabase.from('player_clubs').select('club_id').eq('player_id', player.id),
        supabase.from('availability').select('*').eq('player_id', player.id).eq('active', true),
      ]);

      if (clubRows?.length) {
        setPreferredClubs(clubRows.map((r) => r.club_id));
      }

      if (availabilityRows?.length) {
        const ids = [];
        for (const row of availabilityRows) {
          const slot = TIME_SLOTS.find((s) => s.start === row.start_time?.slice(0, 5) && s.end === row.end_time?.slice(0, 5));
          if (slot && !ids.includes(slot.id)) ids.push(slot.id);
        }
        if (ids.length) setSelectedSlots(ids);
      }
    };

    loadPreferences();
  }, [player?.id]);

  const filteredMatches = useMemo(
    () => matches.filter((m) => selectedClub === 'all' || m.clubId === selectedClub),
    [matches, selectedClub]
  );

  const toggleSlot = (id) => {
    setSelectedSlots((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  };

  const toggleClub = (clubId) => {
    setPreferredClubs((current) =>
      current.includes(clubId) ? current.filter((x) => x !== clubId) : [...current, clubId]
    );
  };

  const handleSaveAvailability = async () => {
    if (!player?.id) return;

    const deleteAvailability = supabase.from('availability').delete().eq('player_id', player.id);
    const deleteClubs = supabase.from('player_clubs').delete().eq('player_id', player.id);

    const [availabilityDeleteResult, clubDeleteResult] = await Promise.all([deleteAvailability, deleteClubs]);

    if (availabilityDeleteResult.error || clubDeleteResult.error) {
      console.error(availabilityDeleteResult.error || clubDeleteResult.error);
      showToast('Could not save availability.');
      return;
    }

    const availabilityRows = [];
    for (let day = 0; day <= 6; day += 1) {
      for (const slotId of selectedSlots) {
        const slot = TIME_SLOTS.find((s) => s.id === slotId);
        if (!slot) continue;
        availabilityRows.push({
          player_id: player.id,
          day_of_week: day,
          start_time: slot.start,
          end_time: slot.end,
          active: true,
        });
      }
    }

    const clubRows = preferredClubs.map((clubId, index) => ({
      player_id: player.id,
      club_id: clubId,
      priority: Math.min(index + 1, 3),
    }));

    const inserts = [];
    if (availabilityRows.length) inserts.push(supabase.from('availability').insert(availabilityRows));
    if (clubRows.length) inserts.push(supabase.from('player_clubs').insert(clubRows));

    const results = await Promise.all(inserts);
    const failed = results.find((r) => r.error);

    if (failed) {
      console.error(failed.error);
      showToast('Could not save availability.');
      return;
    }

    showToast('Availability saved!');
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!player?.id) return;

    const club = CLUBS.find((c) => c.id === newClubId) || CLUBS[1];
    const formattedTime = `${newTime} (${newDuration} Mins)`;

    const matchPayload = {
      clubId: club.id,
      clubName: club.name,
      area: club.area,
      date: newDate,
      time: formattedTime,
      duration_minutes: Number(newDuration),
      tier: newTier,
      price: club.price,
      spotsFilled: 1,
      totalSpots: 4,
      host_player_id: player.id,
      status: 'open',
      players: [
        {
          id: player.id,
          name: player.name,
          phone: player.phone,
          rating: Number(player.rating),
        },
      ],
    };

    const { data: match, error } = await supabase
      .from('matches')
      .insert(matchPayload)
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast('Error publishing match.');
      return;
    }

    const { error: membershipError } = await supabase
      .from('match_players')
      .insert({
        match_id: match.id,
        player_id: player.id,
        role: 'host',
        status: 'joined',
      });

    if (membershipError) console.error('Host membership error:', membershipError);

    setShowCreateModal(false);
    showToast('Match published successfully!');
    fetchMatches();
  };

  const handleConfirmJoin = async (e) => {
    e.preventDefault();
    if (!selectedMatch || !player?.id) return;

    const existingPlayers = normalizePlayers(selectedMatch.players);

    if (existingPlayers.some((p) => p.id === player.id)) {
      setSelectedMatch(null);
      showToast('You already joined this match.');
      return;
    }

    if (existingPlayers.length >= 4) {
      setSelectedMatch(null);
      showToast('This match is already full.');
      return;
    }

    const nextPlayers = [
      ...existingPlayers,
      {
        id: player.id,
        name: player.name,
        phone: player.phone,
        rating: Number(player.rating),
      },
    ];

    const nextCount = nextPlayers.length;
    const nextStatus = nextCount >= 4 ? 'full' : 'open';

    const { data: updatedMatch, error } = await supabase
      .from('matches')
      .update({
        players: nextPlayers,
        spotsFilled: nextCount,
        status: nextStatus,
      })
      .eq('id', selectedMatch.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast('Could not join match.');
      return;
    }

    const { error: membershipError } = await supabase
      .from('match_players')
      .upsert(
        {
          match_id: selectedMatch.id,
          player_id: player.id,
          role: 'player',
          status: 'joined',
          left_at: null,
        },
        { onConflict: 'match_id,player_id' }
      );

    if (membershipError) console.error('Membership error:', membershipError);

    setSelectedMatch(null);

    if (nextCount === 4) {
      setConfirmedMatch({ ...updatedMatch, players: nextPlayers });
    } else {
      showToast('Successfully joined the match!');
    }

    fetchMatches();
  };

  const handleLeaveMatch = async (match) => {
    if (!player?.id) return;

    const currentPlayers = normalizePlayers(match.players);
    const isHost = match.host_player_id === player.id;

    if (isHost && currentPlayers.length > 1) {
      showToast('Host cannot leave while other players are joined.');
      return;
    }

    const nextPlayers = currentPlayers.filter((p) => p.id !== player.id);
    const nextCount = nextPlayers.length;

    const { error } = await supabase
      .from('matches')
      .update({
        players: nextPlayers,
        spotsFilled: nextCount,
        status: nextCount >= 4 ? 'full' : 'open',
      })
      .eq('id', match.id);

    if (error) {
      console.error(error);
      showToast('Could not leave match.');
      return;
    }

    const { error: membershipError } = await supabase
      .from('match_players')
      .update({
        status: 'left',
        left_at: new Date().toISOString(),
      })
      .eq('match_id', match.id)
      .eq('player_id', player.id);

    if (membershipError) console.error('Membership leave error:', membershipError);

    showToast('You left the match.');
    fetchMatches();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPlayer(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading Boston Padel…
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading player profile…
      </div>
    );
  }

  if (!player) {
    return <ProfileSetup session={session} onCreated={setPlayer} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans border-x border-slate-900">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 size={16} />
          {toastMsg}
        </div>
      )}

      <header className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black tracking-tight text-emerald-400">BOSTON PADEL</h1>
          <p className="text-[11px] text-slate-400 font-medium">Autonomous Matchmaking Network</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl">
            <User size={13} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-200">{player.name.split(' ')[0]}</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {Number(player.rating).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 p-1.5 bg-slate-900 mx-4 mt-3 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-2.5 text-center font-bold rounded-lg transition ${
            activeTab === 'feed' ? 'bg-slate-800 text-white ring-2 ring-blue-500' : 'text-slate-400'
          }`}
        >
          Open Matches
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`py-2.5 text-center font-bold rounded-lg transition ${
            activeTab === 'schedule' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          My Availability
        </button>
      </div>

      {activeTab === 'feed' ? (
        <main className="flex-1 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1 mr-2">
              {CLUBS.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub(club.id)}
                  className={`text-[11px] font-bold px-3 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedClub === club.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {club.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 px-3 rounded-lg font-bold flex items-center gap-1 text-xs"
            >
              <Plus size={14} />
              Host
            </button>
          </div>

          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-300">
              <strong className="text-emerald-400">Smart Match:</strong> availability powers automated matching.
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
              BETA
            </span>
          </div>

          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-300">No active matches</h3>
                  <p className="text-xs text-slate-500 mt-1">There are no matches available for this club right now.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-emerald-400 font-bold text-xs"
                >
                  + Be the first to host one
                </button>
              </div>
            ) : (
              filteredMatches.map((match) => {
                const players = normalizePlayers(match.players);
                const hasJoined = players.some((p) => p.id === player.id);
                const isFull = players.length >= 4 || match.status === 'full';

                return (
                  <div key={match.id} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <MapPin size={13} />
                          {match.clubName}
                          <span className="text-slate-500 font-normal">({match.area})</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">{match.date}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={12} />
                          {match.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tierClass(match.tier)}`}>
                          {match.tier}
                        </span>
                        <p className="text-[11px] font-bold text-slate-300 mt-1">
                          ${Number(match.price ?? 0).toFixed(2)}/pp
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {players.map((p, i) => (
                            <div
                              key={`${match.id}-${p.id || i}`}
                              title={`${p.name}${p.rating ? ` • ${Number(p.rating).toFixed(2)}` : ''}`}
                              className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center relative text-[10px] font-black text-slate-300"
                            >
                              {(p.name || '?').slice(0, 1).toUpperCase()}
                              {i === 0 && (
                                <div className="absolute -top-1.5 -right-1 bg-amber-400 rounded-full p-0.5 border border-slate-900">
                                  <Crown size={8} className="text-slate-950" />
                                </div>
                              )}
                            </div>
                          ))}
                          {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
                            <div
                              key={`empty-${i}`}
                              className="w-8 h-8 rounded-full border-2 border-dashed border-slate-700 bg-slate-950 flex items-center justify-center text-slate-600"
                            >
                              <Plus size={11} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400">{players.length}/4</span>
                      </div>

                      {hasJoined ? (
                        <button
                          onClick={() => handleLeaveMatch(match)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 flex items-center gap-1"
                        >
                          <LogOut size={13} />
                          Leave
                        </button>
                      ) : isFull ? (
                        <button disabled className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-500">
                          Match Full
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
                        >
                          Join • ${Number(match.price ?? 0).toFixed(2)}
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
        <main className="flex-1 p-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-bold text-white">Your Player Identity</h2>
                <p className="text-xs text-slate-400 mt-1">{player.name} • {player.phone}</p>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                {Number(player.rating).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-white">Preferred Clubs</h2>
            <div className="space-y-2">
              {CLUBS.filter((c) => c.id !== 'all').map((club) => (
                <button
                  key={club.id}
                  onClick={() => toggleClub(club.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left ${
                    preferredClubs.includes(club.id)
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-slate-200 text-xs">{club.name}</span>
                    <span className="text-slate-500 ml-1.5 text-xs">({club.area})</span>
                  </div>
                  <span className="text-emerald-400 font-black">
                    {preferredClubs.includes(club.id) ? '✓' : '+'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Daily Time Windows</h2>
              <p className="text-xs text-slate-400 mt-1">Select your preferred time slots for automated matching.</p>
            </div>

            <div className="space-y-2">
              {TIME_SLOTS.map((slot) => {
                const active = selectedSlots.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    onClick={() => toggleSlot(slot.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex justify-between items-center ${
                      active
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-200 text-xs">{slot.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{slot.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {active ? 'Active' : 'Tap to add'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSaveAvailability}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Save Availability
            </button>
          </div>
        </main>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Join Match • {selectedMatch.clubName}</h3>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 gap-3">
                <span>Session:</span>
                <span className="text-slate-200 font-medium text-right">{selectedMatch.date} • {selectedMatch.time}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Split Amount:</span>
                <span className="text-emerald-400 font-black text-sm">${Number(selectedMatch.price ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
              <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Payment is not live yet. This beta only confirms your spot.</span>
            </div>

            <form onSubmit={handleConfirmJoin}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Confirm Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmedMatch && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-black text-white mt-3">MATCH FULL (4/4)</h3>
              <p className="text-xs text-slate-400 mt-1">{confirmedMatch.clubName} • {confirmedMatch.time}</p>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-slate-300">Lineup:</p>
              {normalizePlayers(confirmedMatch.players).map((p, i) => (
                <div key={p.id || i} className="flex justify-between py-1.5 border-b border-slate-900 last:border-b-0">
                  <span className="font-medium text-slate-200 flex items-center gap-1">
                    {p.name}
                    {i === 0 && <Crown size={10} className="text-amber-400" />}
                  </span>
                  <span className="text-slate-500">{p.phone}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setConfirmedMatch(null)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4 max-h-[90vh] overflow-y-auto">
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
                  {CLUBS.filter((c) => c.id !== 'all').map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name} (${club.price.toFixed(2)}/pp)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date</label>
                <input
                  type="date"
                  min={getTodayISO()}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
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
                  {START_TIMES.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Duration</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="60">60 Mins (1 Hour)</option>
                  <option value="90">90 Mins (1.5 Hours)</option>
                  <option value="120">120 Mins (2 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Skill Tier</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  {TIERS.map((tier) => (
                    <option key={tier.label} value={tier.label}>
                      {tier.label} ({tier.range})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
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
