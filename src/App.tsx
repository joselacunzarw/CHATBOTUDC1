import React, { useCallback, useEffect } from 'react';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { LoginOptions } from './components/LoginOptions';
import { useChatStore } from './store/chatStore';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const { messages, isTyping, user, addMessage, setTyping, setUser } = useChatStore();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!user) return;

    addMessage({ role: 'user', content, status: 'sending' });

    try {
      if (user.isDev) {
        // Simulate API response in dev mode
        setTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        addMessage({
          role: 'assistant',
          content: `[MODO DESARROLLO] Recibido: ${content}`,
          status: 'sent',
        });
        return;
      }

      const response = await fetch(`${API_URL}/consultar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');

      const data = await response.json();
      setTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addMessage({
        role: 'assistant',
        content: data.reply,
        status: 'sent',
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const updatedMessages = [...messages];
      updatedMessages[updatedMessages.length - 1].status = 'error';
      useChatStore.setState({ messages: updatedMessages });
    } finally {
      setTyping(false);
    }
  }, [messages, user, addMessage, setTyping]);

  const handleLogout = useCallback(() => {
    if (!user?.isDev) {
      googleLogout();
    }
    setUser(null);
  }, [user, setUser]);

  const handleDevLogin = () => {
    setUser({
      id: 'dev-user',
      name: 'Desarrollador',
      email: 'dev@local',
      picture: 'https://ui-avatars.com/api/?name=Dev&background=6366f1&color=fff',
      isDev: true,
    });
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
    setUser({
      id: credentialResponse.credential,
      name: decoded.name || 'Usuario',
      email: decoded.email || '',
      picture: decoded.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name || 'Usuario')}`,
      isDev: false,
    });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header user={user} onLogout={handleLogout} />
        
        {!user ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Bienvenido al ChatBot UDC
            </h2>
            <p className="text-gray-600 mb-4">
              Por favor, inicia sesión para comenzar a chatear
            </p>
            <LoginOptions
              onGoogleSuccess={handleGoogleSuccess}
              onDevLogin={handleDevLogin}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  userPicture={user.picture}
                />
              ))}
              {isTyping && (
                <div className="flex gap-2 text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200" />
                </div>
              )}
            </div>
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;