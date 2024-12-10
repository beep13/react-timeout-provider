# react-timeout-provider

A React provider for managing session timeouts and user inactivity. Automatically track user activity and handle session timeouts with configurable warnings and actions.

## Installation
```bash
npm install react-timeout-provider
```

## Basic Usage
```typescript
import { TimeoutProvider } from 'react-timeout-provider';

function App() {
  const handleTimeout = async () => {
    // Handle timeout (e.g., logout)
    await logout();
  };

  return (
    <TimeoutProvider
      timeoutDuration={5 * 60 * 1000} // 5 minutes
      warningDuration={30 * 1000} // 30 second warning
      onTimeout={handleTimeout}
      onWarning={() => console.log('Warning: Session about to timeout')}
      >
      <YourApp />
    </TimeoutProvider>
  );
}
```

## Features

- ⏰ Configurable timeout and warning durations
- 🔄 Automatic timer reset on user activity
- ⚛️ React Context for timeout state management
- 🎨 Customizable warning component
- 📱 Touch device support


## API

### TimeoutProvider Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `timeoutDuration` | `number` | Yes | - | Total time in milliseconds before timeout occurs |
| `warningDuration` | `number` | Yes | - | Time in milliseconds before timeout to show warning |
| `onTimeout` | `() => Promise<void>` | Yes | - | Function called when timeout occurs |
| `onWarning` | `() => void` | No | - | Function called when warning appears |
| `children` | `ReactNode` | Yes | - | Child components |
| `warningMessage` | `string` | No | - | Custom warning message |
| `WarningComponent` | `ComponentType<WarningProps>` | No | `DefaultWarning` | Custom warning component |
| `activityEvents` | `string[]` | No | `['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']` | DOM events to monitor |
| `minResetDuration` | `number` | No | `1000` | Minimum time between activity resets |
| `isEnabled` | `boolean` | No | `true` | Enable/disable the timeout |

### Custom Warning Component
```typescript
interface WarningProps {
  message: string;
  remainingSeconds: number;
  onExtend: () => void;
  className?: string;
  formatTime?: (seconds: number) => string;
}

const CustomWarning = ({ message, remainingSeconds, onExtend }: WarningProps) => (
  <div className="my-warning">
    <p>{message || Session expires in ${remainingSeconds} seconds}</p>
    <button onClick={onExtend}>Extend Session</button>
  </div>
);

// Use it in the provider
<TimeoutProvider
WarningComponent={CustomWarning}
// ... other props
>
```

## Examples

### With React Router and Authentication
```typescript
typescript
function App() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleTimeout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <TimeoutProvider
      timeoutDuration={30 * 60 * 1000} // 30 minutes
      warningDuration={60 * 1000} // 1 minute warning
      onTimeout={handleTimeout}
      onWarning={() => console.log('Session expiring soon')}
    >
      <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      {/ ... other routes /}
      </Routes>
    </TimeoutProvider>
  );
}
```

### With Custom Warning Component
```typescript
function App() {
  return (
  <TimeoutProvider
    timeoutDuration={5 60 1000}
    warningDuration={30 1000}
    onTimeout={handleTimeout}
    WarningComponent={({ remainingSeconds, onExtend }) => (
      <div className="custom-warning">
      <h3>Session Expiring</h3>
      <p>Your session will expire in {remainingSeconds} seconds</p>
      <button onClick={onExtend} className="extend-button">
      Continue Working
      </button>
      </div>
    )}
  >
    <YourApp />
  </TimeoutProvider>
  );
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development
```bash
// Clone the repository 
git clone https://github.com/beep13/react-timeout-provider.git

// Install dependencies
npm install

// Run tests
npm test

// Run demo
cd demo
npm install
npm run dev
```

### Bug Reports

If you discover any bugs, please create an issue in the GitHub repository including:

- Your operating system name and version
- Any details about your local setup that might be helpful in troubleshooting
- Detailed steps to reproduce the bug

## License

MIT © [beep13](https://github.com/beep13)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
