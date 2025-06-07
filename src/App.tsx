// src/App.tsx
import { Suspense } from 'react';
import { AppRouter } from './routes';
import { DevHelper } from '@/common/components/DevHelper';
import './App.css';

function App() {
  return (
    <Suspense fallback={
      <div className="suspense-container flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải ứng dụng...</p>
        </div>
      </div>
    }>
      <div className="app-container min-h-screen">
        <AppRouter />
        <DevHelper />
      </div>
    </Suspense>
  );
}

export default App;