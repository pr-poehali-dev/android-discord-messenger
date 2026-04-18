
import { useState, useCallback } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MessengerLayout from "./pages/MessengerLayout";
import SplashScreen from "./components/messenger/SplashScreen";
import AuthScreen from "./components/messenger/AuthScreen";

const queryClient = new QueryClient();

type AppStage = 'splash' | 'auth' | 'app';

const App = () => {
  const [stage, setStage] = useState<AppStage>('splash');
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);

  const handleSplashDone = useCallback(() => setStage('auth'), []);

  const handleAuth = useCallback((username: string, avatar: string) => {
    setUser({ username, avatar });
    setStage('app');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          {stage === 'splash' && <SplashScreen onDone={handleSplashDone} />}
          {stage === 'auth' && <AuthScreen onAuth={handleAuth} />}
          {stage === 'app' && <MessengerLayout user={user} />}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;