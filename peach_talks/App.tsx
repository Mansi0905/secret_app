
import React, { useState, useEffect, useRef } from 'react';
import { AppRoute, DashboardTab, User, Post } from './types';
import { COLLEGE_NAME, ID_PREFIX, MOCK_POSTS } from './constants';
import { Button } from './components/Button';
import { generateAliases } from './services/geminiService';
import { Confessions } from './components/Confessions';
import { Resources } from './components/Resources';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [aliasSuggestions, setAliasSuggestions] = useState<string[]>([]);
  const [selectedAlias, setSelectedAlias] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.FEED);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isAliasLoading, setIsAliasLoading] = useState(false);
  
  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', sender: 'Cyber Wolf', text: 'Does anyone have the notes for Digital Logic Unit 4?', timestamp: Date.now() - 300000 },
    { id: '2', sender: 'Pixel Ghost', text: "I'm looking for them too! Midterms are coming up fast.", timestamp: Date.now() - 240000 },
    { id: '3', sender: 'Neon Shadow', text: 'Check the Study Vault, I think someone uploaded them yesterday.', timestamp: Date.now() - 120000 },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === DashboardTab.CHATS) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, chatHistory]);

  const handleLoginStart = () => {
    setRoute(AppRoute.LOGIN);
  };

  const handleGenerateAliases = async () => {
    if (!studentIdInput.toUpperCase().startsWith(ID_PREFIX)) {
      alert(`Access Restricted. Only ${COLLEGE_NAME} IDs allowed (must start with ${ID_PREFIX}).`);
      return;
    }
    setIsAliasLoading(true);
    const names = await generateAliases();
    setAliasSuggestions(names);
    setIsAliasLoading(false);
  };

  const finalizeLogin = () => {
    if (!selectedAlias) return;
    const user = { studentId: studentIdInput, alias: selectedAlias };
    setCurrentUser(user);
    setRoute(AppRoute.DASHBOARD);
  };

  const toggleLike = (postId: string) => {
    const newLikedIds = new Set(likedPostIds);
    const isLiked = newLikedIds.has(postId);
    
    if (isLiked) {
      newLikedIds.delete(postId);
    } else {
      newLikedIds.add(postId);
    }
    setLikedPostIds(newLikedIds);

    // Update the post like count locally
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const addPost = (content: string, type: 'IDEA' | 'RESOURCE' | 'CONFESSION' = 'CONFESSION') => {
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser?.alias || 'Someone',
      content,
      timestamp: Date.now(),
      likes: 0,
      type
    };
    setPosts([newPost, ...posts]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !currentUser) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: currentUser.alias,
      text: chatMessage,
      timestamp: Date.now()
    };
    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');
  };

  // --- RENDERING ---

  if (route === AppRoute.LANDING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 peach-gradient rounded-3xl mb-8 flex items-center justify-center shadow-2xl shadow-orange-500/40">
           <i className="fas fa-comments text-4xl text-white"></i>
        </div>
        <h1 className="text-5xl md:text-7xl font-outfit font-extrabold mb-4 tracking-tight">
          Peach <span className="peach-text">Talks</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">
          The exclusive anonymous hub for <span className="text-white font-semibold">{COLLEGE_NAME}</span>. Share ideas, resources, and secrets without revealing your identity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={handleLoginStart}>Enter the Hub</Button>
          <Button variant="secondary" size="lg">How it works</Button>
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2"><i className="fas fa-shield-alt text-peach-text"></i> Fully Anonymous</div>
          <div className="flex items-center gap-2"><i className="fas fa-university text-peach-text"></i> ACE Students Only</div>
          <div className="flex items-center gap-2"><i className="fas fa-bolt text-peach-text"></i> AI-Powered Safe Space</div>
        </div>
      </div>
    );
  }

  if (route === AppRoute.LOGIN) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-[#0a0a0c] to-[#0a0a0c]">
        <div className="glass-card w-full max-w-md p-8 rounded-[2rem] shadow-2xl">
          <button onClick={() => setRoute(AppRoute.LANDING)} className="text-gray-500 hover:text-white mb-6">
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>
          
          <h2 className="text-3xl font-bold font-outfit mb-2">Identify Yourself</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your ACE College ID to unlock anonymous access.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">College Student ID</label>
              <input 
                type="text"
                placeholder="e.g. 23EACCS177"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-peach-text transition-colors placeholder:text-gray-600"
              />
            </div>

            {aliasSuggestions.length === 0 ? (
              <Button 
                variant="primary" 
                className="w-full" 
                onClick={handleGenerateAliases}
                isLoading={isAliasLoading}
                disabled={!studentIdInput}
              >
                Verify & Generate Alias
              </Button>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Choose Your Mask</label>
                <div className="grid grid-cols-1 gap-2">
                  {aliasSuggestions.map((alias) => (
                    <button
                      key={alias}
                      onClick={() => setSelectedAlias(alias)}
                      className={`p-4 rounded-xl text-left border transition-all ${selectedAlias === alias ? 'border-peach-text bg-orange-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{alias}</span>
                        {selectedAlias === alias && <i className="fas fa-check-circle text-peach-text"></i>}
                      </div>
                    </button>
                  ))}
                </div>
                <Button 
                  variant="primary" 
                  className="w-full mt-4" 
                  onClick={finalizeLogin}
                  disabled={!selectedAlias}
                >
                  Confirm Identity
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 glass-card border-r border-white/10 p-6 flex flex-col fixed md:relative h-auto md:h-screen z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 peach-gradient rounded-xl flex items-center justify-center">
            <i className="fas fa-comments text-white"></i>
          </div>
          <span className="text-xl font-bold font-outfit">Peach <span className="peach-text">Talks</span></span>
        </div>

        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
          {[
            { id: DashboardTab.FEED, label: 'Campus Feed', icon: 'fa-layer-group' },
            { id: DashboardTab.CONFESSIONS, label: 'Shadow Wall', icon: 'fa-mask' },
            { id: DashboardTab.RESOURCES, label: 'Study Vault', icon: 'fa-book' },
            { id: DashboardTab.CHATS, label: 'Whispers', icon: 'fa-comment-dots' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-orange-500/10 text-peach-text font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Your Alias</p>
            <p className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {currentUser?.alias}
            </p>
            <button 
              onClick={() => setRoute(AppRoute.LANDING)}
              className="text-[10px] text-red-400 mt-4 uppercase font-bold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 mt-20 md:mt-0 overflow-y-auto max-w-5xl mx-auto w-full">
        {activeTab === DashboardTab.FEED && (
          <div className="space-y-6 animate-fadeIn">
            <header className="mb-10">
              <h2 className="text-3xl font-bold font-outfit">Campus Hub</h2>
              <p className="text-gray-400">See what's happening at {COLLEGE_NAME} right now.</p>
            </header>

            {posts.filter(p => p.type !== 'CONFESSION').map((post) => {
              const isLiked = likedPostIds.has(post.id);
              return (
                <div key={post.id} className="glass-card p-6 rounded-3xl hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-peach-text">
                      <i className="fas fa-user-secret"></i>
                    </div>
                    <div>
                      <p className="font-bold text-gray-200">{post.author}</p>
                      <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      {post.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-lg bg-orange-500/10 text-[10px] font-bold text-peach-text uppercase tracking-wider">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
                  <div className="mt-6 flex items-center gap-6 text-gray-400">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 transition-all duration-300 ${isLiked ? 'text-red-400 scale-110' : 'hover:text-peach-text'}`}
                    >
                      <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors">
                      <i className="far fa-comment"></i>
                      <span className="text-sm font-medium">12</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors">
                      <i className="far fa-paper-plane"></i>
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === DashboardTab.CONFESSIONS && (
          <Confessions 
            posts={posts} 
            onAddPost={addPost} 
            currentUser={currentUser?.alias || 'Anon'} 
          />
        )}

        {activeTab === DashboardTab.RESOURCES && (
          <Resources />
        )}

        {activeTab === DashboardTab.CHATS && (
          <div className="h-[calc(100vh-12rem)] md:h-[80vh] flex flex-col animate-fadeIn">
            <header className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold font-outfit">Whispers</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>142 students active in ACE Hall</span>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0c] bg-gray-800 flex items-center justify-center text-[10px]">
                    <i className="fas fa-user-ninja text-peach-text"></i>
                  </div>
                ))}
              </div>
            </header>
            
            <div className="flex-1 glass-card rounded-3xl p-6 mb-4 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
              {chatHistory.map((msg) => {
                const isMe = msg.sender === currentUser?.alias;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}
                  >
                    {!isMe && <p className="text-[10px] text-peach-text font-bold mb-1 ml-2">{msg.sender}</p>}
                    <div className={`p-4 rounded-2xl relative ${
                      isMe 
                        ? 'bg-gradient-to-br from-orange-500/20 to-red-500/10 text-white rounded-tr-none border border-orange-500/20' 
                        : 'glass-card bg-white/5 text-gray-200 rounded-tl-none border-white/10'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <span className={`text-[9px] block mt-1 opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Whisper something to the hall..."
                className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="w-12 h-12 flex items-center justify-center peach-gradient rounded-xl text-white shadow-lg shadow-orange-500/20 active:scale-90 transition-transform disabled:opacity-30"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global CSS for animations and custom scrollbar */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
