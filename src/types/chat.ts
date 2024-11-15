export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  isDev?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  user: User | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
  setUser: (user: User | null) => void;
}