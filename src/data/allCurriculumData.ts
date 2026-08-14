import { Lesson, TopicInfo } from '../types';

export interface ExtendedTopicInfo extends TopicInfo {
  category: 'Languages' | 'AI & ML';
  colorGradient: string;
}

export const ALL_TOPICS: ExtendedTopicInfo[] = [
  {
    id: 'ai-fundamentals',
    name: 'AI & LLM Concepts (Beginner)',
    tagline: 'Parameters, Temperature, RAG, Hallucination, Tokens & Prompts explained',
    isLive: true,
    iconName: 'BrainCircuit',
    description: 'The ultimate essential starter course for AI: learn parameter counts (7B to 405B), sampling temperature, top-p, hallucinations, RAG (Vector Search), tokens, context windows, and fine-tuning vs prompting.',
    estimatedHours: 8,
    level: 'Beginner',
    category: 'AI & ML',
    colorGradient: 'from-amber-500/20 to-orange-500/20',
    upcomingModules: [
      '1. Tokens, Prompts & Model Architecture',
      '2. Parameter Count & Model Size (7B - 405B)',
      '3. Temperature, Top-P & Sampling Controls',
      '4. Hallucination, Grounding & System Prompts',
      '5. RAG (Retrieval-Augmented Generation) & Vectors',
      '6. Fine-Tuning, LoRA & Prompt Engineering',
    ],
  },
  {
    id: 'python-core',
    name: 'Standard Python',
    tagline: 'Standard Python 3 syntax, control flow, functions, OOP & files',
    isLive: true,
    iconName: 'Code',
    description: 'Master core standard Python fundamentals: variables, lists, dictionaries, loops, functions, object-oriented programming (classes & inheritance), file operations, and exception handling.',
    estimatedHours: 10,
    level: 'Beginner',
    category: 'Languages',
    colorGradient: 'from-emerald-500/20 to-teal-500/20',
    upcomingModules: [
      'Variables, Data Types & Operators',
      'Control Flow: Conditionals & Loops',
      'Data Structures: Lists, Dicts & Tuples',
      'Functions, Scope & Lambdas',
      'Object-Oriented Programming (Classes)',
      'Error Handling & File Operations',
    ],
  },
  {
    id: 'python',
    name: 'Python for AI',
    tagline: 'The universal language of machine learning & data science',
    isLive: true,
    iconName: 'Code2',
    description: 'Master Python fundamentals, NumPy vectorization, OOP for neural net layers, and building custom model architectures from scratch.',
    estimatedHours: 12,
    level: 'Beginner',
    category: 'Languages',
    colorGradient: 'from-blue-500/20 to-cyan-500/20',
    upcomingModules: [
      'Python Syntax & Data Types',
      'NumPy Matrix & Tensor Operations',
      'Building Neural Layers from Scratch',
      'Gradient Descent & Backprop',
      'Loss Functions & Evaluation Metrics',
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript & Node',
    tagline: 'In-browser AI & full-stack web applications',
    isLive: true,
    iconName: 'Terminal',
    description: 'Learn async workflows, TensorFlow.js in the browser, client-side inferencing, and serving ML models over REST & WebSockets.',
    estimatedHours: 10,
    level: 'Intermediate',
    category: 'Languages',
    colorGradient: 'from-yellow-500/20 to-amber-500/20',
    upcomingModules: [
      'Modern JS Async & Event Loops',
      'Browser Canvas & WebGL Shaders',
      'TensorFlow.js Fundamentals',
      'Deploying AI Microservices with Express',
    ],
  },
  {
    id: 'html-css',
    name: 'HTML & CSS Web UI',
    tagline: 'Building responsive, high-performance web interfaces',
    isLive: true,
    iconName: 'Layout',
    description: 'Master semantic HTML5, modern CSS Grid/Flexbox layouts, dark/light theme systems, and GPU-accelerated web animations.',
    estimatedHours: 8,
    level: 'Beginner',
    category: 'Languages',
    colorGradient: 'from-orange-500/20 to-amber-600/20',
    upcomingModules: [
      'Semantic HTML5 & Accessibility',
      'CSS Grid, Flexbox & Responsive Design',
      'Glassmorphism & CSS Custom Properties',
      'Animations with CSS Transforms & Transitions',
    ],
  },
  {
    id: 'java',
    name: 'Java Fundamentals',
    tagline: 'Object-oriented programming & enterprise systems',
    isLive: false,
    iconName: 'Coffee',
    description: 'Strongly-typed object-oriented design, garbage collection, concurrency primitives, and big data pipeline integration.',
    estimatedHours: 14,
    level: 'Intermediate',
    category: 'Languages',
    colorGradient: 'from-red-500/20 to-amber-600/20',
    upcomingModules: [
      'Java Syntax & OOP Polymorphism',
      'Generics & Collections Framework',
      'Multithreading & Concurrency',
      'Big Data Processing with Java Engine',
    ],
  },
  {
    id: 'cpp',
    name: 'C++ Systems',
    tagline: 'High-performance computing & GPU memory allocation',
    isLive: true,
    iconName: 'Cpu',
    description: 'Understand low-level memory management, CUDA GPU kernels, SIMD vectorization, and bare-metal performance optimization for deep learning.',
    estimatedHours: 18,
    level: 'Advanced',
    category: 'Languages',
    colorGradient: 'from-cyan-500/20 to-blue-600/20',
    upcomingModules: [
      'Pointers, References & Memory Layout',
      'SIMD Vectorization & Cache Locality',
      'Writing Custom CUDA Kernels',
      'C++ Engine Integration with PyTorch C++ API',
    ],
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    tagline: 'Supervised & unsupervised algorithms intuition',
    isLive: true,
    iconName: 'BrainCircuit',
    description: 'Linear regression, decision trees, random forests, clustering, cross-validation, and feature engineering fundamentals.',
    estimatedHours: 15,
    level: 'Beginner',
    category: 'AI & ML',
    colorGradient: 'from-purple-500/20 to-violet-600/20',
    upcomingModules: [
      'Supervised vs Unsupervised Learning',
      'Gradient Descent Math & Optimization',
      'Decision Trees & Ensemble Methods',
      'Cross-Validation & Hyperparameter Tuning',
    ],
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    tagline: 'Multi-layer perceptrons, CNNs & Transformers',
    isLive: true,
    iconName: 'Layers',
    description: 'Deep network architectures, activation functions, convolutional filters for vision, and self-attention mechanisms.',
    estimatedHours: 20,
    level: 'Intermediate',
    category: 'AI & ML',
    colorGradient: 'from-indigo-500/20 to-purple-600/20',
    upcomingModules: [
      'Multi-layer Perceptrons (MLP)',
      'Convolutional Neural Networks (CNN)',
      'Recurrent Networks & Transformers',
      'Regularization: Dropout & Batch Norm',
    ],
  },
  {
    id: 'neural-nets',
    name: 'Neural Networks',
    tagline: 'Intuitive mechanics of artificial neurons & loss optimization',
    isLive: true,
    iconName: 'Network',
    description: 'Mathematical intuition behind artificial neurons, feedforward passes, weight initialization, and step-by-step backpropagation.',
    estimatedHours: 14,
    level: 'Intermediate',
    category: 'AI & ML',
    colorGradient: 'from-teal-500/20 to-cyan-600/20',
    upcomingModules: [
      'Anatomy of a Single Neuron',
      'Forward Propagation Matrix Math',
      'Loss Functions: MSE vs Cross-Entropy',
      'The Chain Rule & Backprop Intuition',
    ],
  },
];

export const PYTHON_LESSONS: Lesson[] = [
  {
    id: 'py-01',
    title: '1. Python Fundamentals & Matrix Dot Products',
    shortDesc: 'Learn how matrix multiplication forms the backbone of neural network forward passes.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Python', 'Arrays', 'Linear Algebra'],
    contentMarkdown: `### Why Matrix Math Powers Artificial Intelligence

In a neural network, every layer receives an input vector $X$ and computes a weighted linear combination:

$$Z = W \\cdot X + B$$

Where:
- **$W$**: Matrix of weights representing synapse strengths
- **$X$**: Vector of feature inputs
- **$B$**: Bias terms shifting the activation threshold

#### Python Implementation

Instead of using nested \`for\` loops, we use vectorized dot products:

\`\`\`python
# Single Artificial Neuron Forward Pass
inputs = [1.2, 0.8, -0.5]
weights = [0.2, 0.8, -0.5]
bias = 2.0

output = sum([i * w for i, w in zip(inputs, weights)]) + bias
print(f"Neuron Output: {output:.4f}")
\`\`\`

#### Interactive Goal
Run the code snippet in the playground to observe how changing bias values shifts the activation threshold!`,
    initialCode: `# Lesson 1: Artificial Neuron Activation
inputs = [1.2, 0.8, -0.5]
weights = [0.2, 0.8, -0.5]
bias = 2.0

weighted_sum = sum(i * w for i, w in zip(inputs, weights)) + bias

print("Inputs:", inputs)
print("Weights:", weights)
print("Bias:", bias)
print("Calculated Neuron Output:", round(weighted_sum, 4))
`,
    expectedOutput: 'Calculated Neuron Output: 3.13',
  },
  {
    id: 'py-02',
    title: '2. Activation Functions: ReLU, Sigmoid & Tanh',
    shortDesc: 'Introduce non-linearity so networks can learn non-linear decision boundaries.',
    durationMinutes: 25,
    level: 'Beginner',
    topics: ['Activations', 'Calculus', 'Python'],
    contentMarkdown: `### Why Non-Linearity Matters

Without activation functions, cascading 100 linear layers together is mathematically equivalent to a **single linear layer**. Activation functions enable neural networks to learn complex curves and spirals!

#### Common Activation Functions

1. **ReLU (Rectified Linear Unit)**:
   $$f(x) = \\max(0, x)$$
   Fastest to compute, avoids vanishing gradient problem.

2. **Sigmoid**:
   $$\\sigma(x) = \\frac{1}{1 + e^{-x}}$$
   Squeezes values between $0$ and $1$, perfect for probability output.

3. **Tanh (Hyperbolic Tangent)**:
   $$f(x) = \\tanh(x)$$
   Squeezes values between $-1$ and $1$, zero-centered.`,
    initialCode: `# Lesson 2: Implementing Activation Functions
import math

def relu(x):
    return max(0.0, float(x))

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def tanh(x):
    return math.tanh(x)

test_values = [-3.0, -1.0, 0.0, 1.5, 4.0]

print("Input \\t ReLU \\t Sigmoid \\t Tanh")
print("-" * 40)
for val in test_values:
    r = relu(val)
    s = sigmoid(val)
    t = tanh(val)
    print(f"{val:4.1f} \\t {r:4.2f} \\t {s:6.4f} \\t {t:6.4f}")
`,
    expectedOutput: 'Sigmoid(0.0) = 0.5000',
  },
  {
    id: 'py-03',
    title: '3. Building a Multi-Layer Feedforward Pass',
    shortDesc: 'Connect multiple neurons into dense layers and propagate signals forward.',
    durationMinutes: 30,
    level: 'Intermediate',
    topics: ['Dense Layer', 'Feedforward', 'Matrices'],
    contentMarkdown: `### Multi-Neuron Layers

A dense (fully-connected) layer contains $N$ neurons, where each neuron receives inputs from all $M$ nodes in the preceding layer.`,
    initialCode: `# Lesson 3: Dense Layer Forward Pass
inputs = [1.5, -0.5, 2.0]

weights_matrix = [
    [0.2, 0.8, -0.5],   # Neuron 1
    [0.5, -0.91, 0.26], # Neuron 2
    [-0.26, -0.27, 0.17] # Neuron 3
]

biases = [2.0, 0.5, -0.1]

outputs = []
for w_list, b in zip(weights_matrix, biases):
    z = sum(i * w for i, w in zip(inputs, w_list)) + b
    a = max(0.0, z)
    outputs.append(round(a, 4))

print("Layer Output Activations (ReLU):", outputs)
`,
    expectedOutput: 'Layer Output Activations (ReLU): [0.9, 2.225, 0.]',
  },
  {
    id: 'py-04',
    title: '4. Loss Functions & Measuring Error',
    shortDesc: 'Calculate Mean Squared Error (MSE) and Cross-Entropy loss.',
    durationMinutes: 25,
    level: 'Intermediate',
    topics: ['Loss Functions', 'MSE', 'Cross-Entropy'],
    contentMarkdown: `### Quantifying Prediction Error

Before a model can learn, it needs a signal indicating how wrong its current prediction is.

$$MSE = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$`,
    initialCode: `# Lesson 4: Mean Squared Error Loss
y_true = [1.0, 0.0, 1.0, 1.0]
y_pred = [0.9, 0.2, 0.8, 0.95]

errors = [(y - hat)**2 for y, hat in zip(y_true, y_pred)]
mse = sum(errors) / len(y_true)

print("Actual Targets:   ", y_true)
print("Model Predictions:", y_pred)
print(f"Mean Squared Error (MSE): {mse:.6f}")
`,
    expectedOutput: 'Mean Squared Error (MSE): 0.023125',
  },
  {
    id: 'py-05',
    title: '5. Gradient Descent Step-by-Step',
    shortDesc: 'Iteratively update weights to minimize loss using numerical gradients.',
    durationMinutes: 35,
    level: 'Intermediate',
    topics: ['Gradient Descent', 'Optimization', 'Learning Rate'],
    contentMarkdown: `### Optimization via Gradient Descent

Gradient descent moves weights in the direction of steepest loss decrease:

$$w_{new} = w_{old} - \\alpha \\cdot \\frac{\\partial L}{\\partial w}$$`,
    initialCode: `# Lesson 5: Simple Gradient Descent Loop
x = 2.0
target = 10.0
w = 0.0
learning_rate = 0.05

for epoch in range(1, 21):
    pred = w * x
    loss = (pred - target) ** 2
    grad = 2 * (pred - target) * x
    w = w - learning_rate * grad

print(f"Optimal Weight found: {w:.4f} (Target: {target/x})")
`,
    expectedOutput: 'Optimal Weight found: 5.0000',
  },
];

