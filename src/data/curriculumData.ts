import { TopicInfo, Lesson, CodeTemplate } from '../types';

export const TOPICS: TopicInfo[] = [
  {
    id: 'python',
    name: 'Python for AI',
    tagline: 'The universal language of machine learning & data science',
    isLive: true,
    iconName: 'Code2',
    description: 'Master Python fundamentals, NumPy vectorization, OOP for neural net layers, and building custom model architectures from scratch.',
    estimatedHours: 12,
    level: 'Beginner',
    upcomingModules: [
      'Python Syntax & Data Types',
      'NumPy Matrix & Tensor Operations',
      'Building Neural Layers from Scratch',
      'Gradient Descent & Backprop',
      'Loss Functions & Evaluation Metrics'
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript & Node',
    tagline: 'In-browser AI & full-stack web applications',
    isLive: false,
    iconName: 'Terminal',
    description: 'Learn async workflows, Tensor.js in the browser, and serving ML models over REST & WebSockets.',
    estimatedHours: 10,
    level: 'Intermediate',
    upcomingModules: [
      'Modern JS Async & Event Loops',
      'Browser Canvas & WebGL Shaders',
      'TensorFlow.js Fundamentals',
      'Deploying AI Microservices with Express'
    ]
  },
  {
    id: 'cpp',
    name: 'C++ Systems',
    tagline: 'High-performance computing & GPU memory allocation',
    isLive: false,
    iconName: 'Cpu',
    description: 'Understand low-level memory management, CUDA GPU kernels, and bare-metal performance optimization for deep learning inferencing.',
    estimatedHours: 18,
    level: 'Advanced',
    upcomingModules: [
      'Pointers, References & Memory Layout',
      'SIMD Vectorization & Cache Locality',
      'Writing Custom CUDA Kernels',
      'C++ Engine Integration with PyTorch C++ API'
    ]
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    tagline: 'Supervised & unsupervised algorithms intuition',
    isLive: false,
    iconName: 'BrainCircuit',
    description: 'Linear regression, decision trees, random forests, clustering, and feature engineering fundamentals.',
    estimatedHours: 15,
    level: 'Beginner',
    upcomingModules: [
      'Supervised vs Unsupervised Learning',
      'Gradient Descent Math & Optimization',
      'Decision Trees & Ensemble Methods',
      'Cross-Validation & Hyperparameter Tuning'
    ]
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    tagline: 'Multi-layer perceptrons, CNNs & Transformers',
    isLive: false,
    iconName: 'Layers',
    description: 'Deep network architectures, activation functions, convolutional filters for computer vision, and self-attention mechanisms.',
    estimatedHours: 20,
    level: 'Intermediate',
    upcomingModules: [
      'Multi-layer Perceptrons (MLP)',
      'Convolutional Neural Networks (CNN)',
      'Recurrent Networks & Transformers',
      'Regularization: Dropout & Batch Norm'
    ]
  },
  {
    id: 'neural-nets',
    name: 'Neural Networks',
    tagline: 'Intuitive mechanics of artificial neurons & loss optimization',
    isLive: false,
    iconName: 'Network',
    description: 'Mathematical intuition behind artificial neurons, feedforward passes, weight initialization, and backpropagation step-by-step.',
    estimatedHours: 14,
    level: 'Intermediate',
    upcomingModules: [
      'Anatomy of a Single Neuron',
      'Forward Propagation Matrix Math',
      'Loss Functions: MSE vs Cross-Entropy',
      'The Chain Rule & Backprop Intuition'
    ]
  }
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

Instead of using nested \`for\` loops (which are $O(N^3)$ and slow), we use vectorized dot products:

\`\`\`python
# Single Artificial Neuron Forward Pass
inputs = [1.2, 0.8, -0.5]
weights = [0.2, 0.8, -0.5]
bias = 2.0

# Weighted sum calculation
output = sum([i * w for i, w in zip(inputs, weights)]) + bias
print(f"Neuron Output: {output:.4f}")
\`\`\`

#### Interactive Goal
Run the code snippet in the playground below to observe how changing bias values shifts the activation threshold!`,
    initialCode: `# Lesson 1: Artificial Neuron Activation
inputs = [1.2, 0.8, -0.5]
weights = [0.2, 0.8, -0.5]
bias = 2.0

# Calculate weighted sum
weighted_sum = sum(i * w for i, w in zip(inputs, weights)) + bias

print("Inputs:", inputs)
print("Weights:", weights)
print("Bias:", bias)
print("Calculated Neuron Output:", round(weighted_sum, 4))
`,
    expectedOutput: "Calculated Neuron Output: 3.13"
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
   Squeezes values between $-1$ and $1$, zero-centered.

\`\`\`python
import math

def relu(x):
    return max(0, x)

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

print("ReLU(-2.5) =", relu(-2.5))
print("Sigmoid(0.0) =", sigmoid(0.0))
\`\`\``,
    initialCode: `# Lesson 2: Implementing Activation Functions
import math

def relu(x):
    return max(0.0, float(x))

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def tanh(x):
    return math.tanh(x)

# Test inputs
test_values = [-3.0, -1.0, 0.0, 1.5, 4.0]

print("Input \\t ReLU \\t Sigmoid \\t Tanh")
print("-" * 40)
for val in test_values:
    r = relu(val)
    s = sigmoid(val)
    t = tanh(val)
    print(f"{val:4.1f} \\t {r:4.2f} \\t {s:6.4f} \\t {t:6.4f}")
`,
    expectedOutput: "Sigmoid(0.0) = 0.5000"
  },
  {
    id: 'py-03',
    title: '3. Building a Multi-Layer Feedforward Pass',
    shortDesc: 'Connect multiple neurons into dense layers and propagate signals forward.',
    durationMinutes: 30,
    level: 'Intermediate',
    topics: ['Dense Layer', 'Feedforward', 'Matrices'],
    contentMarkdown: `### Multi-Neuron Layers

A dense (fully-connected) layer contains $N$ neurons, where each neuron receives inputs from all $M$ nodes in the preceding layer.

\`\`\`python
# Layer with 3 inputs and 2 neurons
inputs = [1.0, 2.0, 3.0]

# Weights matrix: shape (2, 3) -> 2 neurons, 3 inputs each
weights = [
    [0.2, 0.8, -0.5],  # Neuron 1
    [0.5, -0.91, 0.26] # Neuron 2
]

biases = [2.0, 0.5]

# Layer output calculation
layer_outputs = []
for neuron_weights, neuron_bias in zip(weights, biases):
    neuron_output = sum(i * w for i, w in zip(inputs, neuron_weights)) + neuron_bias
    layer_outputs.append(neuron_output)

print("Layer Outputs:", layer_outputs)
\`\`\``,
    initialCode: `# Lesson 3: Dense Layer Forward Pass
inputs = [1.5, -0.5, 2.0]

# 3 Neurons, each receiving 3 inputs
weights_matrix = [
    [0.2, 0.8, -0.5],   # Neuron 1 weights
    [0.5, -0.91, 0.26], # Neuron 2 weights
    [-0.26, -0.27, 0.17] # Neuron 3 weights
]

biases = [2.0, 0.5, -0.1]

# Forward pass
outputs = []
for w_list, b in zip(weights_matrix, biases):
    z = sum(i * w for i, w in zip(inputs, w_list)) + b
    # Apply ReLU activation
    a = max(0.0, z)
    outputs.append(round(a, 4))

print("Layer Output Activations (ReLU):", outputs)
`,
    expectedOutput: "Layer Output Activations (ReLU): [0.9, 2.225, 0.]"
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

#### 1. Mean Squared Error (MSE)
Used primarily for **regression tasks** (predicting continuous numbers):

$$MSE = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$

#### 2. Binary Cross-Entropy (BCE)
Used for **binary classification tasks** (0 or 1 prediction):

$$BCE = - \\frac{1}{N} \\sum_{i=1}^N \\left[ y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i) \\right]$$`,
    initialCode: `# Lesson 4: Mean Squared Error Loss
import math

y_true = [1.0, 0.0, 1.0, 1.0]
y_pred = [0.9, 0.2, 0.8, 0.95]

# Calculate MSE
errors = [(y - hat)**2 for y, hat in zip(y_true, y_pred)]
mse = sum(errors) / len(y_true)

print("Actual Targets:   ", y_true)
print("Model Predictions:", y_pred)
print(f"Mean Squared Error (MSE): {mse:.6f}")
`,
    expectedOutput: "Mean Squared Error (MSE): 0.023125"
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

$$w_{new} = w_{old} - \\alpha \\cdot \\frac{\\partial L}{\\partial w}$$

Where $\\alpha$ is the **Learning Rate**. If $\\alpha$ is too high, training oscillates; if too small, training is painfully slow.`,
    initialCode: `# Lesson 5: Simple Gradient Descent Loop
# Optimize weight to minimize loss L = (w * x - target)^2
x = 2.0
target = 10.0
w = 0.0  # Initial weight guess
learning_rate = 0.05
epochs = 20

print("Epoch \\t Weight \\t Prediction \\t Loss")
print("-" * 45)

for epoch in range(1, epochs + 1):
    pred = w * x
    loss = (pred - target) ** 2
    
    # Derivative dL/dw = 2 * (pred - target) * x
    grad = 2 * (pred - target) * x
    
    # Weight update
    w = w - learning_rate * grad
    
    if epoch % 4 == 0 or epoch == 1:
        print(f"{epoch:2d} \\t {w:6.3f} \\t {pred:8.3f} \\t {loss:8.4f}")

print("-" * 45)
print(f"Optimal Weight found: {w:.4f} (Target weight: {target/x})")
`,
    expectedOutput: "Optimal Weight found: 5.0000"
  }
];

