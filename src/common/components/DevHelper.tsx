// ================================================================================
// FILE 6: src/common/components/DevHelper.tsx (CREATE NEW - Component bị thiếu)
// ================================================================================
import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Separator } from '@/common/components/ui/separator';
import { Copy, RefreshCw, Settings, X, Wifi, WifiOff, Database, Key } from 'lucide-react';
import { useAuth } from '@/features/auth';

export function DevHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  // Only show in development
  if (import.meta.env.PROD) return null;
  
  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch('http://localhost:5000/api/test-cors');
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('failed');
      }
      setLastCheck(new Date());
    } catch (error) {
      setConnectionStatus('failed');
      setLastCheck(new Date());
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearStorageAndReload = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const testAPI = async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`);
      const data = await response.json();
      console.log(`API Test ${endpoint}:`, data);
    } catch (error) {
      console.error(`API Test ${endpoint} failed:`, error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      testConnection();
    }
  }, [isVisible]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible && (
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="shadow-lg bg-white hover:bg-gray-50"
        >
          <Settings className="h-4 w-4 mr-1" />
          Dev Helper
        </Button>
      )}
      
      {isVisible && (
        <Card className="w-96 shadow-xl bg-white border-2 max-h-[80vh] overflow-y-auto">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-blue-700">🛠️ Development Helper</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Connection Status */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800 flex items-center gap-2">
                {connectionStatus === 'checking' && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
                {connectionStatus === 'connected' && <Wifi className="h-4 w-4 text-green-500" />}
                {connectionStatus === 'failed' && <WifiOff className="h-4 w-4 text-red-500" />}
                Backend Connection
              </h4>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="text-xs">
                  <div>Status: 
                    {connectionStatus === 'checking' && <Badge variant="secondary" className="ml-1">Checking...</Badge>}
                    {connectionStatus === 'connected' && <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">Connected</Badge>}
                    {connectionStatus === 'failed' && <Badge variant="destructive" className="ml-1">Failed</Badge>}
                  </div>
                  {lastCheck && (
                    <div className="text-gray-500 mt-1">
                      Last: {lastCheck.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={testConnection}
                  disabled={connectionStatus === 'checking'}
                  className="h-6 px-2"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              {connectionStatus === 'failed' && (
                <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
                  ❌ Backend not reachable. Make sure:
                  <br />• Backend running on http://localhost:5000
                  <br />• CORS configured properly
                  <br />• No firewall blocking
                </div>
              )}
            </div>

            <Separator />

            {/* Auth Status */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Authentication
              </h4>
              <div className="p-2 bg-gray-50 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  {isAuthenticated ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Logged In</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">Not Logged In</Badge>
                  )}
                </div>
                {user && (
                  <div className="mt-2 space-y-1">
                    <div>User: {user.fullName}</div>
                    <div>Email: {user.email}</div>
                    <div>ID: {user._id}</div>
                  </div>
                )}
                <div className="mt-2">
                  Token: {localStorage.getItem('accessToken') ? '✅ Present' : '❌ Missing'}
                </div>
              </div>
            </div>

            <Separator />

            {/* Mock Credentials */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800">🔑 Login Credentials:</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="text-xs">
                    <div className="font-mono">admin / admin123</div>
                    <div className="text-gray-500">Default Admin Account</div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary">Admin</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard('admin')}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="text-xs">
                    <div className="font-mono">nguyenvana / password123</div>
                    <div className="text-gray-500">Lecturer Account</div>
                  </div>
                  <Badge variant="outline">Lecturer</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Environment Info */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Environment
              </h4>
              <div className="text-xs space-y-1 p-2 bg-gray-50 rounded font-mono">
                <div>Mode: {import.meta.env.MODE}</div>
                <div>Base URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</div>
                <div>Mock API: {import.meta.env.VITE_USE_MOCK_API || 'false'}</div>
                <div>Frontend: http://localhost:5173</div>
                <div>Backend: http://localhost:5000</div>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800">⚡ Quick Actions:</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => testAPI('/test-cors')}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                >
                  Test CORS Endpoint
                </Button>
                
                <Button 
                  onClick={() => window.open('http://localhost:5000/api-docs', '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                >
                  Open API Docs
                </Button>
                
                <Button 
                  onClick={clearStorageAndReload}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  🗑️ Clear Storage & Reload
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>🔍 Check browser console for detailed logs</div>
              <div>📡 Check Network tab for API requests</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}