export const JAVASCRIPT_LESSONS: Lesson[] = [
  {
    id: 'js-01',
    title: '1. Modern JavaScript for AI & Async Streams',
    shortDesc: 'Master promises, async/await, and array vector transformations in JS.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['JavaScript', 'Async', 'Vectors'],
    contentMarkdown: `### In-Browser AI Workflows

JavaScript powers interactive client-side AI apps and browser inferencing via WebGL and WebGPU.`,
    initialCode: `// Modern JS Vector Operations
const vectorA = [1.5, 3.0, -2.0, 4.5];
const vectorB = [2.0, -1.0, 0.5, 2.0];

const dotProduct = vectorA.reduce((acc, val, idx) => acc + val * vectorB[idx], 0);
console.log("Vector A:", vectorA);
console.log("Vector B:", vectorB);
console.log("Dot Product:", dotProduct.toFixed(2));
`,
    expectedOutput: 'Dot Product: 8.00',
  },
  {
    id: 'js-02',
    title: '2. Tensor Operations in TensorFlow.js',
    shortDesc: 'Create 1D, 2D, and 3D tensors and perform matrix transformations.',
    durationMinutes: 25,
    level: 'Intermediate',
    topics: ['Tensors', 'TensorFlow.js', 'Matrices'],
    contentMarkdown: `### Tensors in the Browser

Tensors are multi-dimensional arrays optimized for GPU acceleration.`,
    initialCode: `// Simulated Tensor 2D Matrix Multiplication in JS
const matrixA = [
  [1, 2],
  [3, 4]
];
const matrixB = [
  [5, 6],
  [7, 8]
];

function matMul(a, b) {
  return a.map(row => 
    [0, 1].map(colIdx => 
      row.reduce((sum, val, i) => sum + val * b[i][colIdx], 0)
    )
  );
}

console.log("Matrix A x B:", matMul(matrixA, matrixB));
`,
  },
];

