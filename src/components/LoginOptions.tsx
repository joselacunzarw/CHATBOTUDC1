import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Terminal } from 'lucide-react';

interface LoginOptionsProps {
  onGoogleSuccess: (response: any) => void;
  onDevLogin: () => void;
}

export const LoginOptions: React.FC<LoginOptionsProps> = ({
  onGoogleSuccess,
  onDevLogin,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={() => console.log('Error de inicio de sesión')}
        text="continue_with"
        locale="es"
      />
      
      <div className="flex items-center gap-2 my-2">
        <div className="h-px bg-gray-300 flex-1" />
        <span className="text-sm text-gray-500">o</span>
        <div className="h-px bg-gray-300 flex-1" />
      </div>

      <button
        onClick={onDevLogin}
        className="flex items-center gap-2 px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
      >
        <Terminal className="w-4 h-4" />
        <span>Modo Desarrollo</span>
      </button>
    </div>
  );
};