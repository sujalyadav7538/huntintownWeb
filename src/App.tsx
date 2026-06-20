/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Post } from './types';

import { useAppDispatch, useAppSelector } from './store/hooks';
import { login, logout, updateProfile } from './store/authSlice';
import { createPost, deletePost, updatePostStatus } from './store/postsSlice';
import { setActiveConversationId } from './store/conversationsSlice';
import { openCreatePost, closeCreatePost, closeLoginModal, setSearchTerm } from './store/uiSlice';
import { submitComment, openDirectChat, sendMessage } from './store/thunks';

import Header from './components/Header';
import LandingPage from './components/LandingPage';
import HomeFeed from './components/HomeFeed';
import CreatePost from './components/CreatePost';
import Dashboard from './components/Dashboard';
import Messaging from './components/Messaging';
import ProfileView from './components/ProfileView';
import LoginModal from './components/LoginModal';
import LoginPage from './components/LoginPage';
import MyActivity from './components/MyActivity';
import MyResponses from './components/MyResponses';

import {
  MessageSquare,
  LayoutGrid,
  User as UserIcon,
  Plus,
  Home,
  Activity,
  Inbox,
} from 'lucide-react';

const PROTECTED_TABS = ['feed', 'dashboard', 'messaging', 'profile', 'activity', 'responses'];

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, currentUser } = useAppSelector((s) => s.auth);
  const posts = useAppSelector((s) => s.posts);
  const { conversations, activeConversationId } = useAppSelector((s) => s.conversations);
  const { isCreatePostOpen, isLoginOpen, searchTerm } = useAppSelector((s) => s.ui);

  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = (() => {
    const clean = location.pathname.replace(/^\//, '');
    return clean || 'landing';
  })();

  const setActiveTab = (tab: string) => {
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    navigate(tab === 'landing' ? '/' : `/${tab}`);
  };

  useEffect(() => {
    if (PROTECTED_TABS.includes(activeTab) && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [activeTab, isAuthenticated]);

  const unreadMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleLogin = (user: typeof currentUser, token: string) => {
    dispatch(login({ user, token }));
    navigate('/feed', { replace: true });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleCreatePost = (
    newPostData: Omit<Post, 'id' | 'createdAt' | 'author' | 'comments' | 'offersCount'>
  ) => {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      author: currentUser,
      comments: [],
      offersCount: 0,
    };
    dispatch(createPost(newPost));
    dispatch(closeCreatePost());
    setActiveTab('feed');
  };

  const guardedOpenCreatePost = () => {
    if (!isAuthenticated) { navigate('/login', { replace: true }); return; }
    dispatch(openCreatePost());
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onExplore={() => setActiveTab('feed')}
            onPostRequirement={() => {
              if (!isAuthenticated) { navigate('/login', { replace: true }); return; }
              dispatch(openCreatePost());
            }}
            onExplorePost={(postId) => {
              const tgt = posts.find((p) => p.id === postId);
              dispatch(setSearchTerm(tgt ? tgt.title : ''));
              setActiveTab('feed');
            }}
            onInitiateChat={(recipient) => {
              dispatch(openDirectChat(recipient) as any);
              setActiveTab('messaging');
            }}
          />
        );
      case 'feed':
        return (
          <HomeFeed
            onAddComment={(postId, content, isOffer, budget, duration, answers) =>
              dispatch(submitComment(postId, content, isOffer, budget, duration, answers) as any)
            }
            onToggleResolve={(id) => dispatch(updatePostStatus({ postId: id, status: 'fulfilled' }))}
            onInitiateChat={(recipient) => {
              dispatch(openDirectChat(recipient) as any);
              setActiveTab('messaging');
            }}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            onUpdateStatus={(postId, status) => dispatch(updatePostStatus({ postId, status }))}
            onDeleteListing={(id) => dispatch(deletePost(id))}
            onSelectPost={() => setActiveTab('feed')}
            setActiveTab={setActiveTab}
          />
        );
      case 'messaging':
        return (
          <Messaging
            onSendMessage={(convId, content) => dispatch(sendMessage(convId, content) as any)}
          />
        );
      case 'profile':
        return (
          <ProfileView
            onUpdateProfile={(updated) => dispatch(updateProfile(updated))}
          />
        );
      case 'activity':
        return <MyActivity />;
      case 'responses':
        return <MyResponses />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-[#09090b] flex flex-col antialiased select-text text-zinc-100 overflow-x-hidden">
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCreatePost={guardedOpenCreatePost}
          onLogoutSimulate={handleLogout}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
          {renderActiveView()}
        </main>

        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#121214] border-t border-[#232327] flex items-center justify-around py-2.5 z-40 shadow-xl">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${
              activeTab === 'landing' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider scale-90">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${
              activeTab === 'feed' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider scale-90">Browse</span>
          </button>

          <button
            onClick={guardedOpenCreatePost}
            className="flex items-center justify-center w-11 h-11 bg-[#FF3F3F] text-white rounded-full -mt-6 shadow-lg shadow-[#FF3F3F]/30 hover:bg-[#E53535] active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('messaging')}
            className={`relative flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${
              activeTab === 'messaging' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider scale-90">Chats</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF3F3F] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => isAuthenticated ? setActiveTab('activity') : setActiveTab('login')}
            className={`flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${
              activeTab === 'activity' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider scale-90">Activity</span>
          </button>

          <button
            onClick={() => isAuthenticated ? setActiveTab('responses') : setActiveTab('login')}
            className={`flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${
              activeTab === 'responses' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Inbox className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider scale-90">Inbox</span>
          </button>

          <button
            onClick={() => isAuthenticated ? setActiveTab('profile') : setActiveTab('login')}
            className={`flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${
              activeTab === 'login' || activeTab === 'profile'
                ? 'text-[#FF3F3F]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider scale-90">
              {isAuthenticated ? 'Profile' : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {isCreatePostOpen && (
        <CreatePost
          onClose={() => dispatch(closeCreatePost())}
          onPostCreated={(postId) => {
            dispatch(closeCreatePost());
            navigate('/feed', { state: { openPostId: postId } });
          }}
        />
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => dispatch(closeLoginModal())}
        onLogin={handleLogin}
        currentUserId={currentUser.id}
      />
    </div>
  );
}
