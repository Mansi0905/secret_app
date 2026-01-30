
import React from 'react';
import { Post, Resource } from './types';

export const COLLEGE_NAME = "ACE College";
export const ID_PREFIX = "ACE";

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Cosmic Fox',
    content: "Has anyone started studying for the Data Structures finals? Thinking of forming a study group at the library tonight.",
    timestamp: Date.now() - 3600000,
    likes: 12,
    type: 'IDEA',
    tags: ['Academics', 'StudyGroup']
  },
  {
    id: '2',
    author: 'Neon Shadow',
    content: "I'm confessing... I still don't understand how pointers work in C++. Am I even an engineering student? 😭",
    timestamp: Date.now() - 7200000,
    likes: 45,
    type: 'CONFESSION'
  },
  {
    id: '3',
    author: 'Pixel Peach',
    content: "Found this amazing repository for Operating System notes. It saved my life during mid-terms.",
    timestamp: Date.now() - 10800000,
    likes: 89,
    type: 'RESOURCE',
    tags: ['OS', 'CheatSheet']
  }
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Compiler Design Notes - Unit 3', type: 'PDF', subject: 'CSE', author: 'Quantum Owl' },
  { id: 'r2', title: 'Machine Learning Basics Repo', type: 'LINK', subject: 'AI', author: 'Binary Bear' },
  { id: 'r3', title: 'Thermodynamics Problem Sets', type: 'DOC', subject: 'MECH', author: 'Steam Punk' },
];
