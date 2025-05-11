// src/App.tsx
import { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AppRouter } from './routes';
import { LoadingProvider } from './contexts/loading-context';
import { TransitionLoader } from './components/ui/transition-loader';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <Suspense fallback={
          <div className="suspense-container flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        }>
          <TransitionLoader />
          <div className="app-container min-h-screen">
            <AppRouter />
          </div>
        </Suspense>
      </LoadingProvider>
    </Provider>
  );
}

export default App;