import { TopicId } from '../types';

export interface QuizQuestion {
  id: string;
  trackId: TopicId;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

export const QUIZ_QUESTIONS_BY_TRACK: Record<TopicId, QuizQuestion[]> = {
  'ai-fundamentals': [
    {
      id: 'aif-q1',
      trackId: 'ai-fundamentals',
      question: 'What is a "Token" in the context of Large Language Models (LLMs)?',
      options: [
        'An API authorization key used to log in',
        'A sub-word unit or fragment of text processed by the model (approx. 4 chars or 0.75 words)',
        'A cryptocurrency token used to pay for GPU runtime',
        'A physical hardware security key'
      ],
      correctAnswer: 1,
      explanation: 'Tokens are sub-word text chunks used by tokenizers (like BPE or SentencePiece). 1 token roughly corresponds to 4 English characters or ~0.75 words.',
      difficulty: 'Beginner',
      category: 'Tokens & Architecture'
    },
    {
      id: 'aif-q2',
      trackId: 'ai-fundamentals',
      question: 'How does setting Temperature (T = 0.0) affect LLM text generation?',
      options: [
        'It makes the model generate highly creative and unpredictable text',
        'It speeds up the GPU fan to cool down the processor',
        'It selects the single highest-probability token every time (greedy sampling), producing deterministic results',
        'It causes the model to hallucinate random facts'
      ],
      correctAnswer: 2,
      explanation: 'At T = 0.0, the softmax probability distribution is sharpened so that the top candidate token is chosen 100% of the time, making output deterministic and repeatable.',
      difficulty: 'Beginner',
      category: 'Sampling Parameters'
    },
    {
      id: 'aif-q3',
      trackId: 'ai-fundamentals',
      question: 'What is "Hallucination" in generative AI models?',
      options: [
        'When an AI model generates visual art with surreal deepdream patterns',
        'When an LLM produces confident-sounding statements that are factually incorrect or unverified',
        'When the model runs out of GPU VRAM memory during inference',
        'When a model translates text into a foreign language without user permission'
      ],
      correctAnswer: 1,
      explanation: 'Hallucination happens because LLMs predict statistically plausible next tokens rather than querying a verified factual database. Grounding and RAG reduce hallucinations.',
      difficulty: 'Beginner',
      category: 'Model Reliability'
    },
    {
      id: 'aif-q4',
      trackId: 'ai-fundamentals',
      question: 'What does RAG stand for in modern AI architecture?',
      options: [
        'Rapid Artificial Generalization',
        'Random Activation Gating',
        'Retrieval-Augmented Generation',
        'Recurrent Autoencoder Generator'
      ],
      correctAnswer: 2,
      explanation: 'Retrieval-Augmented Generation (RAG) fetches relevant chunks from external vector databases and injects them into the LLM prompt as context.',
      difficulty: 'Beginner',
      category: 'RAG & Vector Search'
    },
    {
      id: 'aif-q5',
      trackId: 'ai-fundamentals',
      question: 'What does a "7B" or "70B" model label indicate?',
      options: [
        'The year the model was trained (2007 vs 2070)',
        'The number of trainable weights/parameters in billions (7 Billion vs 70 Billion)',
        'The price in dollars per million tokens',
        'The number of user chats processed per second'
      ],
      correctAnswer: 1,
      explanation: 'B stands for Billion parameters (weights). A 7B model has 7 billion parameters, requiring roughly 4-8 GB of VRAM, while a 70B model requires 40-80 GB of VRAM.',
      difficulty: 'Beginner',
      category: 'Model Scale & VRAM'
    },
    {
      id: 'aif-q6',
      trackId: 'ai-fundamentals',
      question: 'What is Top-P (Nucleus) Sampling?',
      options: [
        'Sampling tokens only from the top P percentage of the model layer weights',
        'Selecting candidates from the smallest cumulative probability pool that sums up to P (e.g. 0.90)',
        'A setting that restricts prompt inputs to P characters',
        'A technique to delete 90% of model parameters'
      ],
      correctAnswer: 1,
      explanation: 'Top-P (Nucleus Sampling) dynamic filters candidate tokens so that only the most probable tokens whose cumulative probability sum reaches P (e.g., 90%) are considered.',
      difficulty: 'Intermediate',
      category: 'Sampling Parameters'
    },
    {
      id: 'aif-q7',
      trackId: 'ai-fundamentals',
      question: 'What is a Vector Embedding in AI?',
      options: [
        'An array of numerical floating-point numbers representing semantic meaning in high-dimensional space',
        'A vector graphics SVG image file embedded inside a prompt',
        'A physical hardware chip embedded on motherboard GPUs',
        'A HTML <iframe> element containing an AI chatbot'
      ],
      correctAnswer: 0,
      explanation: 'Embeddings convert text into dense numerical vectors (e.g., 768 or 1536 dimensions) where words with similar semantic meanings sit close together in vector space.',
      difficulty: 'Intermediate',
      category: 'Embeddings & Vectors'
    },
    {
      id: 'aif-q8',
      trackId: 'ai-fundamentals',
      question: 'What is Chain-of-Thought (CoT) prompting?',
      options: [
        'Connecting multiple API calls together in a chain',
        'Explicitly prompting the model to "think step-by-step" before producing its final answer',
        'Running 10 prompts simultaneously on parallel GPU threads',
        'Encrypting prompts using blockchain technology'
      ],
      correctAnswer: 1,
      explanation: 'Chain-of-Thought (CoT) guides the model to output intermediate reasoning steps, which dramatically improves performance on complex math, logic, and coding tasks.',
      difficulty: 'Intermediate',
      category: 'Prompt Engineering'
    }
  ],

  'python-core': [
    {
      id: 'pyc-q1',
      trackId: 'python-core',
      question: 'What is the correct way to define a function in Python?',
      options: [
        'function my_func():',
        'def my_func():',
        'create my_func():',
        'fn my_func() {}'
      ],
      correctAnswer: 1,
      explanation: 'In Python, the `def` keyword is used to declare a function header followed by parameter names and a colon.',
      difficulty: 'Beginner',
      category: 'Syntax Basics'
    },
    {
      id: 'pyc-q2',
      trackId: 'python-core',
      question: 'Which data structure in Python is mutable and defined with square brackets `[]`?',
      options: [
        'Tuple `(1, 2)`',
        'Dictionary `{"a": 1}`',
        'List `[1, 2, 3]`',
        'Set `{1, 2}`'
      ],
      correctAnswer: 2,
      explanation: 'Lists in Python are ordered, mutable collections enclosed in square brackets `[]`.',
      difficulty: 'Beginner',
      category: 'Data Structures'
    },
    {
      id: 'pyc-q3',
      trackId: 'python-core',
      question: 'What does the `range(1, 5)` function generate in a Python loop?',
      options: [
        '[1, 2, 3, 4, 5]',
        '[1, 2, 3, 4]',
        '[0, 1, 2, 3, 4]',
        '[5, 4, 3, 2, 1]'
      ],
      correctAnswer: 1,
      explanation: '`range(start, stop)` includes `start` up to but excluding `stop`. Thus `range(1, 5)` gives numbers 1, 2, 3, 4.',
      difficulty: 'Beginner',
      category: 'Control Flow'
    },
    {
      id: 'pyc-q4',
      trackId: 'python-core',
      question: 'What is the purpose of `__init__` in a Python class?',
      options: [
        'To initialize the Python interpreter',
        'It is the class constructor method called automatically when creating a new object instance',
        'To import external modules at startup',
        'To convert a class into a string'
      ],
      correctAnswer: 1,
      explanation: '`__init__` is Python instance constructor method where instance properties are attached to `self`.',
      difficulty: 'Intermediate',
      category: 'OOP'
    }
  ],

  'python': [
    {
      id: 'py-q1',
      trackId: 'python',
      question: 'In NumPy, what function creates an array of zeros with shape (3, 3)?',
      options: [
        'np.empty((3,3))',
        'np.zeros((3, 3))',
        'np.nulls(3, 3)',
        'np.create_zeros(3)'
      ],
      correctAnswer: 1,
      explanation: '`np.zeros((3, 3))` creates a 3x3 matrix initialized with float zeros `0.`.',
      difficulty: 'Beginner',
      category: 'NumPy Vectorization'
    },
    {
      id: 'py-q2',
      trackId: 'python',
      question: 'What does broadcasting in NumPy allow you to do?',
      options: [
        'Stream array data over network sockets',
        'Perform element-wise arithmetic operations on arrays with different compatible shapes without copying data',
        'Broadcast audio signals from Python scripts',
        'Convert Python lists to C pointers'
      ],
      correctAnswer: 1,
      explanation: 'Broadcasting stretches smaller arrays across larger array dimensions automatically during element-wise mathematical operations.',
      difficulty: 'Intermediate',
      category: 'NumPy Vectorization'
    }
  ],

  'javascript': [
    {
      id: 'js-q1',
      trackId: 'javascript',
      question: 'What keyword defines a block-scoped reassignable variable in modern JavaScript?',
      options: ['var', 'let', 'const', 'def'],
      correctAnswer: 1,
      explanation: '`let` declares block-scoped variables that can be reassigned. `const` is block-scoped but constant.',
      difficulty: 'Beginner',
      category: 'JS Fundamentals'
    },
    {
      id: 'js-q2',
      trackId: 'javascript',
      question: 'What is the return value of `typeof null` in JavaScript?',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctAnswer: 2,
      explanation: 'Due to a historical bug in JS since 1995, `typeof null` returns `"object"`.',
      difficulty: 'Intermediate',
      category: 'JS Quirks'
    }
  ],

  'html-css': [
    {
      id: 'hc-q1',
      trackId: 'html-css',
      question: 'Which CSS Flexbox property aligns items along the cross axis?',
      options: ['justify-content', 'align-items', 'flex-direction', 'grid-template'],
      correctAnswer: 1,
      explanation: '`align-items` aligns flex items along the cross axis, while `justify-content` handles the main axis.',
      difficulty: 'Beginner',
      category: 'CSS Layouts'
    }
  ],

  'java': [
    {
      id: 'java-q1',
      trackId: 'java',
      question: 'Which Java keyword prevents a class from being inherited or a method from being overridden?',
      options: ['static', 'final', 'abstract', 'private'],
      correctAnswer: 1,
      explanation: 'In Java, `final` applied to a class prevents inheritance, and on a method prevents overriding.',
      difficulty: 'Beginner',
      category: 'Java OOP'
    }
  ],

  'cpp': [
    {
      id: 'cpp-q1',
      trackId: 'cpp',
      question: 'What does the `&` operator return when placed before a variable in C++ (e.g. `&x`)?',
      options: ['The bitwise AND value', 'The memory address of the variable', 'The value pointed to by a pointer', 'A reference copy'],
      correctAnswer: 1,
      explanation: 'The address-of operator `&` evaluates to the memory address where the variable is stored.',
      difficulty: 'Beginner',
      category: 'Memory & Pointers'
    }
  ],

  'ml': [
    {
      id: 'ml-q1',
      trackId: 'ml',
      question: 'In Supervised Machine Learning, what characterizes the training dataset?',
      options: [
        'Raw unlabeled data without target ground truths',
        'Data paired with explicit target labels/ground truths',
        'Data collected exclusively from web scrapers',
        'Synthetic random numbers generated by GANs'
      ],
      correctAnswer: 1,
      explanation: 'Supervised learning trains on input features paired with target ground-truth labels (y).',
      difficulty: 'Beginner',
      category: 'ML Fundamentals'
    }
  ],

  'dl': [
    {
      id: 'dl-q1',
      trackId: 'dl',
      question: 'What activation function outputs values constrained between 0.0 and 1.0, ideal for binary probability?',
      options: ['ReLU', 'Sigmoid', 'Softmax', 'Tanh'],
      correctAnswer: 1,
      explanation: 'Sigmoid $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ squashes any real value into the $(0, 1)$ interval for binary classification.',
      difficulty: 'Beginner',
      category: 'Activation Functions'
    }
  ],

  'neural-nets': [
    {
      id: 'nn-q1',
      trackId: 'neural-nets',
      question: 'What mathematical algorithm is used to calculate the gradient of the loss function with respect to every weight in a neural network?',
      options: [
        'Forward propagation',
        'Backpropagation (Chain Rule of Calculus)',
        'K-Means clustering',
        'Principal Component Analysis (PCA)'
      ],
      correctAnswer: 1,
      explanation: 'Backpropagation applies the calculus chain rule backwards through network layers to compute weight loss gradients for gradient descent updates.',
      difficulty: 'Intermediate',
      category: 'Backprop & Training'
    }
  ]
};
