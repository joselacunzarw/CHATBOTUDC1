import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bot, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  userPicture: string;
}

const StatusIcon = ({ status }: { status: Message['status'] }) => {
  const statusTitles = {
    sent: 'Enviado',
    error: 'Error',
    sending: 'Enviando',
  };

  switch (status) {
    case 'sent':
      return <CheckCircle2 className="w-4 h-4 text-green-500" title={statusTitles[status]} />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" title={statusTitles[status]} />;
    case 'sending':
      return <Clock className="w-4 h-4 text-gray-500 animate-pulse" title={statusTitles[status]} />;
  }
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userPicture }) => {
  const isUser = message.role === 'user';
  const botPicture = 'https://ui-avatars.com/api/?name=UDC&background=e2e8f0&color=64748b';

  return (
    <div
      className={`flex gap-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } items-start mb-4`}
    >
      <img
        src={isUser ? userPicture : botPicture}
        alt={isUser ? 'Usuario' : 'Bot'}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div
        className={`flex flex-col max-w-[80%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          {format(message.timestamp, 'HH:mm', { locale: es })}
          <StatusIcon status={message.status} />
        </div>
      </div>
    </div>
  );
};