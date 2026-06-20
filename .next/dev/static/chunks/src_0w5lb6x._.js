(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "FUNCTIONAL_CATEGORIES",
    ()=>FUNCTIONAL_CATEGORIES,
    "INITIAL_CONVERSATIONS",
    ()=>INITIAL_CONVERSATIONS,
    "INITIAL_POSTS",
    ()=>INITIAL_POSTS,
    "INITIAL_USER",
    ()=>INITIAL_USER,
    "MOCK_USERS",
    ()=>MOCK_USERS
]);
const INITIAL_USER = {
    id: 'current_user',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Interior Designer | 5+ years experience',
    location: 'Noida, Sector 62',
    skills: [
        'Interior Design',
        'Home Decor',
        'Modular Kitchen',
        '3D Generalist',
        'CAD Draftsperson'
    ],
    bio: 'Specialized in modern & minimal designs. Passionate about creating elegant living spaces. Connect with me for premium interior layouts.',
    rating: 4.8,
    reputation: 320,
    joinedAt: 'March 2025'
};
const MOCK_USERS = [
    {
        id: 'user_rohit',
        name: 'Rohit Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'Local Homeowner',
        location: 'Noida, Sector 62',
        rating: 4.9,
        reputation: 110,
        skills: [
            'Client Relations'
        ],
        bio: 'Fabulous food critic and home renovator. Looking to collaborate with verified local freelance makers and designers.'
    },
    {
        id: 'user_anjali',
        name: 'Anjali Verma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'Parent & High-School Teacher',
        location: 'Gurugram, Sector 21',
        rating: 5.0,
        reputation: 240,
        skills: [
            'Education Administration'
        ],
        bio: 'Dedicated mother and education enthusiast.'
    },
    {
        id: 'user_vivek',
        name: 'Vivek Malhotra',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'Property Owner',
        location: 'Noida, Sector 50',
        rating: 4.7,
        reputation: 180,
        skills: [
            'Real Estate Planning'
        ],
        bio: 'Just bought a 2BHK. High interest in minimalist design & space optimizations.'
    },
    {
        id: 'user_furniture_studio',
        name: 'Furniture Studio',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150',
        role: 'Verified Custom Maker (Sector 63)',
        location: 'Noida, Sector 63',
        rating: 4.8,
        reputation: 430,
        skills: [
            'Custom Sofas',
            'Carpentry',
            'Warranty Support'
        ],
        bio: 'Verified professional workshop specializing in custom sofa arrangements, high-grade fabric finishes, and timely 4-day delivery!'
    },
    {
        id: 'user_crafted_comforts',
        name: 'Crafted Comforts',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        role: 'Verified Premium Decor Shop',
        location: 'Noida, Sector 18',
        rating: 4.6,
        reputation: 320,
        skills: [
            'Minimalist Decor',
            'Custom Living Arrangements'
        ],
        bio: 'Specialists in custom structures, sofa customizations, and sleek modular elements.'
    },
    {
        id: 'user_sofa_house',
        name: 'Sofa House',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'Verified Sofa Outlet',
        location: 'Noida, Sector 50',
        rating: 4.7,
        reputation: 210,
        skills: [
            'Sofa Design',
            'Fast Shipping'
        ],
        bio: 'Providing the latest trending premium design catalogs. Fast delivery within 5 business days.'
    }
];
const INITIAL_POSTS = [
    {
        id: 'post_rohit_1',
        title: 'Need custom sofa',
        description: 'Looking for a modern L-shape sofa under ₹15,000. Need it within 5 days. Must fit a compact drawing room layout.',
        category: 'Home & Living',
        location: 'Noida, Sector 62',
        type: 'help_needed',
        budget: '₹15,000',
        createdAt: '2026-06-06T03:18:00Z',
        expiresAt: '2026-06-16T03:18:00Z',
        expiryDays: 10,
        questions: [
            'What type of foam density/materials do you use?',
            'Do you have wood color options for the frame legs?'
        ],
        status: 'open',
        offersCount: 12,
        author: MOCK_USERS[0],
        comments: [
            {
                id: 'offer_1',
                postId: 'post_rohit_1',
                author: MOCK_USERS[3],
                content: 'We can deliver within 4 days. Premium quality materials with 1 year warranty. Custom frame customization is also available!',
                createdAt: '2026-06-06T03:45:00Z',
                isOffer: true,
                offerBudget: '₹14,500',
                offerDuration: '4 days',
                answers: [
                    {
                        question: 'What type of foam density/materials do you use?',
                        answer: 'We use high-density 40 High Resilience (HR) foam with Sleepwell branded comfort layer.'
                    },
                    {
                        question: 'Do you have wood color options for the frame legs?',
                        answer: 'Yes! We offer natural teak wood finish, dark walnut, and charcoal black polish.'
                    }
                ]
            },
            {
                id: 'offer_2',
                postId: 'post_rohit_1',
                author: MOCK_USERS[4],
                content: 'We have similar designs in our local showroom in Sector 18. We can customize the dimensions and fabric tone as per your specific layout requirement!',
                createdAt: '2026-06-06T04:10:00Z',
                isOffer: true,
                offerBudget: '₹13,800',
                offerDuration: '5 days',
                answers: [
                    {
                        question: 'What type of foam density/materials do you use?',
                        answer: 'We offer customizable foam densities (32 to 40 density) using premium pine wood frames.'
                    },
                    {
                        question: 'Do you have wood color options for the frame legs?',
                        answer: 'Yes, we have teak, mahogany, and steel hairpin options too.'
                    }
                ]
            },
            {
                id: 'offer_3',
                postId: 'post_rohit_1',
                author: MOCK_USERS[5],
                content: 'Latest design catalog available immediately. Quick standard dispatch with guarantee. Guaranteed delivery within 5 days.',
                createdAt: '2026-06-06T04:30:00Z',
                isOffer: true,
                offerBudget: '₹15,000',
                offerDuration: '5 days',
                answers: [
                    {
                        question: 'What type of foam density/materials do you use?',
                        answer: 'Standard 32 density medium-firm support.'
                    },
                    {
                        question: 'Do you have wood color options for the frame legs?',
                        answer: 'Teak and Mahogany only.'
                    }
                ]
            }
        ]
    },
    {
        id: 'post_anjali_1',
        title: 'Looking for tutor for Maths',
        description: 'For class 11th CBSE. Need experienced tutor for long term with clear communication & strong concept building.',
        category: 'Education',
        location: 'Gurugram, Sector 21',
        type: 'help_needed',
        budget: 'Negotiable',
        createdAt: '2026-06-06T01:18:00Z',
        expiresAt: '2026-06-13T01:18:00Z',
        expiryDays: 7,
        questions: [
            'How many years of experience do you have with CBSE board class 11?',
            'Are you available for offline sessions or only online whiteboard classes?'
        ],
        status: 'open',
        offersCount: 8,
        author: MOCK_USERS[1],
        comments: []
    },
    {
        id: 'post_vivek_1',
        title: 'Need interior designer',
        description: 'Looking for 2BHK interior design with modular kitchen. Love Scandinavian or minimalist design styles.',
        category: 'Home & Living',
        location: 'Noida, Sector 50',
        type: 'help_needed',
        budget: 'Contact for Budget',
        createdAt: '2026-06-05T23:18:00Z',
        expiresAt: '2026-06-15T23:18:00Z',
        expiryDays: 10,
        questions: [
            'Could you share links or pictures of your last minimalist 2BHK styling?',
            'What software tools do you use for 3D walkthrough rendering?'
        ],
        status: 'open',
        offersCount: 5,
        author: MOCK_USERS[2],
        comments: [
            {
                id: 'offer_vivek_arjun',
                postId: 'post_vivek_1',
                author: INITIAL_USER,
                content: 'Hi Vivek, I am Arjun, an interior designer based right in Sector 62. I have designed over fifteen 2BHK minimal apartments in Noida, with bespoke modular kitchen spacing. I would love to share my portfolio with you!',
                createdAt: '2026-06-06T00:15:00Z',
                isOffer: true,
                offerBudget: 'Quote Offered',
                offerDuration: '30 days',
                answers: [
                    {
                        question: 'Could you share links or pictures of your last minimalist 2BHK styling?',
                        answer: 'Absolutely, I have a dedicated album link of my Sector 62 minimal designs which I can send over direct chat.'
                    },
                    {
                        question: 'What software tools do you use for 3D walkthrough rendering?',
                        answer: 'I use SketchUp paired with Lumion and V-Ray for ultra-realistic walkthrough renderings.'
                    }
                ]
            }
        ]
    }
];
const INITIAL_CONVERSATIONS = [
    {
        id: 'conv_rohit',
        participant: MOCK_USERS[0],
        unreadCount: 1,
        messages: [
            {
                id: 'm1_rohit',
                senderId: 'current_user',
                receiverId: 'user_rohit',
                content: 'Hi Rohit! I saw you need a custom modern L-shape sofa. I work closely with premium manufacturing studios, and we can draft some beautiful space-optimized dimensions.',
                createdAt: '2026-06-06T04:00:00Z',
                read: true
            },
            {
                id: 'm2_rohit',
                senderId: 'user_rohit',
                receiverId: 'current_user',
                content: 'Hey Arjun! This sounds super. Can we connect over phone or chat to lock the custom layout and verify if we can match the five-day deadline?',
                createdAt: '2026-06-06T04:20:00Z',
                read: false
            }
        ]
    },
    {
        id: 'conv_vivek',
        participant: MOCK_USERS[2],
        unreadCount: 0,
        messages: [
            {
                id: 'm3_vivek',
                senderId: 'user_vivek',
                receiverId: 'current_user',
                content: 'Hello Arjun! Your modular kitchen portfolio looks gorgeous. What is your design timeline for a standard 2BHK in Sector 50?',
                createdAt: '2026-06-05T23:45:00Z',
                read: true
            },
            {
                id: 'm4_current',
                senderId: 'current_user',
                receiverId: 'user_vivek',
                content: 'Hi Vivek! Thanks for the kind words. Normally, we complete the exhaustive 3D models and layout design in 10-14 days. The modular kitchen installation starts right after that.',
                createdAt: '2026-06-06T00:05:00Z',
                read: true
            }
        ]
    }
];
const CATEGORIES = [
    'All',
    'Nearby',
    'Trending',
    'Urgent',
    'Premium'
];
const FUNCTIONAL_CATEGORIES = [
    'All Categories',
    'Home & Living',
    'Education',
    'Handyman & Repairs',
    'Tech Support',
    'Design & Creative',
    'Other Services'
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppContextProvider",
    ()=>AppContextProvider,
    "useAppContext",
    ()=>useAppContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppContextProvider({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const activeTab = pathname === '/' ? 'landing' : pathname.replace(/^\//, '');
    const setActiveTab = (tab)=>{
        if (tab === 'landing') {
            router.push('/');
        } else {
            router.push(`/${tab}`);
        }
    };
    // State initialization wrapped safely with checks
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"]);
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_POSTS"]);
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_CONVERSATIONS"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContextProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const savedUser = localStorage.getItem('neighbourly_user');
                if (savedUser) setCurrentUser(JSON.parse(savedUser));
                const savedPosts = localStorage.getItem('neighbourly_posts');
                if (savedPosts) setPosts(JSON.parse(savedPosts));
                const savedConversations = localStorage.getItem('neighbourly_conversations');
                if (savedConversations) setConversations(JSON.parse(savedConversations));
            }
        }
    }["AppContextProvider.useEffect"], []);
    const [isCreatePostOpen, setIsCreatePostOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoginOpen, setIsLoginOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobileSimulated, setIsMobileSimulated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [activeConversationId, setActiveConversationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Sync state mutations to LocalStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContextProvider.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && currentUser) {
                localStorage.setItem('neighbourly_user', JSON.stringify(currentUser));
            }
        }
    }["AppContextProvider.useEffect"], [
        currentUser
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContextProvider.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && posts) {
                localStorage.setItem('neighbourly_posts', JSON.stringify(posts));
            }
        }
    }["AppContextProvider.useEffect"], [
        posts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContextProvider.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && conversations) {
                localStorage.setItem('neighbourly_conversations', JSON.stringify(conversations));
            }
        }
    }["AppContextProvider.useEffect"], [
        conversations
    ]);
    const unreadMessagesCount = conversations.reduce((sum, c)=>sum + c.unreadCount, 0);
    const handleLoginSimulate = (user)=>{
        setCurrentUser(user);
        const refreshedConvs = conversations.map((c)=>{
            if (c.participant.id === user.id) {
                return {
                    ...c,
                    unreadCount: 0
                };
            }
            return c;
        });
        setConversations(refreshedConvs);
    };
    const handleLogoutSimulate = ()=>{
        setActiveTab('login');
    };
    const handleCreatePost = (newPostData)=>{
        const newPost = {
            ...newPostData,
            id: `post_${Date.now()}`,
            createdAt: new Date().toISOString(),
            author: currentUser,
            comments: [],
            offersCount: 0
        };
        setPosts((prev)=>[
                newPost,
                ...prev
            ]);
        setIsCreatePostOpen(false);
        setActiveTab('feed');
    };
    const handleDeleteListing = (postId)=>{
        setPosts((prev)=>prev.filter((p)=>p.id !== postId));
    };
    const handleAddComment = (postId, content, isOffer, offerBudget, offerDuration, answers)=>{
        const newComment = {
            id: `comment_${Date.now()}`,
            postId,
            author: currentUser,
            content,
            createdAt: new Date().toISOString(),
            isOffer,
            offerBudget,
            offerDuration,
            answers
        };
        setPosts((prev)=>prev.map((post)=>{
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [
                            ...post.comments,
                            newComment
                        ],
                        offersCount: isOffer ? post.offersCount + 1 : post.offersCount
                    };
                }
                return post;
            }));
        const targetPost = posts.find((p)=>p.id === postId);
        if (targetPost && targetPost.author.id !== currentUser.id) {
            setTimeout(()=>{
                const replyComment = {
                    id: `comment_reply_${Date.now()}`,
                    postId,
                    author: targetPost.author,
                    content: `Hi ${currentUser.name}! Thank you extremely much for your comment response on my HuntInTown request. I am super excited to coordinate on this right away with you. Check your direct messages!`,
                    createdAt: new Date().toISOString()
                };
                setPosts((prev)=>prev.map((post)=>{
                        if (post.id === postId) {
                            return {
                                ...post,
                                comments: [
                                    ...post.comments,
                                    replyComment
                                ]
                            };
                        }
                        return post;
                    }));
                instantiateDirectChatChannel(targetPost.author, `Hey there ${currentUser.name}! Saw your response / proposal on my post ("${targetPost.title}"). Let me know what hours work best for you!`);
            }, 2000);
        }
    };
    const instantiateDirectChatChannel = (recipient, initialMsg)=>{
        const existing = conversations.find((c)=>c.participant.id === recipient.id);
        if (existing) {
            if (initialMsg) {
                const newMsg = {
                    id: `m_${Date.now()}`,
                    senderId: recipient.id,
                    receiverId: currentUser.id,
                    content: initialMsg,
                    createdAt: new Date().toISOString(),
                    read: false
                };
                setConversations((prev)=>prev.map((c)=>{
                        if (c.id === existing.id) {
                            return {
                                ...c,
                                messages: [
                                    ...c.messages,
                                    newMsg
                                ],
                                unreadCount: c.unreadCount + 1,
                                lastMessage: initialMsg,
                                lastMessageAt: new Date().toISOString()
                            };
                        }
                        return c;
                    }));
            }
            setActiveConversationId(existing.id);
        } else {
            const channelId = `conv_${Date.now()}`;
            const defaultMsgContent = initialMsg || `Hi ${recipient.name}, I would love to connect about your local post profile!`;
            const newMsg = {
                id: `m_${Date.now()}`,
                senderId: recipient.id,
                receiverId: currentUser.id,
                content: defaultMsgContent,
                createdAt: new Date().toISOString(),
                read: false
            };
            const newChannel = {
                id: channelId,
                participant: recipient,
                messages: [
                    newMsg
                ],
                lastMessage: defaultMsgContent,
                lastMessageAt: new Date().toISOString(),
                unreadCount: 1
            };
            setConversations((prev)=>[
                    newChannel,
                    ...prev
                ]);
            setActiveConversationId(channelId);
        }
        setActiveTab('messaging');
    };
    const handleSendMessage = (conversationId, content)=>{
        const newMsg = {
            id: `m_sent_${Date.now()}`,
            senderId: currentUser.id,
            receiverId: conversationId.replace('conv_', ''),
            content,
            createdAt: new Date().toISOString(),
            read: true
        };
        let targetRecipient = null;
        setConversations((prev)=>prev.map((c)=>{
                if (c.id === conversationId) {
                    targetRecipient = c.participant;
                    return {
                        ...c,
                        messages: [
                            ...c.messages,
                            newMsg
                        ],
                        lastMessage: content,
                        lastMessageAt: new Date().toISOString(),
                        unreadCount: 0
                    };
                }
                return c;
            }));
        if (targetRecipient) {
            const rc = targetRecipient;
            setTimeout(()=>{
                let replyText = `Thanks for the details! Let's arrange a time. I'm located near Noida Sector 62.`;
                if (rc.id === 'user_sarah') {
                    replyText = `That is very kind of you, ${currentUser.name}! The furniture guidelines are ready. Saturdays work wonderfully. Let me know what hours you want to drop by.`;
                } else if (rc.id === 'user_david') {
                    replyText = `Awesome! I regular my WhatsApp and Google Meet lines on weekends. I can share some design concepts with you anytime!`;
                } else if (rc.id === 'user_elena') {
                    replyText = `Understood! I'll put a sample blueprint on the shelf near my office. Swapping for some help with my space would be brilliant!`;
                } else if (rc.id === 'user_marcus') {
                    replyText = `Great. I have active safety levels on my tools. Let's start the installation this weekend!`;
                }
                const replyMsg = {
                    id: `m_reply_${Date.now()}`,
                    senderId: rc.id,
                    receiverId: currentUser.id,
                    content: replyText,
                    createdAt: new Date().toISOString(),
                    read: false
                };
                setConversations((prev)=>prev.map((c)=>{
                        if (c.id === conversationId) {
                            return {
                                ...c,
                                messages: [
                                    ...c.messages,
                                    replyMsg
                                ],
                                lastMessage: replyText,
                                lastMessageAt: new Date().toISOString(),
                                unreadCount: activeConversationId === conversationId ? 0 : c.unreadCount + 1
                            };
                        }
                        return c;
                    }));
            }, 1500);
        }
    };
    const handleUpdateStatus = (postId, status)=>{
        setPosts((prev)=>prev.map((post)=>{
                if (post.id === postId) {
                    return {
                        ...post,
                        status
                    };
                }
                return post;
            }));
    };
    const handleUpdateProfile = (updatedProfile)=>{
        setCurrentUser(updatedProfile);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
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
            instantiateDirectChatChannel
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AppContext.tsx",
        lineNumber: 333,
        columnNumber: 5
    }, this);
}
_s(AppContextProvider, "umyxQJQf/zoy1GjbLDsldpwn9ys=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppContextProvider;
function useAppContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}
_s1(useAppContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AppContextProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/header/SimulatorControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimulatorControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
"use client";
;
;
function SimulatorControls({ isMobileSimulated, setIsMobileSimulated }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4 font-mono",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 text-zinc-550 text-[10px] select-none font-bold uppercase tracking-wider",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Viewport:"
                }, void 0, false, {
                    fileName: "[project]/src/components/header/SimulatorControls.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/header/SimulatorControls.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "toggle-desktop-sim",
                onClick: ()=>setIsMobileSimulated(false),
                className: `flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold cursor-pointer transition ${!isMobileSimulated ? 'bg-[#FF3F3F]' : 'hover:bg-zinc-850 text-zinc-400'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                        className: "w-3 h-3 text-white"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/SimulatorControls.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white",
                        children: "Desktop"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/SimulatorControls.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/header/SimulatorControls.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "toggle-mobile-sim",
                onClick: ()=>setIsMobileSimulated(true),
                className: `flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold cursor-pointer transition ${isMobileSimulated ? 'bg-[#FF3F3F]' : 'hover:bg-zinc-850 text-zinc-400'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                        className: "w-3 h-3 text-white"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/SimulatorControls.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white",
                        children: "Mobile Sim"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/SimulatorControls.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/header/SimulatorControls.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/header/SimulatorControls.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = SimulatorControls;
var _c;
__turbopack_context__.k.register(_c, "SimulatorControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/header/DesktopNavbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DesktopNavbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
"use client";
;
;
function DesktopNavbar({ activeTab, setActiveTab, unreadMessagesCount }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "hidden lg:flex items-center gap-1 font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "nav-landing-btn",
                onClick: ()=>setActiveTab('landing'),
                className: `flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${activeTab === 'landing' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                        className: "w-3.5 h-3.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "nav-feed-btn",
                onClick: ()=>setActiveTab('feed'),
                className: `px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${activeTab === 'feed' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`,
                children: "Requirements"
            }, void 0, false, {
                fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "nav-dashboard-btn",
                onClick: ()=>setActiveTab('dashboard'),
                className: `px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${activeTab === 'dashboard' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`,
                children: "Bids & Offers"
            }, void 0, false, {
                fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "nav-chat-btn",
                onClick: ()=>setActiveTab('messaging'),
                className: `relative px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${activeTab === 'messaging' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Chats"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    unreadMessagesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#FF3F3F] text-[9px] font-bold text-white font-mono",
                        children: unreadMessagesCount
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "nav-profile-btn",
                onClick: ()=>setActiveTab('profile'),
                className: `px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${activeTab === 'profile' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`,
                children: "Profile"
            }, void 0, false, {
                fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "nav-login-btn",
                onClick: ()=>setActiveTab('login'),
                className: `px-3 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${activeTab === 'login' ? 'bg-zinc-800 text-[#FF3F3F] border border-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'}`,
                children: "Sign In"
            }, void 0, false, {
                fileName: "[project]/src/components/header/DesktopNavbar.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/header/DesktopNavbar.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = DesktopNavbar;
var _c;
__turbopack_context__.k.register(_c, "DesktopNavbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/header/UserProfileIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserProfileIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
"use client";
;
;
function UserProfileIndicator({ currentUser, setActiveTab, onLogoutSimulate }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 pl-3 border-l border-[#2e2e33]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "header-profile-avatar-btn",
                onClick: ()=>setActiveTab('profile'),
                className: "flex items-center gap-2 cursor-pointer text-left focus:outline-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: currentUser.avatar,
                        alt: currentUser.name,
                        className: "w-8.5 h-8.5 rounded-full object-cover border-2 border-[#FF3F3F]/40 hover:border-[#FF3F3F] transition bg-[#18181b]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden xl:block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-bold text-zinc-100 leading-tight flex items-center gap-1",
                                children: [
                                    currentUser.name,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse",
                                        title: "Online profile active"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                                        lineNumber: 33,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-zinc-400 capitalize",
                                children: currentUser.location
                            }, void 0, false, {
                                fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "logout-simulator-btn",
                onClick: onLogoutSimulate,
                title: "Switch/Logout account simulation",
                className: "p-1 px-1.5 text-zinc-450 hover:text-[#FF3F3F] hover:bg-zinc-800 rounded transition cursor-pointer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/header/UserProfileIndicator.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = UserProfileIndicator;
var _c;
__turbopack_context__.k.register(_c, "UserProfileIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-client] (ecmascript) <export default as PlusCircle>");
// Modular Sub-components
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$header$2f$SimulatorControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/header/SimulatorControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$header$2f$DesktopNavbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/header/DesktopNavbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$header$2f$UserProfileIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/header/UserProfileIndicator.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function Header({ currentUser, activeTab, setActiveTab, openCreatePost, unreadMessagesCount, onLogoutSimulate, isMobileSimulated, setIsMobileSimulated, searchTerm, setSearchTerm }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 w-full bg-[#121214]/90 backdrop-blur-md border-b border-[#242428] shadow-md select-none font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#09090b] text-zinc-400 text-xs py-1.5 px-4 flex justify-between items-center select-none font-mono border-b border-[#1c1c1e]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 rounded-full bg-[#FF3F3F]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] tracking-wide text-zinc-300",
                                children: "HuntInTown • Real-time verified local response network"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$header$2f$SimulatorControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        isMobileSimulated: isMobileSimulated,
                        setIsMobileSimulated: setIsMobileSimulated
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 cursor-pointer",
                            onClick: ()=>setActiveTab('landing'),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[#FF3F3F] font-black text-xl tracking-tighter uppercase font-display select-none flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-8 h-8 rounded-lg bg-[#FF3F3F] text-white font-black text-lg flex items-center justify-center font-display",
                                        children: "R"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "HuntInTown"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex flex-1 max-w-sm mx-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-550",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Header.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "header-search-input",
                                        type: "text",
                                        placeholder: "Search sofas, math tuition, local contractors...",
                                        value: searchTerm,
                                        onChange: (e)=>setSearchTerm(e.target.value),
                                        className: "w-full pl-9 pr-4 py-1.5 text-xs bg-[#1a1a1e] border border-[#2d2d34] text-zinc-100 rounded-lg placeholder-zinc-550 focus:outline-[#FF3F3F]/30 focus:border-[#FF3F3F] focus:bg-[#202025] transition"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$header$2f$DesktopNavbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            activeTab: activeTab,
                            setActiveTab: setActiveTab,
                            unreadMessagesCount: unreadMessagesCount
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "header-create-post-btn",
                                    onClick: openCreatePost,
                                    className: "hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black bg-[#FF3F3F] hover:bg-[#E53535] text-white rounded-lg transition cursor-pointer font-display tracking-widest uppercase",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Header.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Post Need"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Header.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$header$2f$UserProfileIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    currentUser: currentUser,
                                    setActiveTab: setActiveTab,
                                    onLogoutSimulate: onLogoutSimulate
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/create-post/CustomQuestionsInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomQuestionsInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>");
"use client";
;
;
function CustomQuestionsInput({ questions, setQuestions }) {
    const handleAddQuestion = ()=>{
        if (questions.length < 5) {
            setQuestions([
                ...questions,
                ''
            ]);
        }
    };
    const handleQuestionChange = (index, val)=>{
        const updated = [
            ...questions
        ];
        updated[index] = val;
        setQuestions(updated);
    };
    const handleRemoveQuestion = (index)=>{
        const updated = questions.filter((_, idx)=>idx !== index);
        setQuestions(updated.length === 0 ? [
            ''
        ] : updated);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2 border-t border-[#1e1e21] pt-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                className: "w-3.5 h-3.5 text-[#FF3F3F]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Custom Questions for Helpers"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleAddQuestion,
                        disabled: questions.length >= 5,
                        className: `text-[9px] font-black flex items-center gap-1 px-2 py-1 rounded transition uppercase tracking-wider ${questions.length >= 5 ? 'text-zinc-650 cursor-not-allowed' : 'text-[#FF3F3F] hover:bg-[#FF3F3F]/10 cursor-pointer'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-2.5 h-2.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Add (",
                                    questions.length,
                                    "/5)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[9px] text-zinc-500 font-sans",
                children: "Ask helpers to answer these questions specifically when they send a quote or offer."
            }, void 0, false, {
                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 pt-1",
                children: questions.map((question, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-zinc-500 font-bold w-4",
                                children: [
                                    "#",
                                    idx + 1
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: `question-input-${idx}`,
                                type: "text",
                                placeholder: "e.g., Do you provide material warranties?",
                                value: question,
                                onChange: (e)=>handleQuestionChange(idx, e.target.value),
                                className: "flex-1 text-xs px-3 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg placeholder-zinc-700 focus:outline-hidden focus:border-[#FF3F3F]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            questions.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleRemoveQuestion(idx),
                                className: "p-2.5 bg-zinc-900 hover:bg-[#FF3F3F]/10 border border-zinc-800 hover:border-[#FF3F3F]/30 text-zinc-500 hover:text-[#FF3F3F] rounded-lg transition cursor-pointer",
                                title: "Delete Question",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "w-3.5 h-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                    lineNumber: 69,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/create-post/CustomQuestionsInput.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = CustomQuestionsInput;
var _c;
__turbopack_context__.k.register(_c, "CustomQuestionsInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/create-post/ContactMethodsToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactMethodsToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
"use client";
;
;
function ContactMethodsToggle({ contactMethods, setContactMethods }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5",
                children: "Contact Method"
            }, void 0, false, {
                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-2 font-sans",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setContactMethods((prev)=>({
                                    ...prev,
                                    whatsApp: !prev.whatsApp
                                })),
                        className: `flex items-center justify-center gap-1.5 py-2 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${contactMethods.whatsApp ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400 font-extrabold shadow-sm' : 'bg-[#0d0d0e] border-[#202022] text-zinc-500 hover:text-zinc-350'}`,
                        children: [
                            contactMethods.whatsApp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                                lineNumber: 31,
                                columnNumber: 39
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "WhatsApp"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setContactMethods((prev)=>({
                                    ...prev,
                                    phone: !prev.phone
                                })),
                        className: `flex items-center justify-center gap-1.5 py-2 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${contactMethods.phone ? 'bg-blue-900/30 border-blue-500/50 text-blue-400 font-extrabold shadow-sm' : 'bg-[#0d0d0e] border-[#202022] text-zinc-500 hover:text-zinc-350'}`,
                        children: [
                            contactMethods.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                                lineNumber: 43,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Phone Call"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setContactMethods((prev)=>({
                                    ...prev,
                                    chat: !prev.chat
                                })),
                        className: `flex items-center justify-center gap-1.5 py-2 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${contactMethods.chat ? 'bg-red-900/30 border-[#FF3F3F]/50 text-[#FF3F3F] font-extrabold shadow-sm' : 'bg-[#0d0d0e] border-[#202022] text-zinc-500 hover:text-zinc-350'}`,
                        children: [
                            contactMethods.chat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-3 h-3 text-[#FF3F3F]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                                lineNumber: 55,
                                columnNumber: 35
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "In-App Chat"
                            }, void 0, false, {
                                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/create-post/ContactMethodsToggle.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = ContactMethodsToggle;
var _c;
__turbopack_context__.k.register(_c, "ContactMethodsToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/create-post/ImageUploadArea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ImageUploadArea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.js [app-client] (ecmascript) <export default as UploadCloud>");
"use client";
;
;
function ImageUploadArea() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1",
                children: "Add Images (Optional)"
            }, void 0, false, {
                fileName: "[project]/src/components/create-post/ImageUploadArea.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-dashed border-[#2b2b30] bg-[#0c0c0e] hover:bg-[#111114] rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                        className: "w-6 h-6 text-zinc-500 mb-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/create-post/ImageUploadArea.tsx",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-zinc-400 font-bold font-sans",
                        children: "Upload Images Here"
                    }, void 0, false, {
                        fileName: "[project]/src/components/create-post/ImageUploadArea.tsx",
                        lineNumber: 12,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[8px] text-zinc-650 font-mono uppercase tracking-widest mt-0.5",
                        children: "Max size 5MB • PNG, JPG"
                    }, void 0, false, {
                        fileName: "[project]/src/components/create-post/ImageUploadArea.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/create-post/ImageUploadArea.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/create-post/ImageUploadArea.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = ImageUploadArea;
var _c;
__turbopack_context__.k.register(_c, "ImageUploadArea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CreatePost.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreatePost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-range.js [app-client] (ecmascript) <export default as CalendarRange>");
// Modular Component Imports
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$create$2d$post$2f$CustomQuestionsInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/create-post/CustomQuestionsInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$create$2d$post$2f$ContactMethodsToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/create-post/ContactMethodsToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$create$2d$post$2f$ImageUploadArea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/create-post/ImageUploadArea.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CreatePost({ currentUser, onClose, onSubmit }) {
    _s();
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Home & Living');
    const [budget, setBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('₹15,000');
    const [timeline, setTimeline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('5 Days');
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(currentUser.location || 'Noida, Sector 62');
    const [expiryDays, setExpiryDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        ''
    ]);
    // Contact Method states
    const [contactMethods, setContactMethods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        whatsApp: true,
        phone: true,
        chat: true
    });
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!description.trim()) return;
        // Generate a title automatically from the first few words or description
        const titleVal = description.length > 35 ? description.substring(0, 35) + '...' : description;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        const filteredQuestions = questions.map((q)=>q.trim()).filter((q)=>q.length > 0);
        onSubmit({
            title: titleVal,
            description,
            category,
            location,
            type: 'help_needed',
            budget: budget || 'Negotiable',
            status: 'open',
            expiryDays,
            expiresAt: expiryDate.toISOString(),
            questions: filteredQuestions
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#121214] rounded-2xl border border-[#232327] max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 border-b border-[#1e1e21] flex justify-between items-center bg-[#17171a] select-none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-black tracking-widest uppercase text-zinc-300 font-mono",
                            children: "Post Requirement"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "close-post-modal-btn",
                            onClick: onClose,
                            className: "p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CreatePost.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CreatePost.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-5 overflow-y-auto flex-1 space-y-4 font-sans text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1",
                                    children: "What do you need?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    id: "create-post-desc-textarea",
                                    placeholder: "Describe your requirement in detail...",
                                    rows: 4,
                                    value: description,
                                    onChange: (e)=>setDescription(e.target.value),
                                    required: true,
                                    maxLength: 300,
                                    className: "w-full text-xs px-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg placeholder-zinc-650 focus:outline-hidden focus:border-[#FF3F3F] transition resize-none font-sans"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right text-[9px] text-zinc-550 mt-0.5 font-mono",
                                    children: [
                                        description.length,
                                        "/300"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1",
                                    children: "Category"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "create-post-category-select",
                                    value: category,
                                    onChange: (e)=>setCategory(e.target.value),
                                    className: "w-full text-xs px-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-[#FF3F3F]/30 focus:border-[#FF3F3F] transition cursor-pointer",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FUNCTIONAL_CATEGORIES"].filter((c)=>c !== 'All Categories').map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: cat,
                                            className: "bg-[#121214]",
                                            children: cat
                                        }, cat, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1",
                                            children: "Budget"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 120,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "create-post-budget",
                                            type: "text",
                                            placeholder: "Enter budget (e.g. ₹15,000)",
                                            value: budget,
                                            onChange: (e)=>setBudget(e.target.value),
                                            className: "w-full text-xs px-3 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg placeholder-zinc-600 focus:outline-hidden focus:border-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1",
                                            children: "Timeline"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "create-post-timeline",
                                            type: "text",
                                            placeholder: "e.g. 5 Days, Long Term",
                                            value: timeline,
                                            onChange: (e)=>setTimeline(e.target.value),
                                            className: "w-full text-xs px-3 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg placeholder-zinc-650 focus:outline-hidden focus:border-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1",
                                    children: "Location"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "create-post-location-input",
                                    type: "text",
                                    placeholder: "Select your location (e.g. Noida, Sector 62)",
                                    value: location,
                                    onChange: (e)=>setLocation(e.target.value),
                                    className: "w-full text-xs px-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg placeholder-zinc-650 focus:outline-hidden focus:border-[#FF3F3F]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5 font-mono",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__["CalendarRange"], {
                                            className: "w-3.5 h-3.5 text-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Automatically Expire Post After"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 160,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "create-post-expiry-select",
                                    value: expiryDays,
                                    onChange: (e)=>setExpiryDays(Number(e.target.value)),
                                    className: "w-full text-xs px-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-[#FF3F3F]/30 focus:border-[#FF3F3F] transition cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 1,
                                            className: "bg-[#121214]",
                                            children: "1 Day (Urgent Rush)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 2,
                                            className: "bg-[#121214]",
                                            children: "2 Days"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 3,
                                            className: "bg-[#121214]",
                                            children: "3 Days"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 5,
                                            className: "bg-[#121214]",
                                            children: "5 Days"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 171,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 7,
                                            className: "bg-[#121214]",
                                            children: "7 Days"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: 10,
                                            className: "bg-[#121214]",
                                            children: "10 Days (Maximum Duration)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CreatePost.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[9px] text-zinc-500 mt-1",
                                    children: "This listing will automatically withdraw and show as Expired after your chosen period."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$create$2d$post$2f$CustomQuestionsInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            questions: questions,
                            setQuestions: setQuestions
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$create$2d$post$2f$ImageUploadArea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$create$2d$post$2f$ContactMethodsToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            contactMethods: contactMethods,
                            setContactMethods: setContactMethods
                        }, void 0, false, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-4 flex flex-col gap-2 font-display",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "submit-create-post-btn",
                                    type: "submit",
                                    className: "w-full py-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black rounded-lg transition text-xs tracking-widest uppercase cursor-pointer",
                                    children: "Post Requirement"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "cancel-create-post-btn",
                                    type: "button",
                                    onClick: onClose,
                                    className: "w-full py-2 text-zinc-400 hover:text-white text-[10px] hover:bg-zinc-800 rounded transition cursor-pointer font-black bg-transparent uppercase tracking-wider",
                                    children: "Cancel Formulation"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CreatePost.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CreatePost.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CreatePost.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CreatePost.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/CreatePost.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(CreatePost, "QP7ayd+y3LvU+cezztO3NE6Jd0c=");
_c = CreatePost;
var _c;
__turbopack_context__.k.register(_c, "CreatePost");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LoginModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function LoginModal({ onLogin, onClose, isOpen, currentUserId }) {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [customName, setCustomName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [customRole, setCustomRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [customLocation, setCustomLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Noida, Sector 62');
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('signin');
    if (!isOpen) return null;
    const handleSelectUser = (user)=>{
        onLogin(user);
        if (onClose) onClose();
    };
    const handleCreateCustom = (e)=>{
        e.preventDefault();
        if (!customName.trim() || !customRole.trim()) return;
        const newUser = {
            id: `custom_${Date.now()}`,
            name: customName.trim(),
            avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`,
            role: customRole.trim(),
            location: customLocation.trim(),
            skills: [
                'Interior Design',
                'Home Decor',
                'Custom Carpentry'
            ],
            bio: 'Verified resident inside the HuntInTown network.',
            rating: 4.8,
            reputation: 20
        };
        onLogin(newUser);
        if (onClose) onClose();
    };
    const handleSimulatedSubmit = (e)=>{
        e.preventDefault();
        // Naturally simulate logging in as the default user (Arjun Mehta) or another mock
        onLogin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"]);
        if (onClose) onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#121214] rounded-2xl border border-[#232327] max-w-sm w-full overflow-hidden text-zinc-100 shadow-2xl animate-in zoom-in-95 duration-250",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-5 text-center border-b border-[#1e1e21] bg-[#17171a] relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-2 right-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "w-6 h-6 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-400 font-bold text-xs",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/src/components/LoginModal.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[#FF3F3F] font-black text-xl tracking-tighter uppercase font-display mb-1",
                            children: "HuntInTown"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-base font-black text-white font-display",
                            children: "Welcome Back 👋"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] text-zinc-400 font-semibold tracking-wide mt-0.5",
                            children: "Login to continue connection exchanges"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoginModal.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-[#1e1e21] bg-[#161619] justify-around",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('signin'),
                            className: `flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border-b-2 ${activeTab === 'signin' ? 'border-[#FF3F3F] text-[#FF3F3F]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`,
                            children: "Sign In Form"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('preset'),
                            className: `flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border-b-2 ${activeTab === 'preset' ? 'border-[#FF3F3F] text-[#FF3F3F]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`,
                            children: "Presets Simulation"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('forge'),
                            className: `flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border-b-2 ${activeTab === 'forge' ? 'border-[#FF3F3F] text-[#FF3F3F]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`,
                            children: "New Identity"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoginModal.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-5",
                    children: [
                        activeTab === 'signin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSimulatedSubmit,
                            className: "space-y-3.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSelectUser(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"]),
                                    className: "w-full py-2 bg-white hover:bg-zinc-100 text-zinc-900 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-200 cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png",
                                            alt: "Google",
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 115,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Login with Google"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 120,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setActiveTab('preset'),
                                    className: "w-full py-2 bg-[#232327] hover:bg-zinc-800 text-zinc-100 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "📱 Login with Mobile Code"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/LoginModal.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-0.5 my-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-[1px] bg-zinc-800 flex-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9px] font-mono uppercase tracking-widest text-[#FF3F3F]",
                                            children: "or continue with email"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-[1px] bg-zinc-800 flex-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 135,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1",
                                                    children: "Email"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/LoginModal.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                                lineNumber: 144,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            placeholder: "Enter your email",
                                                            value: email,
                                                            onChange: (e)=>setEmail(e.target.value),
                                                            className: "w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 146,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/LoginModal.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase",
                                                            children: "Password"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[8px] text-[#FF3F3F] hover:underline cursor-pointer",
                                                            children: "Forgot password?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/LoginModal.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "password",
                                                            placeholder: "Enter your password",
                                                            value: password,
                                                            onChange: (e)=>setPassword(e.target.value),
                                                            className: "w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/LoginModal.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "w-full py-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black rounded-lg text-xs uppercase tracking-wider font-display transition cursor-pointer mt-2",
                                            children: "Login Sim"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 175,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center pt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-zinc-500",
                                        children: [
                                            "Don't have an account? ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#FF3F3F] hover:underline font-bold cursor-pointer",
                                                onClick: ()=>setActiveTab('forge'),
                                                children: "Sign up"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                lineNumber: 185,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/LoginModal.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        activeTab === 'preset' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 max-h-[300px] overflow-y-auto pr-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[9px] font-bold text-zinc-500 tracking-wider uppercase block font-mono",
                                    children: "Select Preset Character"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "login-preset-alex",
                                    onClick: ()=>handleSelectUser(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"]),
                                    className: `p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition ${currentUserId === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"].id ? 'border-[#FF3F3F] bg-red-950/20 text-white' : 'border-zinc-800 bg-[#161619] hover:bg-zinc-800'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"].avatar,
                                            alt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"].name,
                                            className: "w-8.5 h-8.5 rounded-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 205,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-xs font-black text-white",
                                                    children: [
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"].name,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-normal text-[9px] text-[#FF3F3F]",
                                                            children: "(Default Star)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/LoginModal.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 93
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/LoginModal.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-[9px] text-zinc-400 truncate",
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"].role
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/LoginModal.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 206,
                                            columnNumber: 17
                                        }, this),
                                        currentUserId === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_USER"].id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "w-4 h-4 text-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 210,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this),
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_USERS"].map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: `login-preset-${u.id}`,
                                        onClick: ()=>handleSelectUser(u),
                                        className: `p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition ${currentUserId === u.id ? 'border-[#FF3F3F] bg-red-950/20 text-white' : 'border-zinc-800 bg-[#161619] hover:bg-zinc-800'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: u.avatar,
                                                alt: u.name,
                                                className: "w-8 h-8 rounded-full object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                lineNumber: 225,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "block text-xs font-black text-white",
                                                        children: u.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/LoginModal.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "block text-[9px] text-zinc-400 truncate",
                                                        children: u.role
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/LoginModal.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                lineNumber: 226,
                                                columnNumber: 19
                                            }, this),
                                            currentUserId === u.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "w-4 h-4 text-[#FF3F3F]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                lineNumber: 230,
                                                columnNumber: 46
                                            }, this)
                                        ]
                                    }, u.id, true, {
                                        fileName: "[project]/src/components/LoginModal.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this),
                        activeTab === 'forge' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleCreateCustom,
                            className: "space-y-3 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1",
                                            children: "Full Name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 239,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "custom-login-name",
                                            type: "text",
                                            placeholder: "e.g. Mary Gallagher",
                                            required: true,
                                            value: customName,
                                            onChange: (e)=>setCustomName(e.target.value),
                                            className: "w-full px-3.5 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 240,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 238,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1",
                                            children: "Profession / Role"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "custom-login-role",
                                            type: "text",
                                            placeholder: "e.g. Master Carpenter, Local Landlord",
                                            required: true,
                                            value: customRole,
                                            onChange: (e)=>setCustomRole(e.target.value),
                                            className: "w-full px-3.5 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 253,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[9px] font-mono tracking-wider font-bold text-zinc-500 uppercase mb-1",
                                            children: "Sector Coordinate"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 265,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "custom-login-location",
                                            type: "text",
                                            required: true,
                                            value: customLocation,
                                            onChange: (e)=>setCustomLocation(e.target.value),
                                            className: "w-full px-3.5 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg focus:outline-hidden focus:border-[#FF3F3F]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/LoginModal.tsx",
                                            lineNumber: 266,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 264,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "submit-register-custom",
                                        type: "submit",
                                        className: "w-full py-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                lineNumber: 282,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Create Identity & Log In"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/LoginModal.tsx",
                                                lineNumber: 283,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/LoginModal.tsx",
                                        lineNumber: 277,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LoginModal.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/LoginModal.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoginModal.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/LoginModal.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/LoginModal.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(LoginModal, "7fPYD03KHpTRD0wEIV/tHIKNWkM=");
_c = LoginModal;
var _c;
__turbopack_context__.k.register(_c, "LoginModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePost$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CreatePost.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoginModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoginModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function RootLayoutContent({ children }) {
    _s();
    const { currentUser, activeTab, setActiveTab, isCreatePostOpen, setIsCreatePostOpen, isLoginOpen, setIsLoginOpen, isMobileSimulated, setIsMobileSimulated, unreadMessagesCount, handleLoginSimulate, handleLogoutSimulate, handleCreatePost, searchTerm, setSearchTerm } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 bg-[#09090b] flex flex-col antialiased select-text text-zinc-100 overflow-x-hidden font-sans",
        children: [
            !isMobileSimulated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        currentUser: currentUser,
                        activeTab: activeTab,
                        setActiveTab: setActiveTab,
                        openCreatePost: ()=>setIsCreatePostOpen(true),
                        unreadMessagesCount: unreadMessagesCount,
                        onLogoutSimulate: handleLogoutSimulate,
                        isMobileSimulated: isMobileSimulated,
                        setIsMobileSimulated: setIsMobileSimulated,
                        searchTerm: searchTerm,
                        setSearchTerm: setSearchTerm
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:hidden fixed bottom-0 inset-x-0 bg-[#121214] border-t border-[#232327] flex items-center justify-around py-2.5 z-40 shadow-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "mobile-bottom-nav-home",
                                onClick: ()=>setActiveTab('landing'),
                                className: `flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'landing' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-350'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] uppercase tracking-wider scale-90",
                                        children: "Home"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "mobile-bottom-nav-feed",
                                onClick: ()=>setActiveTab('feed'),
                                className: `flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'feed' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-350'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] uppercase tracking-wider scale-90",
                                        children: "Browse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "mobile-bottom-nav-create",
                                onClick: ()=>setIsCreatePostOpen(true),
                                className: "flex items-center justify-center w-11 h-11 bg-[#FF3F3F] text-white rounded-full -mt-6 shadow-lg shadow-[#FF3F3F]/30 hover:bg-[#E53535] active:scale-95 transition cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/layout.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "mobile-bottom-nav-messages",
                                onClick: ()=>setActiveTab('messaging'),
                                className: `relative flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'messaging' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] uppercase tracking-wider scale-90",
                                        children: "Chats"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this),
                                    unreadMessagesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF3F3F] animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "mobile-bottom-nav-login",
                                onClick: ()=>setActiveTab('login'),
                                className: `flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'login' ? 'text-[#FF3F3F]' : 'text-zinc-500 hover:text-zinc-300'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] uppercase tracking-wider scale-90",
                                        children: "Sign In"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this) : /* PHONE DEVICE FRAME SANDBOX SIMULATOR WORKSPACE */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "phone-sandbox-wrapper",
                className: "flex-1 flex flex-col items-center justify-center p-4 bg-[#0d0d0f] overflow-y-auto min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-zinc-400 font-bold block mb-1",
                                children: "📱 HuntInTown iOS/Android Preview Simulation"
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "sandbox-exit-button",
                                onClick: ()=>setIsMobileSimulated(false),
                                className: "px-4 py-1.5 bg-[#1a1a1e] border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 font-black text-[10px] rounded-full transition cursor-pointer font-mono uppercase tracking-widest",
                                children: "Return to Wide Web View"
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-[360px] h-[740px] bg-[#0c0c0e] border-[10px] border-zinc-800 rounded-[48px] shadow-2xl relative flex flex-col overflow-hidden ring-4 ring-zinc-800/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-800 rounded-b-2xl z-55 flex justify-center items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-7 h-1 bg-zinc-950 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/layout.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-7 bg-zinc-900 text-zinc-450 px-6 pt-1 flex justify-between items-center text-[9px] font-mono select-none z-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "9:41 AM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1.5 items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "5G"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-5 h-2.5 bg-zinc-850 rounded-xs inline-block border border-zinc-800 relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute inset-y-0 left-0 bg-[#FF3F3F] w-[85%]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/layout.tsx",
                                                    lineNumber: 139,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#121214] border-b border-[#232327] px-4 py-3 flex justify-between items-center shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-black text-xs tracking-widest text-[#FF3F3F] font-display cursor-pointer",
                                        onClick: ()=>setActiveTab('landing'),
                                        children: "HuntInTown"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('login'),
                                        className: "text-[9px] bg-red-950/40 border border-[#FF3F3F]/30 text-[#FF3F3F] px-2.5 py-1 rounded font-black hover:bg-zinc-800 uppercase font-mono tracking-wider transition cursor-pointer",
                                        children: "Sign In / Switch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto bg-[#09090b] p-3 pb-20",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 inset-x-0 bg-[#121214] border-t border-[#232327] flex items-center justify-around py-2 z-40 shadow-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "sim-mobile-nav-home",
                                        onClick: ()=>setActiveTab('landing'),
                                        className: `flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'landing' ? 'text-[#FF3F3F]' : 'text-zinc-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                className: "w-4.5 h-4.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[8px] uppercase tracking-wider",
                                                children: "Home"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 170,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "sim-mobile-nav-feed",
                                        onClick: ()=>setActiveTab('feed'),
                                        className: `flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'feed' ? 'text-[#FF3F3F]' : 'text-zinc-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                                className: "w-4.5 h-4.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[8px] uppercase tracking-wider",
                                                children: "Browse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "sim-mobile-nav-create",
                                        onClick: ()=>setIsCreatePostOpen(true),
                                        className: "flex items-center justify-center w-10 h-10 bg-[#FF3F3F] text-white rounded-full -mt-5 shadow-lg shadow-[#FF3F3F]/30 hover:bg-[#E53535] active:scale-95 transition cursor-pointer",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-5.5 h-5.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/layout.tsx",
                                            lineNumber: 189,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "sim-mobile-nav-messages",
                                        onClick: ()=>setActiveTab('messaging'),
                                        className: `relative flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'messaging' ? 'text-[#FF3F3F]' : 'text-zinc-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                className: "w-4.5 h-4.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 199,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[8px] uppercase tracking-wider",
                                                children: "Chats"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            unreadMessagesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#FF3F3F]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 202,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "sim-mobile-nav-login",
                                        onClick: ()=>setActiveTab('login'),
                                        className: `flex flex-col items-center p-1 text-center font-bold cursor-pointer transition ${activeTab === 'login' ? 'text-[#FF3F3F]' : 'text-zinc-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-4.5 h-4.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 213,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[8px] uppercase tracking-wider",
                                                children: "Sign In"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/layout.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this),
            isCreatePostOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CreatePost$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                currentUser: currentUser,
                onClose: ()=>setIsCreatePostOpen(false),
                onSubmit: handleCreatePost
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoginModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isLoginOpen,
                onClose: ()=>setIsLoginOpen(false),
                onLogin: handleLoginSimulate,
                currentUserId: currentUser.id
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 231,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(RootLayoutContent, "0feZ6kh/Kpca9cTJW60Gh4Oj0jc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"]
    ];
});
_c = RootLayoutContent;
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "HuntInTown"
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppContextProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RootLayoutContent, {
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
}
_c1 = RootLayout;
var _c, _c1;
__turbopack_context__.k.register(_c, "RootLayoutContent");
__turbopack_context__.k.register(_c1, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0w5lb6x._.js.map