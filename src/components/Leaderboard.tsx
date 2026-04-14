import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { LeaderboardEntry } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Trophy, Medal, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('skillRating', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        ...doc.data() as LeaderboardEntry,
        userId: doc.id, // Ensure userId is the document ID for the key
        rank: index + 1
      }));
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-zinc-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 text-center font-bold text-zinc-500">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 italic uppercase tracking-tighter text-2xl">
          <Star className="w-6 h-6 text-red-500 fill-red-500" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <motion.div
                key={entry.userId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(entry.rank!)}
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-zinc-700">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.userId}`} />
                    <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-zinc-100">{entry.displayName}</h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">{entry.favoriteHero || 'No Favorite'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-red-500 italic tracking-tighter">
                    {entry.skillRating} SR
                  </div>
                </div>
              </motion.div>
            ))}
            {entries.length === 0 && (
              <motion.div 
                key="no-entries"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-zinc-500"
              >
                No players on the leaderboard yet. Be the first!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
