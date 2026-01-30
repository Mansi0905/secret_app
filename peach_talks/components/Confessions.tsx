
import React, { useState } from 'react';
import { Button } from './Button';
import { moderateContent } from '../services/geminiService';
import { Post } from '../types';

interface ConfessionsProps {
  posts: Post[];
  onAddPost: (content: string) => void;
  currentUser: string;
}

export const Confessions: React.FC<ConfessionsProps> = ({ posts, onAddPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    const moderation = await moderateContent(content);
    
    if (moderation.isSafe) {
      onAddPost(content);
      setContent('');
    } else {
      setError(moderation.feedback || "Your post seems to violate our safety guidelines.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-card p-6 rounded-3xl">
        <h2 className="text-2xl font-bold font-outfit mb-4">Shadow Wall</h2>
        <p className="text-gray-400 mb-6">Confess your thoughts, regrets, or secrets. Purely anonymous.</p>
        
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? (Don't mention names!)"
            className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-peach-text resize-none transition-all"
          />
          {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleSubmit} 
            isLoading={isSubmitting}
            disabled={!content.trim()}
          >
            Post Secretly
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.filter(p => p.type === 'CONFESSION').map((post) => (
          <div key={post.id} className="glass-card p-6 rounded-2xl border-l-4 border-l-red-400 transform transition hover:-translate-y-1">
            <p className="text-lg italic text-gray-200">"{post.content}"</p>
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span>By Someone Secret</span>
              <div className="flex items-center space-x-3">
                <button className="hover:text-peach-text"><i className="far fa-heart mr-1"></i> {post.likes}</button>
                <span>{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
