import React, { useState, useRef, useEffect } from 'react';
import { AppView, User, Message, CalendarEvent, Poll, Todo, PollOption, Attachment } from './types';
import { USERS, INITIAL_MESSAGES, INITIAL_EVENTS, INITIAL_POLLS, INITIAL_TODOS } from './constants';
import {
  ChatBubbleIcon,
  CalendarIcon,
  ChartBarIcon,
  ListBulletIcon,
  Cog8ToothIcon,
  UsersIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  TrashIcon,
  PaperClipIcon,
  DocumentIcon,
  XCircleIcon
} from './components/Icons';

// --- ROLES CONFIG ---
const BOOSTER_ROLES = [
  "President",
  "Vice President",
  "Treasurer",
  "Secretary",
  "Coach",
  "Volunteer",
  "Member"
];

// --- LOGIN VIEW ---
const LoginView: React.FC<{ onLogin: (email: string) => void; }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            onLogin(email);
        } else {
            alert('Please enter an email address.');
        }
    };
    
    const handleDemoLogin = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password');
        onLogin(demoEmail);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
                <div>
                    <h1 className="text-3xl font-extrabold text-center text-primary">Booster Club Hub</h1>
                    <p className="mt-2 text-center text-sm text-gray-600">Please sign in to continue</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password (any value for demo)"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Demo Accounts
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {USERS.map(user => (
                       user.email && <button
                            key={user.id}
                            onClick={() => handleDemoLogin(user.email!)}
                            className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                           <p className="font-medium text-sm text-gray-800">
                                Log in as <span className="font-bold">{user.name}</span>
                           </p>
                           <p className="text-xs text-gray-500">{user.role}</p>
                        </button>
                    ))}
                  </div>
                </div>
            </div>
        </div>
    );
};


// --- HEADER & NAVIGATION ---

interface TopNavItemProps {
  view: AppView;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
  hasNotification?: boolean;
}

const TopNavItem: React.FC<TopNavItemProps> = ({ view, currentView, setCurrentView, children, hasNotification }) => (
  <button
    onClick={() => setCurrentView(view)}
    className={`relative flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
      currentView === view
        ? 'border-primary text-primary'
        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
    }`}
  >
    {children}
    {hasNotification && <span className="absolute top-2 right-2 block w-2 h-2 bg-secondary rounded-full"></span>}
  </button>
);

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User;
  onLogOut: () => void;
  hasNewEvents: boolean;
  hasNewPolls: boolean;
  hasNewTodos: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, currentUser, onLogOut, hasNewEvents, hasNewPolls, hasNewTodos }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  const handleProfileLogOutClick = () => {
    onLogOut();
    setIsProfileMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-sm w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary mr-6">Booster Hub</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <TopNavItem view={AppView.CHAT} currentView={currentView} setCurrentView={setCurrentView}>
              <ChatBubbleIcon className="w-5 h-5 mr-2" />
              {AppView.CHAT}
            </TopNavItem>
            <TopNavItem view={AppView.CALENDAR} currentView={currentView} setCurrentView={setCurrentView} hasNotification={hasNewEvents}>
              <CalendarIcon className="w-5 h-5 mr-2" />
              {AppView.CALENDAR}
            </TopNavItem>
            <TopNavItem view={AppView.POLLS_VOTES} currentView={currentView} setCurrentView={setCurrentView} hasNotification={hasNewPolls}>
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Polls
            </TopNavItem>
            <TopNavItem view={AppView.TODO} currentView={currentView} setCurrentView={setCurrentView} hasNotification={hasNewTodos}>
              <ListBulletIcon className="w-5 h-5 mr-2" />
              To-Do
            </TopNavItem>
            <TopNavItem view={AppView.MEMBERS} currentView={currentView} setCurrentView={setCurrentView}>
              <UsersIcon className="w-5 h-5 mr-2" />
              Members
            </TopNavItem>
            {currentUser.isAdmin && (
              <TopNavItem view={AppView.ADMIN} currentView={currentView} setCurrentView={setCurrentView}>
                <Cog8ToothIcon className="w-5 h-5 mr-2" />
                Admin
              </TopNavItem>
            )}
          </nav>
          <div className="flex items-center">
            <div className="relative ml-4" ref={profileMenuRef}>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full p-1">
                  <div className="text-right mr-3 hidden sm:block">
                    <p className="font-semibold text-sm text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role}{currentUser.isAdmin && ' (Admin)'}</p>
                  </div>
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
              </button>
              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <button
                        onClick={handleProfileLogOutClick}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />
                        Log Out
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface BottomNavItemProps {
  view: AppView;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
  label: string;
  hasNotification?: boolean;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ view, currentView, setCurrentView, children, label, hasNotification }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => setCurrentView(view)}
      className={`relative flex flex-col items-center justify-center w-full h-16 pt-2 pb-1 text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-sm ${
        isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
      }`}
    >
      {hasNotification && <span className="absolute top-2 right-[calc(50%-1.25rem)] block w-2 h-2 bg-secondary rounded-full border border-white"></span>}
      {children}
      <span className="mt-1">{label}</span>
    </button>
  );
};