export const PLAYGROUND_TEMPLATES: CodeTemplate[] = [
  {
    id: 'neuron-pass',
    name: 'Artificial Neuron Forward Pass',
    language: 'python',
    category: 'Neural Networks',
    code: `# Single Neuron Forward Pass with ReLU
inputs = [0.8, 2.5, -1.2]
weights = [0.4, -0.6, 0.9]
bias = 0.5

# Calculate linear sum Z = sum(w * x) + b
z = sum(w * x for w, x in zip(weights, inputs)) + bias

# Apply ReLU Activation: f(z) = max(0, z)
activation = max(0.0, z)

print("Linear Combination Z:", round(z, 4))
print("ReLU Activation Output:", round(activation, 4))
`
  },
  {
    id: 'quicksort-demo',
    name: 'QuickSort Algorithm in Python',
    language: 'python',
    category: 'Algorithms',
    code: `# QuickSort Implementation with pivot partitioning
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

sample_data = [42, 12, 88, 3, 27, 65, 9, 51]
print("Unsorted:", sample_data)
sorted_data = quicksort(sample_data)
print("Sorted:  ", sorted_data)
`
  },
  {
    id: 'js-array-filter',
    name: 'Vector Operations in JavaScript',
    language: 'javascript',
    category: 'JavaScript',
    code: `// High-performance vector operations in JavaScript
const vectorA = [1.5, 3.0, -2.0, 4.5];
const vectorB = [2.0, -1.0, 0.5, 2.0];

// Dot product
const dotProduct = vectorA.reduce((acc, val, idx) => acc + val * vectorB[idx], 0);

// Vector addition
const vectorSum = vectorA.map((val, idx) => val + vectorB[idx]);

console.log("Vector A:", vectorA);
console.log("Vector B:", vectorB);
console.log("Dot Product:", dotProduct.toFixed(2));
console.log("Vector Sum:", vectorSum);
`
  }
];

export const PRESET_CHAT_PROMPTS = [
  "Explain backpropagation in plain English",
  "What is the difference between supervised & unsupervised learning?",
  "How does matrix multiplication work in neural networks?",
  "Why do we need activation functions like ReLU?"
];
