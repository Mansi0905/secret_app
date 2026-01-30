
import React from 'react';
import { Resource } from '../types';
import { MOCK_RESOURCES } from '../constants';

export const Resources: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-outfit">Study Vault</h2>
        <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm text-peach-text transition-colors">
          <i className="fas fa-plus mr-2"></i> Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_RESOURCES.map((res) => (
          <div key={res.id} className="glass-card p-5 rounded-2xl hover:border-white/20 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${res.type === 'PDF' ? 'bg-red-500/10 text-red-400' : res.type === 'LINK' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                <i className={`fas ${res.type === 'PDF' ? 'fa-file-pdf' : res.type === 'LINK' ? 'fa-link' : 'fa-file-word'} text-xl`}></i>
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{res.subject}</span>
            </div>
            <h3 className="font-semibold text-gray-200 group-hover:text-peach-text transition-colors">{res.title}</h3>
            <p className="text-xs text-gray-500 mt-2">Shared by <span className="text-gray-400">{res.author}</span></p>
            
            <div className="mt-5 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0c] bg-gray-700 flex items-center justify-center text-[8px] font-bold">
                    <i className="fas fa-user"></i>
                  </div>
                ))}
                <span className="pl-3 text-[10px] text-gray-500 self-center">+12 students used this</span>
              </div>
              <button className="text-gray-400 hover:text-white"><i className="fas fa-download"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
