export interface RoomMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member' | 'ai';
  isOnline: boolean;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: 'admin' | 'member' | 'ai';
  timestamp: string;
  type: 'text' | 'code' | 'video' | 'voice';
  content: string; // Plain text or description
  codeData?: {
    language: string;
    code: string;
  };
  videoData?: {
    title: string;
    youtubeUrl: string;
    embedId: string;
  };
  voiceData?: {
    durationSeconds: number;
    waveform: number[];
  };
  isPinned?: boolean;
}

export interface StudyRoom {
  id: string;
  name: string;
  topicTag: string;
  description: string;
  memberCount: number;
  unreadCount: number;
  members: RoomMember[];
  messages: RoomMessage[];
  pinnedMessageId?: string;
  createdById: string;
  isCustom?: boolean;
}

export const INITIAL_ROOMS: StudyRoom[] = [
  {
    id: 'room-python',
    name: 'Python Beginners & AI',
    topicTag: 'Python',
    description: 'Collaborative study space for Python fundamentals, NumPy vectorization, and matrix dot products.',
    memberCount: 24,
    unreadCount: 2,
    createdById: 'user-self',
    pinnedMessageId: 'msg-py-pin',
    members: [
      { id: 'user-self', name: 'You (Student)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'admin', isOnline: true },
      { id: 'ai-bot', name: 'LearnBot AI', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', role: 'ai', isOnline: true },
      { id: 'm-1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', role: 'member', isOnline: true },
      { id: 'm-2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: 'member', isOnline: false },
      { id: 'm-3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'member', isOnline: true },
    ],
    messages: [
      {
        id: 'msg-py-pin',
        senderId: 'user-self',
        senderName: 'You (Student)',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        timestamp: '10:15 AM',
        type: 'text',
        content: '📌 Welcome to the Python AI study group! Feel free to share code snippets, video tutorials, or ask LearnBot AI for help.',
        isPinned: true,
      },
      {
        id: 'msg-py-video-1',
        senderId: 'm-1',
        senderName: 'Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        senderRole: 'member',
        timestamp: '10:18 AM',
        type: 'video',
        content: 'Hey everyone, check out this video on how backpropagation works step-by-step!',
        videoData: {
          title: 'But what is a neural network? | Chapter 1, Deep learning',
          youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
          embedId: 'aircAruvnKk',
        },
      },
      {
        id: 'msg-py-text-2',
        senderId: 'm-3',
        senderName: 'Marcus Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        senderRole: 'member',
        timestamp: '10:22 AM',
        type: 'text',
        content: 'I watched that video! I didn\'t quite get the part about weighted sums around 4:20 though. Can anyone clarify?',
      },
      {
        id: 'msg-py-ai-1',
        senderId: 'ai-bot',
        senderName: 'LearnBot AI',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        senderRole: 'ai',
        timestamp: '10:23 AM',
        type: 'text',
        content: '🤖 **Video Breakdown @ 4:20 in "But what is a neural network?"**:\n\nAt 4:20, Grant Sanderson explains that each pixel in a 28x28 image corresponds to an input neuron (784 total). The **weighted sum** ($z = w_1 x_1 + w_2 x_2 + ... + b$) measures how strongly a specific pattern in the previous layer excites the next neuron. \n\nNegative weights look for the *absence* of a feature, while positive weights look for its *presence*!',
      },
      {
        id: 'msg-py-code-1',
        senderId: 'm-2',
        senderName: 'Sarah Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        senderRole: 'member',
        timestamp: '10:28 AM',
        type: 'code',
        content: 'Here is a clean implementation of a single neuron forward pass in pure Python:',
        codeData: {
          language: 'python',
          code: `# Single Artificial Neuron Forward Pass
inputs = [1.2, 0.8, -0.5]
weights = [0.2, 0.8, -0.5]
bias = 2.0

output = sum(i * w for i, w in zip(inputs, weights)) + bias
print(f"Calculated Output: {output:.4f}")`,
        },
      },
      {
        id: 'msg-py-voice-1',
        senderId: 'm-1',
        senderName: 'Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        senderRole: 'member',
        timestamp: '10:32 AM',
        type: 'voice',
        content: 'Voice note explaining matrix transpose',
        voiceData: {
          durationSeconds: 14,
          waveform: [20, 45, 80, 60, 95, 30, 50, 85, 70, 40, 90, 65, 35, 20],
        },
      },
    ],
  },
  {
    id: 'room-ml',
    name: 'ML & Math Study Group',
    topicTag: 'Machine Learning',
    description: 'Gradient descent intuition, calculus, linear regression, decision trees, and ensemble methods.',
    memberCount: 18,
    unreadCount: 0,
    createdById: 'm-1',
    members: [
      { id: 'm-1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', role: 'admin', isOnline: true },
      { id: 'ai-bot', name: 'LearnBot AI', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', role: 'ai', isOnline: true },
      { id: 'user-self', name: 'You (Student)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'member', isOnline: true },
    ],
    messages: [
      {
        id: 'msg-ml-1',
        senderId: 'm-1',
        senderName: 'Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        timestamp: 'Yesterday',
        type: 'text',
        content: 'Welcome everyone! In this room we discuss optimization algorithms like Adam and SGD.',
      },
      {
        id: 'msg-ml-ai-1',
        senderId: 'ai-bot',
        senderName: 'LearnBot AI',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        senderRole: 'ai',
        timestamp: 'Yesterday',
        type: 'text',
        content: '🤖 Hello! I am your ML assistant. Ask me about bias-variance tradeoff, cross-validation, or loss functions anytime!',
      },
    ],
  },
  {
    id: 'room-dl',
    name: 'Deep Learning & Transformers',
    topicTag: 'Deep Learning',
    description: 'Discussing attention heads, vision transformers, CNNs, and multi-GPU training tricks.',
    memberCount: 31,
    unreadCount: 1,
    createdById: 'm-2',
    members: [
      { id: 'm-2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: 'admin', isOnline: true },
      { id: 'ai-bot', name: 'LearnBot AI', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', role: 'ai', isOnline: true },
      { id: 'user-self', name: 'You (Student)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'member', isOnline: true },
    ],
    messages: [
      {
        id: 'msg-dl-1',
        senderId: 'm-2',
        senderName: 'Sarah Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        timestamp: '09:00 AM',
        type: 'text',
        content: 'Has anyone tried the Transformer Visualizer tool in the Simulators tab? The Q * K^T heatmap is so intuitive!',
      },
    ],
  },
  {
    id: 'room-js',
    name: 'JavaScript & Node Web Stack',
    topicTag: 'JavaScript',
    description: 'Full-stack AI apps, TensorFlow.js in the browser, async workflows, and WebSockets.',
    memberCount: 15,
    unreadCount: 0,
    createdById: 'm-3',
    members: [
      { id: 'm-3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'admin', isOnline: true },
      { id: 'ai-bot', name: 'LearnBot AI', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', role: 'ai', isOnline: true },
      { id: 'user-self', name: 'You (Student)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'member', isOnline: true },
    ],
    messages: [
      {
        id: 'msg-js-1',
        senderId: 'm-3',
        senderName: 'Marcus Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        timestamp: '08:45 AM',
        type: 'text',
        content: 'Sharing async/await patterns for streaming AI responses from Express to React frontend.',
      },
    ],
  },
];
