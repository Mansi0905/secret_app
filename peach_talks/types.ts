
export interface User {
  studentId: string;
  alias: string;
}

export enum AppRoute {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardTab {
  FEED = 'FEED',
  RESOURCES = 'RESOURCES',
  CONFESSIONS = 'CONFESSIONS',
  CHATS = 'CHATS'
}

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  type: 'IDEA' | 'RESOURCE' | 'CONFESSION';
  tags?: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'LINK' | 'DOC';
  subject: string;
  author: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}
