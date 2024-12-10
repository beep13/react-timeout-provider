import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="login">
      <h1>Login</h1>
      <button onClick={onLogin}>
        Log In (Demo)
      </button>
    </div>
  );
};

export default Login; 