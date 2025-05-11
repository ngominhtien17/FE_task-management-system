// src/App.tsx
import { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
// import { AppRouter } from './routes';
import { LoadingProvider } from './contexts/loading-context';
import './App.css';

function App() {
  return (

      <LoadingProvider>
        <Suspense fallback={
          <div className="suspense-container flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        }>
          <div className="app-container min-h-screen">
            {/* <AppRouter /> */}
          </div>
        </Suspense>
      </LoadingProvider>

  );
}

export default App;