interface BottomNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User;
  hasNewEvents: boolean;
  hasNewPolls: boolean;
  hasNewTodos: boolean;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setCurrentView, currentUser, hasNewEvents, hasNewPolls, hasNewTodos }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
            <div className="flex justify-around items-center">
                <BottomNavItem view={AppView.CHAT} currentView={currentView} setCurrentView={setCurrentView} label="Chat">
                    <ChatBubbleIcon className="w-6 h-6"/>
                </BottomNavItem>
                <BottomNavItem view={AppView.CALENDAR} currentView={currentView} setCurrentView={setCurrentView} label="Calendar" hasNotification={hasNewEvents}>
                    <CalendarIcon className="w-6 h-6"/>
                </BottomNavItem>
                <BottomNavItem view={AppView.POLLS_VOTES} currentView={currentView} setCurrentView={setCurrentView} label="Polls" hasNotification={hasNewPolls}>
                    <ChartBarIcon className="w-6 h-6"/>
                </BottomNavItem>
                <BottomNavItem view={AppView.TODO} currentView={currentView} setCurrentView={setCurrentView} label="To-Do" hasNotification={hasNewTodos}>
                    <ListBulletIcon className="w-6 h-6"/>
                </BottomNavItem>
                <BottomNavItem view={AppView.MEMBERS} currentView={currentView} setCurrentView={setCurrentView} label="Members">
                    <UsersIcon className="w-6 h-6"/>
                </BottomNavItem>
                 {currentUser.isAdmin && (
                    <BottomNavItem view={AppView.ADMIN} currentView={currentView} setCurrentView={setCurrentView} label="Admin">
                        <Cog8ToothIcon className="w-6 h-6"/>
                    </BottomNavItem>
                 )}
            </div>
        </nav>
    );
};


// --- VIEWS ---

