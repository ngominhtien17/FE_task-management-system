import { Suspense } from 'react';
import { AppRouter } from './routes';
import './App.css';

function App() {
  return (
    <Suspense fallback={
      <div className="suspense-container flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    }>
      <div className="app-container min-h-screen">
        <AppRouter />
      </div>
    </Suspense>
  );
}

export default App;