export const HTML_CSS_LESSONS: Lesson[] = [
  {
    id: 'web-01',
    title: '1. Modern CSS Layouts & Glassmorphism',
    shortDesc: 'Design glassmorphic dark-mode dashboards with CSS Grid & Flexbox.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['CSS', 'Grid', 'Flexbox', 'Design'],
    contentMarkdown: `### Modern Glassmorphism Styling

Build sleek AI software interfaces using backdrop blur filters and border gradients.`,
    initialCode: `/* CSS Glassmorphism Snippet */
.glass-card {
  background: rgba(18, 23, 41, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(124, 92, 252, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  border-radius: 16px;
  padding: 24px;
}
console.log("CSS Glassmorphism template loaded successfully!");
`,
  },
];

export const CPP_LESSONS: Lesson[] = [
  {
    id: 'cpp-01',
    title: '1. Pointers, Memory Layout & SIMD Speedups',
    shortDesc: 'Understand raw memory pointers, cache lines, and SIMD vector instructions.',
    durationMinutes: 25,
    level: 'Advanced',
    topics: ['C++', 'Pointers', 'SIMD', 'Memory'],
    contentMarkdown: `### Bare-Metal High Performance

C++ allows manual memory allocation and direct cache management required by CUDA kernels.`,
    initialCode: `// C++ Vector Sum Concept
#include <iostream>
#include <vector>

int main() {
    std::vector<float> vec = {1.2f, 3.4f, 5.6f};
    float sum = 0.0f;
    for (float v : vec) sum += v;
    std::cout << "Vector Sum: " << sum << std::endl;
    return 0;
}
`,
  },
];

