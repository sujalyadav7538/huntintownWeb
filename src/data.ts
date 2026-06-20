import { Post, User, Conversation } from './types';

export const INITIAL_USER: User = {
  id: 'current_user',
  name: 'Arjun Mehta',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Matching avatar representation
  role: 'Interior Designer | 5+ years experience',
  location: 'Noida, Sector 62',
  skills: ['Interior Design', 'Home Decor', 'Modular Kitchen', '3D Generalist', 'CAD Draftsperson'],
  bio: 'Specialized in modern & minimal designs. Passionate about creating elegant living spaces. Connect with me for premium interior layouts.',
  rating: 4.8,
  reputation: 320,
  joinedAt: 'March 2025'
};

export const MOCK_USERS: User[] = [
  {
    id: 'user_rohit',
    name: 'Rohit Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Local Homeowner',
    location: 'Noida, Sector 62',
    rating: 4.9,
    reputation: 110,
    skills: ['Client Relations'],
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
    skills: ['Education Administration'],
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
    skills: ['Real Estate Planning'],
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
    skills: ['Custom Sofas', 'Carpentry', 'Warranty Support'],
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
    skills: ['Minimalist Decor', 'Custom Living Arrangements'],
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
    skills: ['Sofa Design', 'Fast Shipping'],
    bio: 'Providing the latest trending premium design catalogs. Fast delivery within 5 business days.'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_rohit_1',
    title: 'Need custom sofa',
    description: 'Looking for a modern L-shape sofa under ₹15,000. Need it within 5 days. Must fit a compact drawing room layout.',
    category: 'Home & Living',
    location: 'Noida, Sector 62',
    type: 'help_needed',
    budget: '₹15,000',
    createdAt: '2026-06-06T03:18:00Z', // 2h ago
    expiresAt: '2026-06-16T03:18:00Z', // 10 days after
    expiryDays: 10,
    questions: [
      'What type of foam density/materials do you use?',
      'Do you have wood color options for the frame legs?'
    ],
    status: 'open',
    offersCount: 12,
    author: MOCK_USERS[0], // Rohit
    comments: [
      {
        id: 'offer_1',
        postId: 'post_rohit_1',
        author: MOCK_USERS[3], // Furniture Studio
        content: 'We can deliver within 4 days. Premium quality materials with 1 year warranty. Custom frame customization is also available!',
        createdAt: '2026-06-06T03:45:00Z',
        isOffer: true,
        offerBudget: '₹14,500',
        offerDuration: '4 days',
        answers: [
          { question: 'What type of foam density/materials do you use?', answer: 'We use high-density 40 High Resilience (HR) foam with Sleepwell branded comfort layer.' },
          { question: 'Do you have wood color options for the frame legs?', answer: 'Yes! We offer natural teak wood finish, dark walnut, and charcoal black polish.' }
        ]
      },
      {
        id: 'offer_2',
        postId: 'post_rohit_1',
        author: MOCK_USERS[4], // Crafted Comforts
        content: 'We have similar designs in our local showroom in Sector 18. We can customize the dimensions and fabric tone as per your specific layout requirement!',
        createdAt: '2026-06-06T04:10:00Z',
        isOffer: true,
        offerBudget: '₹13,800',
        offerDuration: '5 days',
        answers: [
          { question: 'What type of foam density/materials do you use?', answer: 'We offer customizable foam densities (32 to 40 density) using premium pine wood frames.' },
          { question: 'Do you have wood color options for the frame legs?', answer: 'Yes, we have teak, mahogany, and steel hairpin options too.' }
        ]
      },
      {
        id: 'offer_3',
        postId: 'post_rohit_1',
        author: MOCK_USERS[5], // Sofa House
        content: 'Latest design catalog available immediately. Quick standard dispatch with guarantee. Guaranteed delivery within 5 days.',
        createdAt: '2026-06-06T04:30:00Z',
        isOffer: true,
        offerBudget: '₹15,000',
        offerDuration: '5 days',
        answers: [
          { question: 'What type of foam density/materials do you use?', answer: 'Standard 32 density medium-firm support.' },
          { question: 'Do you have wood color options for the frame legs?', answer: 'Teak and Mahogany only.' }
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
    createdAt: '2026-06-06T01:18:00Z', // 4h ago
    expiresAt: '2026-06-13T01:18:00Z', // 7 days after
    expiryDays: 7,
    questions: [
      'How many years of experience do you have with CBSE board class 11?',
      'Are you available for offline sessions or only online whiteboard classes?'
    ],
    status: 'open',
    offersCount: 8,
    author: MOCK_USERS[1], // Anjali
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
    createdAt: '2026-06-05T23:18:00Z', // 6h ago
    expiresAt: '2026-06-15T23:18:00Z', // 10 days after
    expiryDays: 10,
    questions: [
      'Could you share links or pictures of your last minimalist 2BHK styling?',
      'What software tools do you use for 3D walkthrough rendering?'
    ],
    status: 'open',
    offersCount: 5,
    author: MOCK_USERS[2], // Vivek
    comments: [
      {
        id: 'offer_vivek_arjun',
        postId: 'post_vivek_1',
        author: INITIAL_USER, // Arjun (the current user)
        content: 'Hi Vivek, I am Arjun, an interior designer based right in Sector 62. I have designed over fifteen 2BHK minimal apartments in Noida, with bespoke modular kitchen spacing. I would love to share my portfolio with you!',
        createdAt: '2026-06-06T00:15:00Z',
        isOffer: true,
        offerBudget: 'Quote Offered',
        offerDuration: '30 days',
        answers: [
          { question: 'Could you share links or pictures of your last minimalist 2BHK styling?', answer: 'Absolutely, I have a dedicated album link of my Sector 62 minimal designs which I can send over direct chat.' },
          { question: 'What software tools do you use for 3D walkthrough rendering?', answer: 'I use SketchUp paired with Lumion and V-Ray for ultra-realistic walkthrough renderings.' }
        ]
      }
    ]
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_rohit',
    participant: MOCK_USERS[0], // Rohit Sharma
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
    participant: MOCK_USERS[2], // Vivek
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

export const CATEGORIES = [
  'All',
  'Nearby',
  'Trending',
  'Urgent',
  'Premium'
];

export const FUNCTIONAL_CATEGORIES = [
  'All Categories',
  'Home & Living',
  'Education',
  'Handyman & Repairs',
  'Tech Support',
  'Design & Creative',
  'Other Services'
];
