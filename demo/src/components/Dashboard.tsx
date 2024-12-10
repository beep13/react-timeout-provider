import React from 'react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="dashboard">
      <header>
        <h1>Secure Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      <main>
        <h2>Protected Content</h2>
        <p>This content will be inaccessible after timeout.</p>
        <div className="demo-actions">
          <h3>Try it out:</h3>
          <ol>
            <li>Wait 30 seconds to see the warning</li>
            <li>Move your mouse to reset the timer</li>
            <li>Let it timeout to get logged out</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 