export const ML_LESSONS: Lesson[] = [
  {
    id: 'ml-01',
    title: '1. Linear Regression & Ordinary Least Squares',
    shortDesc: 'Fit optimal decision lines to continuous data points mathematically.',
    durationMinutes: 25,
    level: 'Beginner',
    topics: ['Linear Regression', 'Math', 'OLS'],
    contentMarkdown: `### Supervised Learning Foundations

Linear regression models the relationship between dependent target $y$ and features $X$.`,
    initialCode: `# Linear Regression Slope Fit
X = [1, 2, 3, 4, 5]
Y = [2, 4, 5, 4, 5]

mean_x = sum(X) / len(X)
mean_y = sum(Y) / len(Y)

num = sum((x - mean_x) * (y - mean_y) for x, y in zip(X, Y))
den = sum((x - mean_x)**2 for x in X)

slope = num / den
intercept = mean_y - slope * mean_x

print(f"Fitted Equation: Y = {slope:.2f} * X + {intercept:.2f}")
`,
  },
];

export const DL_LESSONS: Lesson[] = [
  {
    id: 'dl-01',
    title: '1. Convolutional Filters & Edge Detection',
    shortDesc: 'Slide kernel matrices across 2D images to extract spatial feature maps.',
    durationMinutes: 30,
    level: 'Intermediate',
    topics: ['CNN', 'Convolutions', 'Computer Vision'],
    contentMarkdown: `### Convolutional Neural Networks

Convolutions preserve spatial relationships between neighboring pixels.`,
    initialCode: `# 2D Convolution Kernel Step
image_grid = [
  [0, 100, 100],
  [0, 100, 100],
  [0, 100, 100]
]

sobel_vertical = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]
]

# Compute single kernel output
conv_val = sum(image_grid[r][c] * sobel_vertical[r][c] for r in range(3) for c in range(3))
print("Detected Vertical Edge Intensity:", conv_val)
`,
  },
];

export const NEURAL_NETS_LESSONS: Lesson[] = [
  {
    id: 'nn-01',
    title: '1. Anatomy of an Artificial Neuron',
    shortDesc: 'Inputs, weights, bias, activation, and biological parallels.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Neuron', 'Synapses', 'Activations'],
    contentMarkdown: `### Artificial vs Biological Neurons

An artificial neuron imitates the dendrite-soma-axon signal fire mechanism of biological brain cells.`,
    initialCode: `# Single Artificial Neuron
inputs = [0.5, 0.9, 0.1]
weights = [0.8, -0.4, 0.2]
bias = 0.1

z = sum(i * w for i, w in zip(inputs, weights)) + bias
activation = 1 / (1 + 2.71828 ** (-z))

print(f"Z (Weighted Sum): {z:.4f}")
print(f"Activation (Sigmoid): {activation:.4f}")
`,
  },
];

