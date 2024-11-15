import React from 'react';
import { MessageSquare, LogOut, Terminal } from 'lucide-react';
import { User } from '../types/chat';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-500" />
        <h1 className="text-xl font-semibold">ChatBot UDC</h1>
        {user?.isDev && (
          <span className="px-2 py-0.5 text-xs font-medium text-white bg-gray-800 rounded-full flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            Modo Desarrollo
          </span>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      )}
    </header>
  );
};