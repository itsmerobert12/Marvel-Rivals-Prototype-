import React, { useEffect, useState } from 'react';
import { auth, db, loginWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { UserProfile, MatchRecord } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import HeroDatabase from './components/HeroDatabase';
import Leaderboard from './components/Leaderboard';
import AIAdvisor from './components/AIAdvisor';
import UserProfileComponent from './components/UserProfile';
import { Shield, Sword, Heart, Trophy, Brain, Database, LogOut, LogIn, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync user profile
        const userDoc = doc(db, 'users', firebaseUser.uid);
        const unsubProfile = onSnapshot(userDoc, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create initial profile
            const initialProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Hero',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              role: 'user',
              skillRating: 1000,
              totalMatches: 0,
              winRate: 0,
            };
            setDoc(userDoc, initialProfile);
          }
        });

        // Sync matches
        const q = query(
          collection(db, 'matches'),
          where('userId', '==', firebaseUser.uid),
          orderBy('timestamp', 'desc')
        );
        const unsubMatches = onSnapshot(q, (snapshot) => {
          setMatches(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MatchRecord)));
        });

        setLoading(false);
        return () => {
          unsubProfile();
          unsubMatches();
        };
      } else {
        setProfile(null);
        setMatches([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <Zap className="w-12 h-12 text-red-500 animate-pulse" />
          <div className="absolute inset-0 blur-xl bg-red-500/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-500 selection:text-white">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1 rounded-sm rotate-[-4deg]">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Rivals<span className="text-red-600">Nexus</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Active Hero</p>
                  <p className="text-sm font-black italic uppercase tracking-tighter">{profile?.displayName}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="hover:bg-red-500/10 hover:text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={loginWithGoogle}
                className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase italic tracking-wider"
              >
                <LogIn className="w-4 h-4 mr-2" /> Assemble
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="database" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-auto flex-wrap justify-center">
              <TabsTrigger value="database" className="data-[state=active]:bg-red-600 data-[state=active]:text-white uppercase italic font-bold tracking-wider px-6 py-2">
                <Database className="w-4 h-4 mr-2" /> Database
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-red-600 data-[state=active]:text-white uppercase italic font-bold tracking-wider px-6 py-2">
                <Trophy className="w-4 h-4 mr-2" /> Leaderboard
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-red-600 data-[state=active]:text-white uppercase italic font-bold tracking-wider px-6 py-2">
                <Sword className="w-4 h-4 mr-2" /> Performance
              </TabsTrigger>
              <TabsTrigger value="advisor" className="data-[state=active]:bg-red-600 data-[state=active]:text-white uppercase italic font-bold tracking-wider px-6 py-2">
                <Brain className="w-4 h-4 mr-2" /> AI Advisor
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="database">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {!user && (
                  <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Master the <span className="text-red-600">Multiverse</span></h2>
                      <p className="text-zinc-400">Sign in to track your performance, climb the leaderboard, and get personalized AI coaching.</p>
                    </div>
                    <Button onClick={loginWithGoogle} className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase italic tracking-wider whitespace-nowrap">
                      <LogIn className="w-4 h-4 mr-2" /> Assemble Now
                    </Button>
                  </div>
                )}
                <HeroDatabase />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="leaderboard">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Leaderboard />
              </motion.div>
            </TabsContent>

            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {user && profile ? (
                  <UserProfileComponent profile={profile} matches={matches} />
                ) : (
                  <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <Sword className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Login Required</h3>
                    <p className="text-zinc-400 mb-6">You need to assemble with your team to track performance.</p>
                    <Button onClick={loginWithGoogle} className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase italic tracking-wider">
                      <LogIn className="w-4 h-4 mr-2" /> Sign In
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="advisor">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {user && profile ? (
                  <AIAdvisor profile={profile} matches={matches} />
                ) : (
                  <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <Brain className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Login Required</h3>
                    <p className="text-zinc-400 mb-6">Our AI needs your combat data to provide coaching.</p>
                    <Button onClick={loginWithGoogle} className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase italic tracking-wider">
                      <LogIn className="w-4 h-4 mr-2" /> Sign In
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            <span className="font-black italic uppercase tracking-tighter">Rivals Nexus</span>
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            © 2026 Rivals Nexus. Not affiliated with NetEase or Marvel.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-red-500 transition-colors text-xs uppercase font-bold tracking-widest">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-red-500 transition-colors text-xs uppercase font-bold tracking-widest">Terms</a>
            <a href="#" className="text-zinc-500 hover:text-red-500 transition-colors text-xs uppercase font-bold tracking-widest">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