export const PYTHON_CORE_LESSONS: Lesson[] = [
  {
    id: 'pycore-01',
    title: '1. Standard Python Syntax & Variables',
    shortDesc: 'Learn Python variable declarations, primitive types (str, int, float, bool), and formatting.',
    durationMinutes: 15,
    level: 'Beginner',
    topics: ['Python', 'Variables', 'Basics'],
    contentMarkdown: `### Welcome to Core Python 3

Python is an interpreted, high-level, dynamically typed programming language famous for clean syntax and readability.

#### Variables & Basic Types

In Python, you do not declare variable types explicitly:

\`\`\`python
name = "Alex"          # str
age = 24               # int
gpa = 3.85             # float
is_enrolled = True     # bool

print(f"Student {name} (Age {age}) has GPA {gpa}")
\`\`\`

#### Strings & F-String Formatting

Use f-strings (\`f"..."\`) for concise string interpolation.`,
    initialCode: `# Lesson 1: Standard Python Variables
name = "Student"
course = "Standard Python Programming"
lessons_completed = 5
total_lessons = 12

completion_rate = (lessons_completed / total_lessons) * 100

print(f"Welcome to {course}, {name}!")
print(f"Progress: {lessons_completed}/{total_lessons} lessons ({completion_rate:.1f}%)")
`,
    expectedOutput: 'Progress: 5/12 lessons (41.7%)',
  },
  {
    id: 'pycore-02',
    title: '2. Control Flow: Conditionals & Loops',
    shortDesc: 'Master if/elif/else decisions, for loops, while loops, and list iterations.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Conditionals', 'For Loops', 'While Loops'],
    contentMarkdown: `### Control Flow in Python

#### Conditional Statements (\`if\`, \`elif\`, \`else\`)

Python uses indentation (4 spaces) to define code blocks:

\`\`\`python
score = 85

if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
else:
    grade = 'C'
\`\`\`

#### Loops (\`for\` and \`while\`)

Iterate over sequences with \`for x in range(...)\` or \`while\` loops.`,
    initialCode: `# Lesson 2: Control Flow & Loops
numbers = [12, 45, 68, 23, 89, 90, 34]
even_numbers = []
odd_numbers = []

for num in numbers:
    if num % 2 == 0:
        even_numbers.append(num)
    else:
        odd_numbers.append(num)

print("Original Numbers:", numbers)
print("Even Numbers:    ", even_numbers)
print("Odd Numbers:     ", odd_numbers)
`,
    expectedOutput: 'Even Numbers:     [12, 68, 90, 34]',
  },
  {
    id: 'pycore-03',
    title: '3. Data Structures: Lists, Tuples & Dictionaries',
    shortDesc: 'Store and manipulate collections using Python list methods, tuples, and key-value dicts.',
    durationMinutes: 25,
    level: 'Beginner',
    topics: ['Lists', 'Dictionaries', 'Data Structures'],
    contentMarkdown: `### Python Data Structures

- **List** (\`[1, 2, 3]\`): Mutable ordered collection
- **Tuple** (\`(1, 2)\`): Immutable ordered pair
- **Dictionary** (\`{"key": "value"}\`): Key-value hash map lookup

#### Dictionary Lookup Example
\`\`\`python
student = {
    "id": 101,
    "name": "Sarah",
    "skills": ["Python", "SQL", "Git"]
}
\`\`\``,
    initialCode: `# Lesson 3: Dictionary & List Comprehensions
grades = {"Alice": 92, "Bob": 78, "Charlie": 95, "Diana": 88}

# Filter students with grade >= 85
top_students = {name: score for name, score in grades.items() if score >= 85}

print("All Grades:    ", grades)
print("Top Performers:", top_students)
`,
    expectedOutput: "Top Performers: {'Alice': 92, 'Charlie': 95, 'Diana': 88}",
  },
  {
    id: 'pycore-04',
    title: '4. Functions, Modular Design & Lambdas',
    shortDesc: 'Write reusable functions with parameters, default arguments, return values, and lambdas.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Functions', 'Arguments', 'Lambdas'],
    contentMarkdown: `### Reusable Python Functions

Functions are defined with \`def\` and return values using \`return\`:

\`\`\`python
def calculate_area(length: float, width: float = 1.0) -> float:
    return length * width
\`\`\``,
    initialCode: `# Lesson 4: Defining Functions & Helper Utilities
def compute_stats(numbers):
    total = sum(numbers)
    count = len(numbers)
    mean = total / count if count > 0 else 0
    return {"total": total, "count": count, "mean": mean}

data = [10, 20, 30, 40, 50]
stats = compute_stats(data)

print("Data Set:", data)
print(f"Total: {stats['total']}, Mean: {stats['mean']:.2f}")
`,
    expectedOutput: 'Total: 150, Mean: 30.00',
  },
  {
    id: 'pycore-05',
    title: '5. Object-Oriented Programming (OOP Classes)',
    shortDesc: 'Understand class definitions, __init__ constructor, instance attributes, methods, and inheritance.',
    durationMinutes: 30,
    level: 'Intermediate',
    topics: ['OOP', 'Classes', 'Inheritance'],
    contentMarkdown: `### Object-Oriented Programming (OOP)

Classes bundle data (attributes) and behavior (methods) together into blueprints.

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance
\`\`\``,
    initialCode: `# Lesson 5: Python OOP Classes
class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.courses = []

    def enroll(self, course_name):
        self.courses.append(course_name)
        return f"{self.name} enrolled in {course_name}"

student_1 = Student("Maya", "S-2026")
print(student_1.enroll("Standard Python"))
print(student_1.enroll("Algorithms 101"))
print(f"{student_1.name}'s Courses: {student_1.courses}")
`,
    expectedOutput: "Maya's Courses: ['Standard Python', 'Algorithms 101']",
  },
  {
    id: 'pycore-06',
    title: '6. Error Handling & File I/O',
    shortDesc: 'Gracefully catch exceptions using try/except blocks and manage files safely with context managers.',
    durationMinutes: 25,
    level: 'Intermediate',
    topics: ['Exceptions', 'Try/Except', 'File I/O'],
    contentMarkdown: `### Exception Handling & File I/O

#### Exception Handling with \`try\` / \`except\`

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("Cannot divide by zero:", e)
\`\`\`

#### Safe Context Managers (\`with open(...)\`)

Context managers automatically close file resources when done.`,
    initialCode: `# Lesson 6: Exception Handling Simulation
def safe_divide(a, b):
    try:
        res = a / b
        return f"Success: {a} / {b} = {res:.2f}"
    except ZeroDivisionError:
        return "Error: Division by zero is undefined!"
    except TypeError:
        return "Error: Both arguments must be numbers!"

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "two"))
`,
    expectedOutput: 'Error: Both arguments must be numbers!',
  },
];

