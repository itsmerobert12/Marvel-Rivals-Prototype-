import React, { useState } from 'react';
import { HEROES } from '../constants/heroes';
import { Hero, HeroRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Search, Shield, Sword, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RoleIcon = ({ role }: { role: HeroRole }) => {
  switch (role) {
    case 'Vanguard': return <Shield className="w-4 h-4 text-blue-400" />;
    case 'Duelist': return <Sword className="w-4 h-4 text-red-400" />;
    case 'Strategist': return <Heart className="w-4 h-4 text-green-400" />;
  }
};

export default function HeroDatabase() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<HeroRole | 'All'>('All');

  const filteredHeroes = HEROES.filter(hero => {
    const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'All' || hero.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search heroes..." 
            className="pl-10 bg-zinc-900/50 border-zinc-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Vanguard', 'Duelist', 'Strategist'].map((role) => (
            <Badge
              key={role}
              variant={selectedRole === role ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-1"
              onClick={() => setSelectedRole(role as any)}
            >
              {role}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHeroes.map((hero) => (
              <motion.div
                key={hero.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-red-500/50 transition-colors group cursor-pointer">
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img 
                      src={hero.imageUrl} 
                      alt={hero.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <RoleIcon role={hero.role} />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{hero.role}</span>
                      </div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{hero.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{hero.description}</p>
                    <div className="grid grid-cols-5 gap-1">
                      {Object.entries(hero.stats).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] uppercase text-zinc-500 block text-center truncate">{key}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
