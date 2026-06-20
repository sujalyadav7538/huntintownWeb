import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Post, User, Conversation, Message, Comment } from "../types";
import { INITIAL_USER, INITIAL_POSTS, INITIAL_CONVERSATIONS } from "../data";

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  posts: Post[];
  setPosts: (posts: Post[] | ((prev: Post[]) => Post[])) => void;
  conversations: Conversation[];
  setConversations: (
    conversations: Conversation[] | ((prev: Conversation[]) => Conversation[]),
  ) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (val: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (val: boolean) => void;
  isMobileSimulated: boolean;
  setIsMobileSimulated: (val: boolean) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  unreadMessagesCount: number;
  handleLoginSimulate: (user: User) => void;
  handleLogoutSimulate: () => void;
  handleCreatePost: (
    newPostData: Omit<
      Post,
      "id" | "createdAt" | "author" | "comments" | "offersCount"
    >,
  ) => void;
  handleDeleteListing: (postId: string) => void;
  handleAddComment: (
    postId: string,
    content: string,
    isOffer: boolean,
    offerBudget?: string,
    offerDuration?: string,
    answers?: { question: string; answer: string }[],
  ) => void;
  handleSendMessage: (conversationId: string, content: string) => void;
  handleUpdateStatus: (
    postId: string,
    status: "open" | "fulfilled" | "cancelled",
  ) => void;
  handleUpdateProfile: (updatedProfile: User) => void;
  instantiateDirectChatChannel: (recipient: User, initialMsg?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const activeTab = pathname === "/" ? "landing" : pathname.replace(/^\//, "");

  const setActiveTab = (tab: string) => {
    if (tab === "landing") {
      navigate("/");
    } else {
      navigate(`/${tab}`);
    }
  };

  // State initialization wrapped safely with checks
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>(
    INITIAL_CONVERSATIONS,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("neighbourly_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedPosts = localStorage.getItem("neighbourly_posts");
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      const savedConversations = localStorage.getItem(
        "neighbourly_conversations",
      );
      if (savedConversations) setConversations(JSON.parse(savedConversations));
    }
  }, []);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Sync state mutations to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined" && currentUser) {
      localStorage.setItem("neighbourly_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== "undefined" && posts) {
      localStorage.setItem("neighbourly_posts", JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (typeof window !== "undefined" && conversations) {
      localStorage.setItem(
        "neighbourly_conversations",
        JSON.stringify(conversations),
      );
    }
  }, [conversations]);

  const unreadMessagesCount = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const handleLoginSimulate = (user: User) => {
    setCurrentUser(user);
    const refreshedConvs = conversations.map((c) => {
      if (c.participant.id === user.id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    setConversations(refreshedConvs);
  };

  const handleLogoutSimulate = () => {
    setActiveTab("login");
  };

  const handleCreatePost = (
    newPostData: Omit<
      Post,
      "id" | "createdAt" | "author" | "comments" | "offersCount"
    >,
  ) => {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      author: currentUser,
      comments: [],
      offersCount: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setIsCreatePostOpen(false);
    setActiveTab("feed");
  };

  const handleDeleteListing = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleAddComment = (
    postId: string,
    content: string,
    isOffer: boolean,
    offerBudget?: string,
    offerDuration?: string,
    answers?: { question: string; answer: string }[],
  ) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      isOffer,
      offerBudget,
      offerDuration,
      answers,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
            offersCount: isOffer ? post.offersCount + 1 : post.offersCount,
          };
        }
        return post;
      }),
    );

    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost && targetPost.author.id !== currentUser.id) {
      setTimeout(() => {
        const replyComment: Comment = {
          id: `comment_reply_${Date.now()}`,
          postId,
          author: targetPost.author,
          content: `Hi ${currentUser.name}! Thank you extremely much for your comment response on my HuntInTown request. I am super excited to coordinate on this right away with you. Check your direct messages!`,
          createdAt: new Date().toISOString(),
        };

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...post.comments, replyComment],
              };
            }
            return post;
          }),
        );

        instantiateDirectChatChannel(
          targetPost.author,
          `Hey there ${currentUser.name}! Saw your response / proposal on my post ("${targetPost.title}"). Let me know what hours work best for you!`,
        );
      }, 2000);
    }
  };

  const instantiateDirectChatChannel = (
    recipient: User,
    initialMsg?: string,
  ) => {
    const existing = conversations.find(
      (c) => c.participant.id === recipient.id,
    );

    if (existing) {
      if (initialMsg) {
        const newMsg: Message = {
          id: `m_${Date.now()}`,
          senderId: recipient.id,
          receiverId: currentUser.id,
          content: initialMsg,
          createdAt: new Date().toISOString(),
          read: false,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === existing.id) {
              return {
                ...c,
                messages: [...c.messages, newMsg],
                unreadCount: c.unreadCount + 1,
                lastMessage: initialMsg,
                lastMessageAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        );
      }

      setActiveConversationId(existing.id);
    } else {
      const channelId = `conv_${Date.now()}`;
      const defaultMsgContent =
        initialMsg ||
        `Hi ${recipient.name}, I would love to connect about your local post profile!`;

      const newMsg: Message = {
        id: `m_${Date.now()}`,
        senderId: recipient.id,
        receiverId: currentUser.id,
        content: defaultMsgContent,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const newChannel: Conversation = {
        id: channelId,
        participant: recipient,
        messages: [newMsg],
        lastMessage: defaultMsgContent,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 1,
      };

      setConversations((prev) => [newChannel, ...prev]);
      setActiveConversationId(channelId);
    }

    setActiveTab("messaging");
  };

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMsg: Message = {
      id: `m_sent_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: conversationId.replace("conv_", ""),
      content,
      createdAt: new Date().toISOString(),
      read: true,
    };

    let targetRecipient: User | null = null;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          targetRecipient = c.participant;
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: content,
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
          };
        }
        return c;
      }),
    );

    if (targetRecipient) {
      const rc: User = targetRecipient;
      setTimeout(() => {
        let replyText = `Thanks for the details! Let's arrange a time. I'm located near Noida Sector 62.`;
        if (rc.id === "user_sarah") {
          replyText = `That is very kind of you, ${currentUser.name}! The furniture guidelines are ready. Saturdays work wonderfully. Let me know what hours you want to drop by.`;
        } else if (rc.id === "user_david") {
          replyText = `Awesome! I regular my WhatsApp and Google Meet lines on weekends. I can share some design concepts with you anytime!`;
        } else if (rc.id === "user_elena") {
          replyText = `Understood! I'll put a sample blueprint on the shelf near my office. Swapping for some help with my space would be brilliant!`;
        } else if (rc.id === "user_marcus") {
          replyText = `Great. I have active safety levels on my tools. Let's start the installation this weekend!`;
        }

        const replyMsg: Message = {
          id: `m_reply_${Date.now()}`,
          senderId: rc.id,
          receiverId: currentUser.id,
          content: replyText,
          createdAt: new Date().toISOString(),
          read: false,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: [...c.messages, replyMsg],
                lastMessage: replyText,
                lastMessageAt: new Date().toISOString(),
                unreadCount:
                  activeConversationId === conversationId
                    ? 0
                    : c.unreadCount + 1,
              };
            }
            return c;
          }),
        );
      }, 1500);
    }
  };

  const handleUpdateStatus = (
    postId: string,
    status: "open" | "fulfilled" | "cancelled",
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, status };
        }
        return post;
      }),
    );
  };

  const handleUpdateProfile = (updatedProfile: User) => {
    setCurrentUser(updatedProfile);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        posts,
        setPosts,
        conversations,
        setConversations,
        activeTab,
        setActiveTab,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isLoginOpen,
        setIsLoginOpen,
        isMobileSimulated,
        setIsMobileSimulated,
        searchTerm,
        setSearchTerm,
        activeConversationId,
        setActiveConversationId,
        unreadMessagesCount,
        handleLoginSimulate,
        handleLogoutSimulate,
        handleCreatePost,
        handleDeleteListing,
        handleAddComment,
        handleSendMessage,
        handleUpdateStatus,
        handleUpdateProfile,
        instantiateDirectChatChannel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