export const AI_FUNDAMENTALS_LESSONS: Lesson[] = [
  {
    id: 'aifund-01',
    title: '1. What is an LLM & Tokens Explained',
    shortDesc: 'Demystify Large Language Models, how prompts turn into tokens (~0.75 words), and context windows.',
    durationMinutes: 15,
    level: 'Beginner',
    topics: ['AI Basics', 'LLM', 'Tokens', 'Context Window'],
    contentMarkdown: `### What is a Large Language Model (LLM)?

A **Large Language Model (LLM)** is a statistical pattern-matching neural network trained on billions of text pages to predict the **most likely next token**.

#### What is a Token?
- AI models do not read raw words; they process **Tokens** (sub-word fragments).
- **1 Token ≈ 4 characters** or **~0.75 English words**.
- Example: The sentence \`"Artificial Intelligence is amazing!"\` is split into tokens like: \`["Artifi", "cial", " Intel", "ligence", " is", " amaz", "ing", "!"]\`.

#### Context Window
The **Context Window** is the maximum total token memory capacity (input prompt + output completion) an LLM can hold at once.
- **8,000 tokens** ≈ ~6,000 words (~12 pages)
- **128,000 tokens** ≈ ~96,000 words (a full book!)
- **1,000,000+ tokens** ≈ ~750,000 words (an entire code repository!)`,
    initialCode: `# Lesson 1: Token Estimator & Context Window Simulator
def estimate_tokens(text_input):
    character_count = len(text_input)
    word_count = len(text_input.split())
    # Standard heuristic: ~4 characters per token or ~1.33 tokens per word
    estimated_tokens = max(1, int(character_count / 4))
    return {
        "words": word_count,
        "chars": character_count,
        "est_tokens": estimated_tokens
    }

prompt = "Large language models predict the next token based on learned probability distribution."
res = estimate_tokens(prompt)

print("Prompt Analysis:")
print(f"Words: {res['words']} | Characters: {res['chars']}")
print(f"Estimated Tokens: {res['est_tokens']}")
print(f"Context Window Used (out of 128,000): {(res['est_tokens']/128000)*100:.4f}%")
`,
    expectedOutput: 'Estimated Tokens: 22',
  },
  {
    id: 'aifund-02',
    title: '2. Parameter Count & Model Scale (7B - 405B)',
    shortDesc: 'Understand weights/parameters, model sizes (7B, 70B, 405B), and quantization (FP16, INT8, INT4).',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Parameters', '7B', '70B', 'Quantization', 'VRAM'],
    contentMarkdown: `### What is a Model Parameter?

A **Parameter** (or weight) is an adjustable numerical value inside an AI model's neural network learned during training.

#### Common Model Sizes:
- **7B (7 Billion parameters)**: Fast, lightweight, runs locally on a laptop/phone GPU (4GB - 8GB VRAM). Great for basic tasks & classification.
- **70B (70 Billion parameters)**: Highly capable enterprise model. Requires multi-GPU servers (40GB - 80GB VRAM). High reasoning capability.
- **405B+ (400B+ parameters)**: Frontier giant models. Requires server clusters. State-of-the-art coding, math, and multi-step logic.

#### Quantization
**Quantization** reduces model precision (e.g., from 16-bit float FP16 down to 8-bit INT8 or 4-bit INT4) to save 50-75% GPU memory with minimal quality loss!`,
    initialCode: `# Lesson 2: GPU VRAM Memory Requirement Calculator
def calculate_model_vram(params_in_billions, precision_bits=16):
    # Base VRAM = (Parameters in Billions * (precision_bits / 8)) GB
    base_vram = params_in_billions * (precision_bits / 8)
    # Add ~20% overhead for context activation KV cache
    recommended_vram = base_vram * 1.2
    return round(base_vram, 2), round(recommended_vram, 2)

models = [
    ("Llama-3 8B (FP16)", 8, 16),
    ("Llama-3 8B (4-bit INT4)", 8, 4),
    ("Llama-3 70B (8-bit INT8)", 70, 8),
    ("Frontier 405B (FP16)", 405, 16)
]

print("Model Scale & VRAM Requirements:")
for name, params, bits in models:
    base, rec = calculate_model_vram(params, bits)
    print(f"{name:25} -> Base VRAM: {base:6.1f} GB | Rec. VRAM: {rec:6.1f} GB")
`,
    expectedOutput: 'Llama-3 8B (4-bit INT4)   -> Base VRAM:    4.0 GB | Rec. VRAM:    4.8 GB',
  },
  {
    id: 'aifund-03',
    title: '3. Temperature, Top-P & Sampling Controls',
    shortDesc: 'Control randomness & creativity using Temperature (0.0 to 1.0), Top-P (Nucleus), and Top-K.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Temperature', 'Top-P', 'Top-K', 'Sampling', 'Creativity'],
    contentMarkdown: `### How Temperature & Top-P Control Output

LLMs do not pick words at random; they generate a probability list for candidate next tokens. Sampling controls determine how that choice is made!

#### 1. Temperature ($T$)
- **$T = 0.0$ (Greedy Sampling)**: Always picks the #1 highest-probability token. 100% deterministic, perfect for math, coding, and factual extraction.
- **$T = 0.7$ (Balanced)**: Adds moderate randomness. Great for natural conversation and general writing.
- **$T = 1.0+$ (Creative / Unpredictable)**: Flattens probabilities so rare tokens get selected. Used for poetry, brainstorming, or fiction.

#### 2. Top-P (Nucleus Sampling)
Filters candidate tokens by cumulative probability percentage. E.g., \`Top-P = 0.9\` considers only the top candidate tokens whose combined probability equals 90%, cutting off unlikely tail words.`,
    initialCode: `# Lesson 3: Temperature Softmax Probability Simulator
import math

def softmax_with_temperature(logits, temperature=1.0):
    if temperature <= 0.001: # Greedy choice
        max_idx = logits.index(max(logits))
        return [1.0 if i == max_idx else 0.0 for i in range(len(logits))]
    
    # Scale logits by temperature T
    scaled_logits = [l / temperature for l in logits]
    exp_logits = [math.exp(l) for l in scaled_logits]
    sum_exp = sum(exp_logits)
    return [round(e / sum_exp, 4) for e in exp_logits]

candidate_tokens = ["Code", "Program", "Script", "Banana"]
raw_logits = [4.0, 3.2, 2.5, -1.0]

print("Candidate Tokens:", candidate_tokens)
print("Low Temp (T = 0.1, Coding):    ", softmax_with_temperature(raw_logits, 0.1))
print("Med Temp (T = 0.7, Balanced):  ", softmax_with_temperature(raw_logits, 0.7))
print("High Temp (T = 1.5, Creative): ", softmax_with_temperature(raw_logits, 1.5))
`,
    expectedOutput: 'Low Temp (T = 0.1, Coding):     [1.0, 0.0, 0.0, 0.0]',
  },
  {
    id: 'aifund-04',
    title: '4. Hallucination, Grounding & System Instructions',
    shortDesc: 'Why AI hallucinates facts, how grounding prevents false answers, and system prompt guardrails.',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Hallucination', 'Grounding', 'System Prompt', 'Factuality'],
    contentMarkdown: `### Why Do AI Models Hallucinate?

**Hallucination** occurs when an AI model confidently generates false, unverified, or fabricated information.

#### Why does it happen?
1. **Next-Token Prediction**: The model calculates statistical plausibility, NOT factual database truth.
2. **Missing Knowledge**: If the prompt asks about private or recent data not in training weights, the model fills in gaps plausibly.

#### How to Prevent Hallucinations:
- **Grounding**: Providing reliable reference documents inside the prompt.
- **Low Temperature ($T \le 0.2$)**: Forces strict top predictions.
- **System Instructions**: Adding guardrails like *"If you are uncertain or the information is not in the provided text, respond with 'I do not have enough information'."*`,
    initialCode: `# Lesson 4: Grounding Guardrail Simulator
def AI_Response_Generator(user_query, context_documents=None, allow_hallucination=False):
    system_guardrail = "Answer ONLY using facts provided in context_documents. If unknown, say 'UNGROUNDED'."
    
    known_facts = {
        "learnstack version": "LearnStack 2.0 released in 2026.",
        "python core": "Standard Python 3 track covers loops, classes, and file I/O."
    }
    
    query_lower = user_query.lower()
    
    # Check grounding
    found_fact = None
    for key, fact in known_facts.items():
        if key in query_lower:
            found_fact = fact
            break
            
    if found_fact:
        return f"[Grounded Result]: {found_fact}"
    elif not allow_hallucination:
        return "[Guardrail Triggered]: Information not found in grounded context. Refusing ungrounded guess."
    else:
        return "[Hallucinated Guess]: LearnStack was invented in 1842 by Charles Babbage!"

print("Query 1:", AI_Response_Generator("Tell me about Python Core"))
print("Query 2 (Grounded Guardrail):", AI_Response_Generator("Who won the 2028 World Cup?", allow_hallucination=False))
print("Query 3 (Unguarded Model):   ", AI_Response_Generator("Who won the 2028 World Cup?", allow_hallucination=True))
`,
    expectedOutput: '[Guardrail Triggered]: Information not found in grounded context.',
  },
  {
    id: 'aifund-05',
    title: '5. RAG (Retrieval-Augmented Generation) & Vectors',
    shortDesc: 'Connect LLMs to custom private data using text embeddings, vector databases, and similarity search.',
    durationMinutes: 25,
    level: 'Beginner',
    topics: ['RAG', 'Embeddings', 'Vector Search', 'Cosine Distance'],
    contentMarkdown: `### What is RAG (Retrieval-Augmented Generation)?

**RAG** connects an LLM to external databases or private company documents without needing expensive re-training!

#### The 3 Steps of RAG:
1. **Chunking & Embedding**: Documents are broken into small text chunks and converted into numerical vector arrays (**Embeddings**).
2. **Vector Retrieval**: When a user asks a question, a **Vector Database** calculates mathematical similarity (e.g. Cosine Similarity) to retrieve the top 3 most relevant document chunks.
3. **Augmented Prompting**: The retrieved chunks are injected into the prompt as context before passing to the LLM.`,
    initialCode: `# Lesson 5: Simplified Vector Similarity & RAG Pipeline
import math

def cosine_similarity(vec1, vec2):
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    return dot_product / (norm1 * norm2) if (norm1 * norm2) > 0 else 0

# Mock Vector Embeddings (Topic Dimensions: [Python, Web, AI])
query_vector = [0.9, 0.1, 0.8] # Query: "How to run Python AI models"

knowledge_base = [
    {"title": "Doc A: Python Loops & Conditionals", "vector": [0.85, 0.2, 0.1]},
    {"title": "Doc B: HTML & CSS Responsive Layouts", "vector": [0.05, 0.95, 0.1]},
    {"title": "Doc C: Building Neural Nets in PyTorch", "vector": [0.8, 0.1, 0.9]},
]

print("Vector Similarity Search (RAG Retrieval):")
for doc in knowledge_base:
    sim = cosine_similarity(query_vector, doc["vector"])
    doc["similarity"] = sim
    print(f"{doc['title']} -> Similarity Score: {sim:.4f}")

top_doc = max(knowledge_base, key=lambda x: x["similarity"])
print(f"\n[Retrieved Context for LLM]: {top_doc['title']}")
`,
    expectedOutput: 'Doc C: Building Neural Nets in PyTorch -> Similarity Score: 0.9982',
  },
  {
    id: 'aifund-06',
    title: '6. Fine-Tuning, LoRA & Prompt Engineering',
    shortDesc: 'Learn when to use Zero-Shot, Few-Shot, Chain-of-Thought prompting vs Fine-Tuning (LoRA).',
    durationMinutes: 20,
    level: 'Beginner',
    topics: ['Prompt Engineering', 'Zero-Shot', 'Few-Shot', 'CoT', 'Fine-Tuning', 'LoRA'],
    contentMarkdown: `### Prompting vs Fine-Tuning

#### Prompt Engineering Techniques:
- **Zero-Shot**: Asking the model directly without examples (\`"Translate 'Hello' to Spanish"\`).
- **Few-Shot**: Providing 2-3 input/output examples inside the prompt to guide formatting.
- **Chain-of-Thought (CoT)**: Instructing the model to *"Think step-by-step before outputting the final answer"*, dramatically improving math and logical reasoning scores!

#### Fine-Tuning & LoRA
- **Fine-Tuning**: Modifying internal model weights on a targeted domain dataset.
- **LoRA (Low-Rank Adaptation)**: Efficient fine-tuning that freeze the original model weights and trains a tiny 1% adapter layer, drastically cutting training costs!`,
    initialCode: `# Lesson 6: Chain-of-Thought (CoT) Prompting Logic Simulator
def evaluate_math_prompt(prompt_type, problem_text):
    if prompt_type == "standard":
        return f"Prompt: {problem_text}\nDirect AI Output: 42 (Uncertain guess without steps)"
    elif prompt_type == "chain_of_thought":
        reasoning_steps = [
            "Step 1: Identify given quantities (A = 15, B = 3x A).",
            "Step 2: Calculate B = 3 * 15 = 45.",
            "Step 3: Subtract initial offset of 5 -> 45 - 5 = 40.",
            "Final Answer: 40"
        ]
        return f"Prompt: {problem_text} [Let's think step by step]\n" + "\n".join(reasoning_steps)

problem = "A store has 15 apples. B has 3 times more, then sells 5. How many are left?"
print("--- Standard Prompting ---")
print(evaluate_math_prompt("standard", problem))

print("\n--- Chain-of-Thought (CoT) Prompting ---")
print(evaluate_math_prompt("chain_of_thought", problem))
`,
    expectedOutput: 'Final Answer: 40',
  },
];

export const LESSONS_BY_TRACK: Record<string, Lesson[]> = {
  'ai-fundamentals': AI_FUNDAMENTALS_LESSONS,
  'python-core': PYTHON_CORE_LESSONS,
  'python': PYTHON_LESSONS,
  'javascript': JAVASCRIPT_LESSONS,
  'html-css': HTML_CSS_LESSONS,
  'java': [
    {
      id: 'java-01',
      title: '1. Java OOP & Class Hierarchy',
      shortDesc: 'Classes, inheritance, and interface contracts in Java.',
      durationMinutes: 20,
      level: 'Beginner',
      topics: ['Java', 'OOP', 'Classes'],
      contentMarkdown: '### Java Object-Oriented Design\n\nBuild structured, strongly-typed codebases with encapsulation and interfaces.',
      initialCode: `public class Neuron {\n    private double weight = 0.8;\n    private double bias = 0.2;\n    public double activate(double input) {\n        return input * weight + bias;\n    }\n}\nSystem.out.println("Java Neuron Class Compiled!");`,
    },
  ],
  'cpp': CPP_LESSONS,
  'ml': ML_LESSONS,
  'dl': DL_LESSONS,
  'neural-nets': NEURAL_NETS_LESSONS,
};
