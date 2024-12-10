import React, { useState } from 'react';
import { TimeoutProvider } from 'react-timeout-provider';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTimeout = async () => {
    console.log('Session timed out');
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <TimeoutProvider
          timeoutDuration={1 * 60 * 1000} // 1 minute
          warningDuration={30 * 1000}      // 30 second warning
          onTimeout={handleTimeout}
          onWarning={() => console.log('Warning: Session about to timeout')}
        >
          <Dashboard onLogout={() => setIsLoggedIn(false)} />
        </TimeoutProvider>
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App; 