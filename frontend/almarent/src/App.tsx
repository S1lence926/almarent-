import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';
import { Chat } from './pages/Chat';
import { ChatRoom } from './pages/ChatRoom';
import { CreateListing } from './pages/CreateListing';
import { ListingDetail } from './pages/ListingDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/chats" element={<Chat />} />
          <Route path="/chats/:id" element={<ChatRoom />} />
          <Route path="/listings/create" element={<CreateListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;