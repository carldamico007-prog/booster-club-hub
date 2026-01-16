
export interface User {
  id: string;
  name: string;
  role: string;
  isAdmin: boolean;
  avatar: string;
  phone?: string;
  email?: string;
  shareInfo?: boolean;
}

export interface Attachment {
  name: string;
  type: 'image' | 'file';
  url: string; 
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  attachment?: Attachment;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  location?: string;
  isNew?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
}

export interface Vote {
  userId: string;
  optionId: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  votes: Vote[];
  createdBy: string;
  isOpen: boolean;
  type: 'multi-choice' | 'yes-no';
  seenBy: string[];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string;
  isNew?: boolean;
}

export enum AppView {
  DASHBOARD = 'Dashboard',
  CHAT = 'Chat',
  CALENDAR = 'Calendar',
  POLLS_VOTES = 'Polls & Votes',
  TODO = 'To-Do List',
  MEMBERS = 'Members List',
  ADMIN = 'Admin Panel',
}
