
import { User, Message, CalendarEvent, Poll, Todo, PollOption, Vote } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Sarah', role: 'President', isAdmin: true, avatar: 'https://i.pravatar.cc/150?u=u1', email: 'president@booster.com', phone: '555-0101', shareInfo: true },
  { id: 'u2', name: 'Bob', role: 'Vice President', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=u2', email: 'vp@booster.com', phone: '555-0102', shareInfo: true },
  { id: 'u3', name: 'Alice', role: 'Treasurer', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=u3', email: 'treasurer@booster.com', phone: '555-0103', shareInfo: false },
  { id: 'u4', name: 'Charlie', role: 'Secretary', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=u4', email: 'secretary@booster.com', phone: '555-0104', shareInfo: true },
  { id: 'u5', name: 'Coach Miller', role: 'Coach', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=u5', email: 'coach.miller@school.edu', phone: '555-0105', shareInfo: true },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    userId: 'u1',
    text: 'Welcome to the Booster Club Hub! Looking forward to a great season.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'm2',
    userId: 'u2',
    text: 'Great to be here Sarah. I am starting on the fundraiser schedule.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Monthly Booster Meeting',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 19, 0),
    description: 'Discussing upcoming fundraisers and team needs.',
    location: 'School Library',
  },
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'What should be our top fundraising priority?',
    options: [
      { id: 'p1o1', text: 'New Uniforms' },
      { id: 'p1o2', text: 'Travel Gear' },
      { id: 'p1o3', text: 'Training Equipment' },
    ],
    votes: [
      { userId: 'u2', optionId: 'p1o1' },
      { userId: 'u3', optionId: 'p1o3' },
    ],
    createdBy: 'u1',
    isOpen: true,
    type: 'multi-choice',
    seenBy: ['u1', 'u2', 'u3', 'u4'],
  },
];

export const INITIAL_TODOS: Todo[] = [
  { id: 't1', text: 'Design new team banner', completed: false },
  { id: 't2', text: 'Collect parent contact info', completed: true, completedBy: 'u3' },
  { id: 't3', text: 'Organize snack schedule for games', completed: false },
];
