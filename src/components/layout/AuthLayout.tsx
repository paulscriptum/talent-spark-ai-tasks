
import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6">
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Task Assessor</h1>
          <p className="text-gray-400">Generate and analyze tech assessment tasks</p>
        </div>
        
        <div className="w-full bg-black/40 border border-gray-800 p-6 rounded-lg backdrop-blur-lg">
          {children || (
            <div className="text-center p-4">
              <p>Sign in component could not be loaded.</p>
              <p className="mt-2 text-sm text-gray-400">Try refreshing the page.</p>
              <Link to="/" className="text-primary hover:underline mt-4 block">
                Return to Home
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Task Assessor. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