interface ChatViewProps {
    users: User[];
    messages: Message[];
    currentUser: User;
    onSendMessage: (text: string, attachment?: Attachment | null) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ users, messages, currentUser, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getUser = (userId: string) => users.find(u => u.id === userId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const url = event.target?.result as string;
            if (file.type.startsWith('image/')) {
                setAttachment({ name: file.name, type: 'image', url });
            } else {
                setAttachment({ name: file.name, type: 'file', url });
            }
        };
        reader.readAsDataURL(file);
        
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() || attachment) {
            onSendMessage(newMessage.trim(), attachment);
            setNewMessage('');
            setAttachment(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            <header className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">Team Chat</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => {
                    const user = getUser(message.userId);
                    const isCurrentUser = message.userId === currentUser.id;
                    return (
                        <div key={message.id} className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-lg ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {!isCurrentUser && <p className="font-semibold text-sm mb-1">{user?.name} <span className="text-[10px] font-normal opacity-70">({user?.role})</span></p>}
                                {message.attachment && (
                                    <div className="mb-2">
                                        {message.attachment.type === 'image' ? (
                                            <img src={message.attachment.url} alt={message.attachment.name} className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer" onClick={() => window.open(message.attachment.url, '_blank')} />
                                        ) : (
                                            <div className={`p-3 rounded-lg flex items-center space-x-2 ${isCurrentUser ? 'bg-blue-400' : 'bg-gray-300'}`}>
                                                <DocumentIcon className={`w-8 h-8 flex-shrink-0 ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`} />
                                                <span className={`text-sm font-medium ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>{message.attachment.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {message.text && <p>{message.text}</p>}
                                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
             {attachment && (
                <div className="p-2 border-t">
                    <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2 overflow-hidden">
                            {attachment.type === 'image' ? (
                                <img src={attachment.url} alt="preview" className="w-10 h-10 rounded object-cover" />
                            ) : (
                                <DocumentIcon className="w-8 h-8 text-gray-600 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
                        </div>
                        <button onClick={() => setAttachment(null)} className="p-1 text-gray-500 hover:text-red-500 rounded-full">
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
            <div className="p-4 border-t bg-gray-50">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                     <input type="file" id="chat-file-input" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-blue-500 rounded-lg">
                        <PaperClipIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300" disabled={!newMessage.trim() && !attachment}>
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

interface CalendarViewProps {
    events: CalendarEvent[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => (
    <div className="flex-1 flex flex-col bg-white">
        <header className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Upcoming Events</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {events.map(event => (
                <div key={event.id} className="p-4 bg-gray-100 rounded-lg border-l-4 border-primary shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 font-medium">{event.date.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="mt-2 text-gray-700">{event.description}</p>
                    {event.location && (
                        <p className="mt-2 text-gray-700 text-sm italic">
                            <span className="font-semibold not-italic">Location:</span> {event.location}
                        </p>
                    )}
                </div>
            ))}
        </div>
    </div>
);

interface PollsViewProps {
    polls: Poll[];
    currentUser: User;
    users: User[];
    onVote: (pollId: string, optionId: string) => void;
    onTogglePollStatus: (pollId: string) => void;
}

const PollsView: React.FC<PollsViewProps> = ({ polls, currentUser, onVote, users, onTogglePollStatus }) => {
    const getUser = (userId: string) => users.find(u => u.id === userId);
    
    return (
    <div className="flex-1 flex flex-col bg-white">
        <header className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Polls & Votes</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-10 pt-8">
            {polls.map(poll => {
                const userVote = poll.votes.find(v => v.userId === currentUser.id);
                
                let maxVotes = -1;
                let winners: string[] = [];
                poll.options.forEach(opt => {
                    const count = poll.votes.filter(v => v.optionId === opt.id).length;
                    if (count > maxVotes) {
                        maxVotes = count;
                        winners = [opt.id];
                    } else if (count === maxVotes && count > 0) {
                        winners.push(opt.id);
                    }
                });

                return (
                    <div key={poll.id} className={`p-6 rounded-xl border-2 transition-all relative ${poll.isOpen ? 'bg-gray-50 border-gray-100 shadow-sm' : 'bg-gray-100 border-gray-300 opacity-90'}`}>
                        {!poll.isOpen && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg z-20 whitespace-nowrap">
                                Final Results &bull; Closed
                            </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div className="flex-1">
                                <h3 className={`font-bold text-xl leading-tight ${poll.isOpen ? 'text-gray-800' : 'text-gray-600'}`}>{poll.question}</h3>
                                <p className="text-xs text-gray-500 mt-1">Created by {getUser(poll.createdBy)?.name}</p>
                            </div>
                            {currentUser.isAdmin && (
                                <button
                                    onClick={() => onTogglePollStatus(poll.id)}
                                    className={`flex-shrink-0 px-4 py-2 text-xs font-black tracking-widest uppercase rounded-full shadow-sm transition-all whitespace-nowrap ${
                                        poll.isOpen 
                                        ? 'bg-accent text-white hover:bg-red-800' 
                                        : 'bg-primary text-white hover:bg-blue-800'
                                    }`}
                                >
                                    {poll.isOpen ? 'Complete Poll' : 'Re-open Poll'}
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {poll.options.map(option => {
                                const votesForOption = poll.votes.filter(v => v.optionId === option.id);
                                const voteCount = votesForOption.length;
                                const isSelected = userVote?.optionId === option.id;
                                const isWinner = !poll.isOpen && winners.includes(option.id);

                                return (
                                    <div key={option.id} className={`flex flex-col p-5 rounded-2xl border-2 transition-all relative ${
                                        isWinner 
                                            ? 'border-secondary bg-amber-50 shadow-md scale-[1.02] z-10' 
                                            : isSelected 
                                                ? 'border-primary bg-blue-50/50' 
                                                : 'border-gray-200 bg-white'
                                    }`}>
                                        {isWinner && (
                                            <div className="absolute -top-2 -right-2 bg-secondary text-white px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm whitespace-nowrap">
                                                Top Choice
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`block font-bold text-lg leading-tight ${isWinner ? 'text-amber-900' : isSelected ? 'text-primary' : 'text-gray-800'}`}>{option.text}</span>
                                            {poll.isOpen && (
                                                <button
                                                    onClick={() => onVote(poll.id, option.id)}
                                                    className={`flex-shrink-0 ml-2 px-3 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap ${
                                                        isSelected 
                                                        ? 'bg-primary text-white cursor-default shadow-sm' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                                    }`}
                                                >
                                                    {isSelected ? 'Selected' : 'Vote'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="my-3">
                                            <div className="flex items-baseline">
                                                <span className={`text-5xl font-extrabold tracking-tight ${isWinner ? 'text-secondary' : isSelected ? 'text-primary' : 'text-gray-900'}`}>{voteCount}</span>
                                                <span className={`ml-2 text-sm font-semibold uppercase tracking-wider ${isWinner ? 'text-amber-700' : isSelected ? 'text-blue-600' : 'text-gray-500'}`}>{voteCount === 1 ? 'vote' : 'votes'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto pt-3 border-t border-gray-100">
                                            {votesForOption.length > 0 ? (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {votesForOption.map(vote => {
                                                        const voter = getUser(vote.userId);
                                                        return voter ? (
                                                            <div key={voter.id} className="flex items-center bg-gray-100 border border-gray-200 rounded-full pl-1 pr-2 py-0.5 shadow-sm">
                                                                <img 
                                                                    src={voter.avatar} 
                                                                    alt={voter.name}
                                                                    className="w-5 h-5 rounded-full ring-2 ring-white"
                                                                />
                                                                <span className="ml-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">{voter.name}</span>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="h-6 flex items-center">
                                                    <p className="text-xs text-gray-400 italic whitespace-nowrap">No votes yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
    )
};

interface TodoViewProps {
    todos: Todo[];
    users: User[];
    onToggleTodo: (id: string) => void;
}

const TodoView: React.FC<TodoViewProps> = ({ todos, users, onToggleTodo }) => {
    const getUser = (userId: string) => users.find(u => u.id === userId);
    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => (
        <li className="flex items-center p-3 bg-gray-100 rounded-lg">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={`ml-3 flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.text}
            </span>
            {todo.completed && todo.completedBy && (
                <span className="text-xs text-gray-400">
                    Completed by {getUser(todo.completedBy)?.name}
                </span>
            )}
        </li>
    );

    return (
        <div className="flex-1 flex flex-col bg-white">
            <header className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">To-Do List</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Pending</h2>
                    {pendingTodos.length > 0 ? (
                        <ul className="space-y-3">
                            {pendingTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic text-sm">No pending tasks. Great job!</p>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed</h2>
                    {completedTodos.length > 0 ? (
                        <ul className="space-y-3">
                            {completedTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic text-sm">No tasks completed yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface MembersViewProps {
    users: User[];
}

const MembersView: React.FC<MembersViewProps> = ({ users }) => (
    <div className="flex-1 flex flex-col bg-white">
        <header className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Members List</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
            <ul className="divide-y divide-gray-200">
                {users.map(user => (
                    <li key={user.id} className="py-4 flex items-center">
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                        <div className="ml-3">
                            <p className="text-sm font-bold text-gray-900">{user.name} {user.isAdmin && <span className="ml-2 text-[10px] bg-blue-100 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{user.role}</p>
                            {user.shareInfo && <p className="text-sm text-gray-500 mt-1">{user.email} &middot; {user.phone}</p>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

interface MemberFormModalProps {
    user: User | null;
    isLastAdmin: boolean;
    onSave: (userData: Omit<User, 'id' | 'avatar'> & { avatar: string }) => void;
    onClose: () => void;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({ user, isLastAdmin, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState(BOOSTER_ROLES[BOOSTER_ROLES.length - 1]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [shareInfo, setShareInfo] = useState(true);
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role);
            setIsAdmin(user.isAdmin);
            setPhone(user.phone || '');
            setEmail(user.email || '');
            setShareInfo(user.shareInfo === undefined ? true : user.shareInfo);
            setAvatar(user.avatar);
        } else {
            setName('');
            setRole('Member');
            setIsAdmin(false);
            setPhone('');
            setEmail('');
            setShareInfo(true);
            setAvatar(null);
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Please fill out the name.');
            return;
        }
        
        // Safeguard: Cannot remove admin status if this is the only admin
        if (user && user.isAdmin && isLastAdmin && !isAdmin) {
          alert('System Safety Lock: At least one Administrator must exist. You cannot remove the last admin privileges.');
          return;
        }

        const finalAvatar = avatar || `https://i.pravatar.cc/150?u=${Date.now()}`;
        onSave({ name, role, isAdmin, phone, email, shareInfo, avatar: finalAvatar });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{user ? 'Edit Member' : 'Create New Member'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                )}
                            </div>
                            <div>
                                <input type="file" id="member-avatar-upload" accept="image/*" onChange={handleAvatarChange} className="hidden" ref={fileInputRef} />
                                <label htmlFor="member-avatar-upload" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Upload Photo
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nameModal" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="nameModal" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="roleModal" className="block text-sm font-medium text-gray-700">Booster Club Role</label>
                                <select 
                                    id="roleModal" 
                                    value={role} 
                                    onChange={e => setRole(e.target.value)} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {BOOSTER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
                            <div>
                                <h3 className="text-sm font-bold text-blue-900">App Admin Permissions</h3>
                                <p className="text-xs text-blue-700">Grant access to Admin Panel for managing events and members.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="emailModal" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="emailModal" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="phoneModal" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" id="phoneModal" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="shareInfoModal" name="shareInfo" type="checkbox" checked={shareInfo} onChange={e => setShareInfo(e.target.checked)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="shareInfoModal" className="font-medium text-gray-700">Share contact info with members</label>
                                <p className="text-gray-500 text-xs">If checked, contact details will be visible in the Members List.</p>
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700">
                                {user ? 'Update Member' : 'Create Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


interface AdminViewProps {
    users: User[];
    onCreateMember: (memberData: Omit<User, 'id'>) => void;
    onUpdateMember: (memberData: User) => void;
    onDeleteMember: (userId: string) => void;
    onCreateEvent: (eventData: { title: string; date: Date; description: string; location: string; }) => void;
    onCreatePoll: (pollData: { question: string; options: string[]; type: 'multi-choice' | 'yes-no' }) => void;
    onCreateTodo: (text: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ users, onCreateMember, onUpdateMember, onDeleteMember, onCreateEvent, onCreatePoll, onCreateTodo }) => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [eventTime, setEventTime] = useState('19:00');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState<string[]>([]);
    const [currentOption, setCurrentOption] = useState('');
    const [pollType, setPollType] = useState<'multi-choice' | 'yes-no'>('multi-choice');

    const [todoText, setTodoText] = useState('');
    
    type AdminAction = 'event' | 'poll' | 'todo' | 'member';
    const [activeAction, setActiveAction] = useState<AdminAction>('event');

    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const adminCount = users.filter(u => u.isAdmin).length;

    const handleCreateEventSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateEvent({ title: eventTitle, date: new Date(`${eventDate}T${eventTime}`), description: eventDescription, location: eventLocation });
        setEventTitle('');
        setEventDescription('');
        setEventLocation('');
    };
    
    const handleAddOption = () => {
        if (currentOption.trim() && !pollOptions.includes(currentOption.trim())) {
            setPollOptions([...pollOptions, currentOption.trim()]);
            setCurrentOption('');
        }
    };

    const handleCreatePollSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreatePoll({ 
            question: pollQuestion, 
            options: pollType === 'yes-no' ? ['Yes', 'No'] : pollOptions,
            type: pollType 
        });
        setPollQuestion('');
        setPollOptions([]);
    };

    const handleCreateTodoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!todoText.trim()) return;
        onCreateTodo(todoText);
        setTodoText('');
    };

    const handleAddNewMemberClick = () => {
        setEditingUser(null);
        setIsMemberModalOpen(true);
    };

    const handleEditMemberClick = (user: User) => {
        setEditingUser(user);
        setIsMemberModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        if (user.isAdmin && adminCount === 1) {
            alert('System Safety Lock: You cannot delete the last Administrator. Assign admin rights to someone else first.');
            return;
        }
        setUserToDelete(user);
    };

    const confirmDeletion = () => {
        if (userToDelete) {
            onDeleteMember(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const actionConfig = [
        { id: 'event', label: 'Add Event', icon: <CalendarIcon /> },
        { id: 'poll', label: 'Create Poll', icon: <ChartBarIcon /> },
        { id: 'todo', label: 'Add To-Do', icon: <ListBulletIcon /> },
        { id: 'member', label: 'Members', icon: <UsersIcon /> },
    ];

    return (
        <div className="flex-1 flex flex-col bg-white">
            <header className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-6">
                {isMemberModalOpen && (
                    <MemberFormModal 
                        user={editingUser}
                        isLastAdmin={adminCount === 1}
                        onSave={(data) => {
                          if (editingUser) onUpdateMember({ ...data, id: editingUser.id });
                          else onCreateMember(data);
                          setIsMemberModalOpen(false);
                        }}
                        onClose={() => setIsMemberModalOpen(false)}
                    />
                )}

                {/* --- CUSTOM DELETE PROMPT --- */}
                {userToDelete && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrashIcon className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
                                <p className="text-sm text-gray-600">
                                    You are about to delete <span className="font-bold text-gray-900">{userToDelete.name}</span>. 
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                            <div className="flex border-t divide-x">
                                <button 
                                    onClick={() => setUserToDelete(null)}
                                    className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDeletion}
                                    className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                     <div className="bg-white border-y border-gray-200">
                        <nav className="flex justify-around">
                            {actionConfig.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => setActiveAction(action.id as AdminAction)}
                                    className={`flex-1 flex flex-col items-center p-3 border-b-4 transition-colors ${
                                        activeAction === action.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-primary'
                                    }`}
                                >
                                    {React.cloneElement(action.icon, { className: 'w-6 h-6 mb-1' })}
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        {activeAction === 'event' && (
                            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
                                <h2 className="font-bold text-gray-800">New Calendar Event</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Event Title</label>
                                    <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                    <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <input type="text" placeholder="Location" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                <textarea placeholder="Description" value={eventDescription} onChange={e => setEventDescription(e.target.value)} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-transform">Post Event</button>
                            </form>
                        )}
                        {activeAction === 'poll' && (
                            <form onSubmit={handleCreatePollSubmit} className="space-y-4">
                                <h2 className="font-bold text-gray-800">New Poll</h2>
                                <input type="text" placeholder="Question" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setPollType('multi-choice')} className={`flex-1 py-2 rounded-lg border font-bold text-sm ${pollType === 'multi-choice' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 bg-white'}`}>Choice</button>
                                    <button type="button" onClick={() => setPollType('yes-no')} className={`flex-1 py-2 rounded-lg border font-bold text-sm ${pollType === 'yes-no' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 bg-white'}`}>Yes/No</button>
                                </div>
                                {pollType === 'multi-choice' && (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input type="text" value={currentOption} onChange={e => setCurrentOption(e.target.value)} placeholder="Option text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                            <button type="button" onClick={handleAddOption} className="px-4 bg-gray-200 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {pollOptions.map((opt, i) => (
                                                <span key={i} className="bg-white border px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 flex items-center shadow-sm">
                                                    {opt}
                                                    <button type="button" onClick={() => setPollOptions(pollOptions.filter(o => o !== opt))} className="ml-2 text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold shadow-sm hover:bg-blue-700 transition-colors">Create Poll</button>
                            </form>
                        )}
                        {activeAction === 'todo' && (
                            <form onSubmit={handleCreateTodoSubmit} className="space-y-4">
                                <h2 className="font-bold text-gray-800">New Task</h2>
                                <div className="flex gap-2">
                                    <input type="text" value={todoText} onChange={e => setTodoText(e.target.value)} placeholder="What needs to be done?" required className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                    <button type="submit" className="px-5 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-colors">Add</button>
                                </div>
                            </form>
                        )}
                        {activeAction === 'member' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <h2 className="font-bold text-gray-800">Manage Members</h2>
                                    <button onClick={handleAddNewMemberClick} className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center shadow-md hover:bg-blue-700 transition-colors">
                                        <UserPlusIcon className="w-4 h-4 mr-2" />
                                        Add Member
                                    </button>
                                </div>
                                <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden shadow-sm">
                                    {users.map(user => (
                                        <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full border border-gray-200" src={user.avatar} alt={user.name} />
                                                <div className="ml-3">
                                                    <p className="text-sm font-bold text-gray-900 leading-none">{user.name} {user.isAdmin && <span className="ml-2 text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full uppercase font-black">Admin</span>}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1.5 font-bold">{user.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleEditMemberClick(user)} 
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                                    title="Edit Member"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(user)} 
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                    title="Delete Member"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [users, setUsers] = useState<User[]>(USERS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [hasNewEvents, setHasNewEvents] = useState(false);
  const [hasNewPolls, setHasNewPolls] = useState(false);
  const [hasNewTodos, setHasNewTodos] = useState(false);

  useEffect(() => {
    setHasNewEvents(events.some(e => e.isNew));
    setHasNewPolls(polls.some(p => currentUser && !p.seenBy.includes(currentUser.id)));
    setHasNewTodos(todos.some(t => !t.completed));
  }, [events, polls, todos, currentUser]);

  const handleSetCurrentView = (view: AppView) => {
    if (view === AppView.CALENDAR) {
        setEvents(prev => prev.map(e => ({ ...e, isNew: false })));
    }
    if (view === AppView.POLLS_VOTES && currentUser) {
        setPolls(prev => prev.map(p => {
            if (!p.seenBy.includes(currentUser.id)) {
                return { ...p, seenBy: [...p.seenBy, currentUser.id] };
            }
            return p;
        }));
    }
    setCurrentView(view);
  };

  const handleSendMessage = (text: string, attachment?: Attachment | null) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      userId: currentUser.id,
      text,
      timestamp: new Date(),
      ...(attachment && { attachment }),
    };
    setMessages([...messages, newMessage]);
  };

  const handleCreateMember = (memberData: Omit<User, 'id'>) => {
    const newUser: User = {
        id: `u${Date.now()}`,
        ...memberData,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleUpdateMember = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    // Update current user if they updated themselves
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };
  
  const handleDeleteMember = (userId: string) => {
    // If deleting self, logout first
    if (currentUser && currentUser.id === userId) {
        if (window.confirm("You are deleting your own account. You will be logged out immediately. Continue?")) {
            setUsers(users.filter(user => user.id !== userId));
            handleLogOut();
        }
        return;
    }
    setUsers(users.filter(user => user.id !== userId));
  };
  
  const handleCreateEvent = (eventData: { title: string; date: Date; description: string; location: string; }) => {
    const newEvent: CalendarEvent = {
        id: `e${Date.now()}`,
        ...eventData,
        isNew: true,
    };
    setEvents(prevEvents => [...prevEvents, newEvent].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  const handleCreatePoll = (pollData: { question: string; options: string[]; type: 'multi-choice' | 'yes-no' }) => {
    if (!currentUser) return;
    const newPoll: Poll = {
        id: `p${Date.now()}`,
        question: pollData.question,
        options: pollData.options.map((opt, index) => ({ id: `o${index}-${Date.now()}`, text: opt })),
        votes: [],
        createdBy: currentUser.id,
        isOpen: true,
        type: pollData.type,
        seenBy: [currentUser.id],
    };
    setPolls(prevPolls => [newPoll, ...prevPolls]);
  };

  const handleCreateTodo = (text: string) => {
    const newTodo: Todo = {
        id: `t${Date.now()}`,
        text,
        completed: false,
        isNew: true,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };


  const handleToggleTodo = (id: string) => {
    if (!currentUser) return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed, completedBy: !todo.completed ? currentUser.id : undefined } : todo
    ));
  };
  
  const handleVote = (pollId: string, optionId: string) => {
    if (!currentUser) return;
    setPolls(polls.map(poll => {
      if (poll.id === pollId && poll.isOpen) {
        const otherVotes = poll.votes.filter(vote => vote.userId !== currentUser.id);
        const existingVote = poll.votes.find(v => v.userId === currentUser.id && v.optionId === optionId);
        if (existingVote) return { ...poll, votes: otherVotes };
        return { ...poll, votes: [...otherVotes, { userId: currentUser.id, optionId }] };
      }
      return poll;
    }));
  };

  const handleTogglePollStatus = (pollId: string) => {
    if (!currentUser?.isAdmin) return;
    setPolls(polls.map(poll => poll.id === pollId ? { ...poll, isOpen: !poll.isOpen } : poll));
  };
  
  const handleLogin = (email: string) => {
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (user) {
        setCurrentUser(user);
        setCurrentView(AppView.CHAT);
    } else {
        alert('User not found. Please use one of the demo accounts.');
    }
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    setCurrentView(AppView.CHAT);
  };

  const renderView = () => {
    if (!currentUser) return null;
    
    switch (currentView) {
      case AppView.CHAT:
        return <ChatView users={users} messages={messages} currentUser={currentUser} onSendMessage={handleSendMessage} />;
      case AppView.CALENDAR:
        return <CalendarView events={events} />;
      case AppView.POLLS_VOTES:
        return <PollsView polls={polls} currentUser={currentUser} onVote={handleVote} users={users} onTogglePollStatus={handleTogglePollStatus} />;
      case AppView.TODO:
        return <TodoView todos={todos} onToggleTodo={handleToggleTodo} users={users} />;
      case AppView.MEMBERS:
        return <MembersView users={users} />;
      case AppView.ADMIN:
        if (!currentUser.isAdmin) {
            handleSetCurrentView(AppView.CHAT);
            return null;
        }
        return <AdminView 
                    users={users}
                    onCreateMember={handleCreateMember}
                    onUpdateMember={handleUpdateMember}
                    onDeleteMember={handleDeleteMember}
                    onCreateEvent={handleCreateEvent} 
                    onCreatePoll={handleCreatePoll} 
                    onCreateTodo={handleCreateTodo} 
                />;
      default:
        return <ChatView users={users} messages={messages} currentUser={currentUser} onSendMessage={handleSendMessage} />;
    }
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-neutral font-sans selection:bg-primary/20">
      <Header 
        currentView={currentView} 
        setCurrentView={handleSetCurrentView} 
        currentUser={currentUser} 
        onLogOut={handleLogOut} 
        hasNewEvents={hasNewEvents}
        hasNewPolls={hasNewPolls}
        hasNewTodos={hasNewTodos}
      />
      <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
        {renderView()}
      </main>
      {currentUser && (
          <BottomNavBar
            currentView={currentView}
            setCurrentView={handleSetCurrentView}
            currentUser={currentUser}
            hasNewEvents={hasNewEvents}
            hasNewPolls={hasNewPolls}
            hasNewTodos={hasNewTodos}
          />
      )}
    </div>
  );
};

export default App;