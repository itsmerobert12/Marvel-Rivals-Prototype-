import React, { useState } from 'react';
import { analyzePerformance } from '../services/gemini';
import { MatchRecord, UserProfile } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Brain, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface AIAdvisorProps {
  profile: UserProfile;
  matches: MatchRecord[];
}

export default function AIAdvisor({ profile, matches }: AIAdvisorProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzePerformance(profile, matches);
      setAnalysis(result || "No analysis available.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Brain className="w-32 h-32 text-red-500" />
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 italic uppercase tracking-tighter text-2xl">
          <Sparkles className="w-6 h-6 text-red-500" />
          AI Playstyle Advisor
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!analysis && !loading && (
          <div className="text-center py-12 space-y-4">
            <p className="text-zinc-400 max-w-md mx-auto">
              Our advanced AI will analyze your recent match data to provide personalized coaching tips and playstyle recommendations.
            </p>
            <Button 
              onClick={handleAnalyze} 
              disabled={matches.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase italic tracking-wider px-8"
            >
              Start Analysis
            </Button>
            {matches.length === 0 && (
              <p className="text-xs text-zinc-500">Play some matches first to get an analysis!</p>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            <p className="text-zinc-400 animate-pulse font-bold uppercase tracking-widest text-xs">Processing Combat Data...</p>
          </div>
        )}

        <AnimatePresence>
          {analysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert max-w-none"
            >
              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                <div className="markdown-body">
                  <ReactMarkdown>
                    {analysis}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setAnalysis(null)}
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                >
                  New Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
