import React, { useState } from 'react';
import { UserProfile, MatchRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { HEROES } from '../constants/heroes';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Shield, Sword, Heart, Plus, History } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileProps {
  profile: UserProfile;
  matches: MatchRecord[];
}

export default function UserProfileComponent({ profile, matches }: UserProfileProps) {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [newMatch, setNewMatch] = useState<Partial<MatchRecord>>({
    heroId: 'iron-man',
    damage: 0,
    healing: 0,
    damageBlocked: 0,
    eliminations: 0,
    deaths: 0,
    assists: 0,
    result: 'win'
  });

  const handleAddMatch = async () => {
    try {
      const matchData = {
        ...newMatch,
        userId: profile.uid,
        timestamp: new Date().toISOString(),
      };
      
      await addDoc(collection(db, 'matches'), matchData);
      
      // Update user stats (simplified for demo)
      const updatedProfile = {
        ...profile,
        totalMatches: profile.totalMatches + 1,
        winRate: Math.round(((profile.winRate * profile.totalMatches + (newMatch.result === 'win' ? 100 : 0)) / (profile.totalMatches + 1))),
        skillRating: profile.skillRating + (newMatch.result === 'win' ? 25 : -20)
      };
      
      await setDoc(doc(db, 'users', profile.uid), updatedProfile);
      await setDoc(doc(db, 'leaderboard', profile.uid), {
        userId: profile.uid,
        displayName: profile.displayName,
        skillRating: updatedProfile.skillRating,
        favoriteHero: profile.favoriteHero
      });

      toast.success("Match recorded successfully!");
      setIsAddingMatch(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to record match.");
    }
  };

  const chartData = matches.slice(-10).map((m, i) => ({
    name: `Match ${i + 1}`,
    damage: m.damage,
    healing: m.healing,
    eliminations: m.eliminations
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="pt-6 text-center">
            <Avatar className="h-24 w-24 mx-auto border-4 border-red-500 mb-4">
              <AvatarImage src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} />
              <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-1">{profile.displayName}</h2>
            <p className="text-zinc-500 text-sm mb-4">{profile.email}</p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="border-red-500/50 text-red-500">{profile.role.toUpperCase()}</Badge>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">SR {profile.skillRating}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                <p className="text-[10px] uppercase text-zinc-500 font-bold">Win Rate</p>
                <p className="text-xl font-black text-zinc-100">{profile.winRate}%</p>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                <p className="text-[10px] uppercase text-zinc-500 font-bold">Matches</p>
                <p className="text-xl font-black text-zinc-100">{profile.totalMatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-zinc-500">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Favorite Hero</span>
              <span className="font-bold text-zinc-100">{profile.favoriteHero || 'None'}</span>
            </div>
            <Separator className="bg-zinc-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Last Analysis</span>
              <span className="text-xs text-zinc-500">{profile.lastAnalyzed ? new Date(profile.lastAnalyzed).toLocaleDateString() : 'Never'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 italic uppercase tracking-tighter text-2xl">
              <History className="w-6 h-6 text-red-500" />
              Performance Trends
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setIsAddingMatch(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Record Match
            </Button>
          </CardHeader>
          <CardContent>
            {matches.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                    <YAxis stroke="#71717a" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="damage" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                    <Line type="monotone" dataKey="healing" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                    <Line type="monotone" dataKey="eliminations" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                No match data available. Record your first match to see trends!
              </div>
            )}
          </CardContent>
        </Card>

        {isAddingMatch && (
          <Card className="bg-zinc-900 border-red-500/50 border-2">
            <CardHeader>
              <CardTitle className="text-lg italic uppercase tracking-tighter">Record New Match</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero</Label>
                  <select 
                    className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 text-sm"
                    value={newMatch.heroId}
                    onChange={(e) => setNewMatch({...newMatch, heroId: e.target.value})}
                  >
                    {HEROES.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Result</Label>
                  <select 
                    className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 text-sm"
                    value={newMatch.result}
                    onChange={(e) => setNewMatch({...newMatch, result: e.target.value as any})}
                  >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Damage</Label>
                  <Input 
                    type="number" 
                    className="bg-zinc-800 border-zinc-700" 
                    value={newMatch.damage}
                    onChange={(e) => setNewMatch({...newMatch, damage: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Healing</Label>
                  <Input 
                    type="number" 
                    className="bg-zinc-800 border-zinc-700" 
                    value={newMatch.healing}
                    onChange={(e) => setNewMatch({...newMatch, healing: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Eliminations</Label>
                  <Input 
                    type="number" 
                    className="bg-zinc-800 border-zinc-700" 
                    value={newMatch.eliminations}
                    onChange={(e) => setNewMatch({...newMatch, eliminations: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => setIsAddingMatch(false)}>Cancel</Button>
                <Button onClick={handleAddMatch} className="bg-red-600 hover:bg-red-700">Save Match</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
