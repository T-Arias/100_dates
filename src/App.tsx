import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';
import { GalleryPage } from './pages/GalleryPage';
import { DashboardPage } from './pages/DashboardPage';
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthScreen } from './components/AuthScreen';
import { BottomNav } from './components/BottomNav';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-pink-50">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  if (!user) return <AuthScreen />;

  return (
    <BrowserRouter>
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/game/:sessionId" element={<GamePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;