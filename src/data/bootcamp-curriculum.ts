/**
 * 24-Week Bootcamp
 *
 * 3 career tracks, each with 6 phases (4 weeks per phase = 24 weeks total).
 * Every week has: topic, project deliverable, learning objectives.
 * No story lessons — bootcamp content is standalone.
 */

import type { TrackCurriculum } from './school-curriculum';

// ═══════════════════════════════════════════════════════════════
// TRACK 1: FULL-STACK DEVELOPMENT
// ═══════════════════════════════════════════════════════════════
export const fullStackTrack: TrackCurriculum = {
  id: 'fullstack',
  name: 'Full-Stack Development',
  tagline: 'From HTML to production apps in 24 weeks',
  icon: '🚀',
  color: 'violet',
  audience: 'Career changers, graduates, self-taught developers',
  prerequisite: 'Basic computer literacy, no coding experience required',
  capstoneProject: 'Deploy 2 production web apps with CI/CD and present a polished portfolio',
  terms: [
    {
      term: 1,
      title: 'Phase 1: Web Foundations',
      description: 'HTML, CSS, JavaScript fundamentals, Git, and responsive design.',
      weeks: [
        {
          week: 1, topic: 'HTML semantics — structure, forms, accessibility', slugs: [], levels: [],
          project: 'Personal bio page with semantic HTML and a contact form',
          objectives: ['Write valid semantic HTML5', 'Build accessible forms with labels and validation', 'Use browser dev tools to inspect the DOM'],
          newContent: true,
        },
        {
          week: 2, topic: 'CSS layout — Flexbox, Grid, responsive breakpoints', slugs: [], levels: [],
          project: 'Responsive landing page that works on mobile, tablet, and desktop',
          objectives: ['Use Flexbox for 1D layouts and Grid for 2D layouts', 'Write mobile-first CSS with media queries', 'Apply a consistent spacing and typography scale'],
          newContent: true,
        },
        {
          week: 3, topic: 'JavaScript essentials — variables, functions, DOM manipulation', slugs: [], levels: [],
          project: 'Interactive to-do list with add, delete, and local storage',
          objectives: ['Declare variables with let/const and write arrow functions', 'Select and manipulate DOM elements', 'Handle click, submit, and keyboard events'],
          newContent: true,
        },
        {
          week: 4, topic: 'Git, GitHub, and deployment fundamentals', slugs: [], levels: [],
          project: 'Push the to-do list to GitHub and deploy on Vercel',
          objectives: ['Initialize repos, commit, branch, merge, and resolve conflicts', 'Write clear commit messages and use pull requests', 'Deploy a static site to Vercel from a GitHub repo'],
          newContent: true,
        },
      ],
    },
    {
      term: 2,
      title: 'Phase 2: React & TypeScript',
      description: 'Component-driven UI with React, TypeScript, and API integration.',
      weeks: [
        {
          week: 5, topic: 'React fundamentals — JSX, props, state, component tree', slugs: [], levels: [],
          project: 'Weather widget that displays data from a prop-driven component hierarchy',
          objectives: ['Create functional components with JSX', 'Pass data down via props and lift state up', 'Use useState for local component state'],
          newContent: true,
        },
        {
          week: 6, topic: 'TypeScript for React — types, interfaces, generics', slugs: [], levels: [],
          project: 'Refactor the weather widget to TypeScript with fully typed props and state',
          objectives: ['Define interfaces for props, state, and API responses', 'Use union types and generics for reusable components', 'Configure tsconfig and fix type errors'],
          newContent: true,
        },
        {
          week: 7, topic: 'useEffect, data fetching, and loading/error states', slugs: [], levels: [],
          project: 'Movie search app that fetches from OMDB API with loading and error handling',
          objectives: ['Fetch data in useEffect with cleanup', 'Implement loading spinners and error boundaries', 'Debounce search input to avoid excessive API calls'],
          newContent: true,
        },
        {
          week: 8, topic: 'React Router, layout patterns, and shared state', slugs: [], levels: [],
          project: 'Multi-page dashboard with nested routes, shared nav, and context-based theme toggle',
          objectives: ['Set up React Router with nested layouts and dynamic routes', 'Share global state with React Context', 'Implement protected routes and redirect logic'],
          newContent: true,
        },
      ],
    },
    {
      term: 3,
      title: 'Phase 3: Backend & Databases',
      description: 'Node.js, Express, PostgreSQL, authentication, and REST API design.',
      weeks: [
        {
          week: 9, topic: 'Node.js and Express — routing, middleware, error handling', slugs: [], levels: [],
          project: 'REST API for a bookstore with CRUD endpoints and input validation',
          objectives: ['Create an Express server with modular route files', 'Write middleware for logging, CORS, and error handling', 'Validate request bodies with Zod or Joi'],
          newContent: true,
        },
        {
          week: 10, topic: 'PostgreSQL — schemas, queries, joins, indexes', slugs: [], levels: [],
          project: 'Design and seed a normalized database for the bookstore (books, authors, genres)',
          objectives: ['Write CREATE TABLE with constraints and foreign keys', 'Query with SELECT, JOIN, GROUP BY, and subqueries', 'Add indexes and explain query plans'],
          newContent: true,
        },
        {
          week: 11, topic: 'ORM integration — Prisma, migrations, relations', slugs: [], levels: [],
          project: 'Connect the bookstore API to PostgreSQL via Prisma with full CRUD',
          objectives: ['Define Prisma schema with relations and enums', 'Run migrations and seed the database', 'Replace raw SQL queries with type-safe Prisma client calls'],
          newContent: true,
        },
        {
          week: 12, topic: 'Authentication — JWT, bcrypt, session management', slugs: [], levels: [],
          project: 'Add user registration, login, and role-based access to the bookstore API',
          objectives: ['Hash passwords with bcrypt and verify on login', 'Issue and verify JWTs for stateless auth', 'Protect routes with auth middleware and role checks'],
          newContent: true,
        },
      ],
    },
    {
      term: 4,
      title: 'Phase 4: Testing, CI/CD & Cloud',
      description: 'Database modeling, automated testing, CI/CD pipelines, and cloud deployment.',
      weeks: [
        {
          week: 13, topic: 'Advanced data modeling — many-to-many, polymorphism, soft deletes', slugs: [], levels: [],
          project: 'Extend the bookstore with reviews, tags (many-to-many), and soft-delete support',
          objectives: ['Model many-to-many with join tables', 'Implement soft deletes with deletedAt timestamps', 'Write database-level constraints for data integrity'],
          newContent: true,
        },
        {
          week: 14, topic: 'Unit and integration testing with Vitest and Supertest', slugs: [], levels: [],
          project: 'Write 30+ tests covering API endpoints, auth flows, and edge cases',
          objectives: ['Write unit tests for utility functions and validators', 'Write integration tests for API routes with Supertest', 'Use test fixtures and database cleanup between tests'],
          newContent: true,
        },
        {
          week: 15, topic: 'CI/CD with GitHub Actions — lint, test, build, deploy', slugs: [], levels: [],
          project: 'Configure a GitHub Actions workflow that lints, tests, and deploys on merge',
          objectives: ['Write a multi-step GitHub Actions workflow', 'Cache dependencies and run tests in parallel', 'Set up automatic deployment on merge to main'],
          newContent: true,
        },
        {
          week: 16, topic: 'Cloud deployment — Docker, Railway/Render, environment management', slugs: [], levels: [],
          project: 'Dockerize the full-stack app and deploy to Railway with managed Postgres',
          objectives: ['Write a multi-stage Dockerfile for Node.js', 'Configure environment variables for dev, staging, and prod', 'Set up health checks, logging, and zero-downtime deploys'],
          newContent: true,
        },
      ],
    },
    {
      term: 5,
      title: 'Phase 5: Production Apps',
      description: 'Build 2 production-grade apps with code review, performance, and security.',
      weeks: [
        {
          week: 17, topic: 'Production App 1 — planning, schema design, sprint setup', slugs: [], levels: [],
          project: 'Project plan, ERD, API spec, and sprint board for a SaaS app (e.g., invoice tracker)',
          objectives: ['Break a product idea into user stories and tasks', 'Design a database schema from requirements', 'Set up a sprint board and estimate effort'],
          newContent: true,
        },
        {
          week: 18, topic: 'Production App 1 — full-stack build with code review', slugs: [], levels: [],
          project: 'Working MVP with auth, CRUD, and a polished React frontend',
          objectives: ['Build features end-to-end from backend to frontend', 'Submit code via pull requests with peer review', 'Write clean, documented, and tested code'],
          newContent: true,
        },
        {
          week: 19, topic: 'Production App 2 — real-time features and 3rd-party APIs', slugs: [], levels: [],
          project: 'Real-time collaboration app (e.g., task board with WebSockets and Stripe checkout)',
          objectives: ['Implement WebSocket communication with Socket.io', 'Integrate a 3rd-party API (payments, email, or maps)', 'Handle webhooks and async event processing'],
          newContent: true,
        },
        {
          week: 20, topic: 'Performance and security hardening', slugs: [], levels: [],
          project: 'Audit and optimize both apps: Lighthouse 90+, fix OWASP top-10 issues',
          objectives: ['Profile and fix frontend performance bottlenecks', 'Prevent XSS, CSRF, SQL injection, and insecure direct object references', 'Implement rate limiting, input sanitization, and CSP headers'],
          newContent: true,
        },
      ],
    },
    {
      term: 6,
      title: 'Phase 6: Career Launch',
      description: 'Portfolio, resume, mock interviews, and employer referrals.',
      weeks: [
        {
          week: 21, topic: 'Portfolio site — design, build, deploy with custom domain', slugs: [], levels: [],
          project: 'Live portfolio site showcasing 4+ projects with case studies',
          objectives: ['Design a portfolio that highlights problem-solving, not just tech', 'Write project case studies with context, approach, and results', 'Deploy to a custom domain with analytics'],
          newContent: true,
        },
        {
          week: 22, topic: 'Resume, LinkedIn, and GitHub profile optimization', slugs: [], levels: [],
          project: 'ATS-optimized resume, polished LinkedIn, and curated GitHub with READMEs',
          objectives: ['Write a one-page resume targeting full-stack roles', 'Optimize LinkedIn headline, summary, and experience sections', 'Add detailed READMEs to all portfolio GitHub repos'],
          newContent: true,
        },
        {
          week: 23, topic: 'Mock interviews — DSA, system design, and behavioral', slugs: [], levels: [],
          project: 'Pass 3 mock interviews with feedback: 1 DSA, 1 system design, 1 behavioral',
          objectives: ['Solve medium-level DSA problems within 30 minutes', 'Design a system (e.g., URL shortener) on a whiteboard', 'Answer behavioral questions using the STAR method'],
          newContent: true,
        },
        {
          week: 24, topic: 'Graduation, employer introductions, and job search strategy', slugs: [], levels: [],
          project: 'Graduation presentation and warm introductions to 3+ hiring partners',
          objectives: ['Present your best project to a panel of engineers', 'Develop a targeted job search strategy with weekly goals', 'Leverage referral network and follow up professionally'],
          newContent: true,
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// TRACK 2: AI & MACHINE LEARNING
// ═══════════════════════════════════════════════════════════════
export const aiMlTrack: TrackCurriculum = {
  id: 'ai-ml',
  name: 'AI & Machine Learning',
  tagline: 'From Python basics to production ML pipelines in 24 weeks',
  icon: '🧠',
  color: 'amber',
  audience: 'Aspiring ML engineers, data analysts wanting to level up',
  prerequisite: 'Basic math comfort (algebra, basic statistics), no coding required',
  capstoneProject: 'Deploy 2 end-to-end ML pipelines with FastAPI, Docker, and MLflow tracking',
  terms: [
    {
      term: 1,
      title: 'Phase 1: Python & Data Fluency',
      description: 'Python programming, NumPy, Pandas, and data visualization.',
      weeks: [
        {
          week: 1, topic: 'Python fundamentals — types, control flow, functions, modules', slugs: [], levels: [],
          project: 'CLI tool that analyzes a CSV file and prints summary statistics',
          objectives: ['Write Python scripts with functions, loops, and error handling', 'Use built-in data structures: lists, dicts, sets, tuples', 'Import and use standard library modules (csv, json, os)'],
          newContent: true,
        },
        {
          week: 2, topic: 'NumPy — arrays, broadcasting, vectorized operations', slugs: [], levels: [],
          project: 'Image processing script that applies filters using NumPy array operations',
          objectives: ['Create and manipulate multi-dimensional NumPy arrays', 'Use broadcasting to perform element-wise operations efficiently', 'Replace Python loops with vectorized NumPy operations'],
          newContent: true,
        },
        {
          week: 3, topic: 'Pandas — DataFrames, cleaning, grouping, merging', slugs: [], levels: [],
          project: 'Clean and analyze a messy real-world dataset (missing values, duplicates, type errors)',
          objectives: ['Load, inspect, and clean DataFrames with Pandas', 'Group, aggregate, and merge multiple datasets', 'Handle missing values, duplicates, and type conversions'],
          newContent: true,
        },
        {
          week: 4, topic: 'Data visualization — Matplotlib, Seaborn, exploratory analysis', slugs: [], levels: [],
          project: 'Exploratory data analysis report with 10+ visualizations on a public dataset',
          objectives: ['Create line, bar, scatter, histogram, and heatmap plots', 'Use Seaborn for statistical visualizations (pair plots, violin plots)', 'Tell a data story by choosing the right chart for each insight'],
          newContent: true,
        },
      ],
    },
    {
      term: 2,
      title: 'Phase 2: Classical Machine Learning',
      description: 'Regression, classification, decision trees, and feature engineering.',
      weeks: [
        {
          week: 5, topic: 'Linear & logistic regression — theory, gradient descent, scikit-learn', slugs: [], levels: [],
          project: 'Predict house prices with linear regression and evaluate with RMSE/R-squared',
          objectives: ['Explain the math behind linear and logistic regression', 'Train models with scikit-learn and interpret coefficients', 'Evaluate with RMSE, R-squared, accuracy, and confusion matrix'],
          newContent: true,
        },
        {
          week: 6, topic: 'Decision trees and ensemble methods — Random Forest, XGBoost', slugs: [], levels: [],
          project: 'Build a customer churn classifier with Random Forest, beat logistic regression baseline',
          objectives: ['Explain how decision trees split data and when they overfit', 'Train Random Forest and XGBoost classifiers', 'Compare model performance with precision, recall, and F1'],
          newContent: true,
        },
        {
          week: 7, topic: 'Feature engineering — encoding, scaling, selection, pipelines', slugs: [], levels: [],
          project: 'Build a scikit-learn pipeline with custom transformers for the churn dataset',
          objectives: ['Encode categorical features with one-hot and target encoding', 'Scale numerical features and handle outliers', 'Use scikit-learn Pipeline and ColumnTransformer for reproducibility'],
          newContent: true,
        },
        {
          week: 8, topic: 'Model evaluation — cross-validation, hyperparameter tuning, overfitting', slugs: [], levels: [],
          project: 'Tune XGBoost with GridSearchCV and Optuna, document experiment results',
          objectives: ['Use k-fold cross-validation to estimate generalization', 'Tune hyperparameters with GridSearchCV and Optuna', 'Diagnose overfitting with learning curves and validation curves'],
          newContent: true,
        },
      ],
    },
    {
      term: 3,
      title: 'Phase 3: Deep Learning',
      description: 'Neural networks, PyTorch, CNNs, and transfer learning.',
      weeks: [
        {
          week: 9, topic: 'Neural network fundamentals — perceptrons, backpropagation, PyTorch basics', slugs: [], levels: [],
          project: 'Train a neural network on MNIST from scratch in PyTorch (97%+ accuracy)',
          objectives: ['Explain forward pass, loss functions, and backpropagation', 'Build a neural network with nn.Module in PyTorch', 'Train with DataLoader, optimizer, and learning rate scheduling'],
          newContent: true,
        },
        {
          week: 10, topic: 'Convolutional Neural Networks — architecture, pooling, batch norm', slugs: [], levels: [],
          project: 'Build a CNN for CIFAR-10 image classification (85%+ accuracy)',
          objectives: ['Explain convolution, pooling, and receptive fields', 'Design CNN architectures with conv, pool, and FC layers', 'Use batch normalization and dropout to improve training'],
          newContent: true,
        },
        {
          week: 11, topic: 'Transfer learning — pretrained models, fine-tuning, data augmentation', slugs: [], levels: [],
          project: 'Fine-tune ResNet-50 on a custom image dataset (e.g., plant disease detection)',
          objectives: ['Load and modify pretrained models from torchvision', 'Freeze layers and fine-tune only the classification head', 'Apply data augmentation to prevent overfitting on small datasets'],
          newContent: true,
        },
        {
          week: 12, topic: 'Training at scale — GPU utilization, mixed precision, experiment tracking', slugs: [], levels: [],
          project: 'Train with mixed precision on GPU and log experiments to Weights & Biases',
          objectives: ['Profile GPU utilization and optimize batch size', 'Use automatic mixed precision (AMP) for faster training', 'Track experiments with Weights & Biases (loss, metrics, artifacts)'],
          newContent: true,
        },
      ],
    },
    {
      term: 4,
      title: 'Phase 4: NLP & LLMs',
      description: 'Natural language processing, embeddings, LLM APIs, and prompt engineering.',
      weeks: [
        {
          week: 13, topic: 'Text processing — tokenization, TF-IDF, text classification', slugs: [], levels: [],
          project: 'Build a spam classifier with TF-IDF + logistic regression (95%+ accuracy)',
          objectives: ['Preprocess text: tokenize, stem, remove stopwords', 'Represent text with bag-of-words and TF-IDF', 'Train and evaluate a text classification pipeline'],
          newContent: true,
        },
        {
          week: 14, topic: 'Word embeddings and transformers — Word2Vec, BERT, attention mechanism', slugs: [], levels: [],
          project: 'Fine-tune a BERT model for sentiment analysis on product reviews',
          objectives: ['Explain word embeddings and why context matters', 'Understand the transformer architecture and self-attention', 'Fine-tune BERT with HuggingFace Transformers library'],
          newContent: true,
        },
        {
          week: 15, topic: 'LLM APIs — OpenAI, Claude, structured output, function calling', slugs: [], levels: [],
          project: 'Build a RAG chatbot that answers questions from a document collection',
          objectives: ['Call LLM APIs with system prompts and structured output', 'Implement retrieval-augmented generation (RAG) with embeddings', 'Use function calling to connect LLMs to external tools'],
          newContent: true,
        },
        {
          week: 16, topic: 'Prompt engineering — chain-of-thought, few-shot, evaluation', slugs: [], levels: [],
          project: 'Design and evaluate a prompt suite for an automated code review assistant',
          objectives: ['Write effective system prompts with chain-of-thought reasoning', 'Use few-shot examples to steer output format and quality', 'Build evaluation harnesses to measure prompt accuracy and consistency'],
          newContent: true,
        },
      ],
    },
    {
      term: 5,
      title: 'Phase 5: Production ML',
      description: 'Build and deploy 2 ML pipelines with FastAPI, Docker, and MLflow.',
      weeks: [
        {
          week: 17, topic: 'ML Pipeline 1 — data ingestion, training, and serving with FastAPI', slugs: [], levels: [],
          project: 'End-to-end ML pipeline: data preprocessing, model training, FastAPI prediction endpoint',
          objectives: ['Structure an ML project with clear data/train/serve separation', 'Build a FastAPI endpoint that loads a model and returns predictions', 'Write data validation with Pydantic for request/response schemas'],
          newContent: true,
        },
        {
          week: 18, topic: 'ML Pipeline 1 — Docker, model registry, and monitoring', slugs: [], levels: [],
          project: 'Dockerize the pipeline and register models with MLflow',
          objectives: ['Containerize the ML service with Docker and docker-compose', 'Track experiments and register models with MLflow', 'Monitor model performance and detect data drift'],
          newContent: true,
        },
        {
          week: 19, topic: 'ML Pipeline 2 — NLP or computer vision end-to-end project', slugs: [], levels: [],
          project: 'Build a second pipeline (e.g., document classifier or object detector) with CI/CD',
          objectives: ['Choose and scope an ML project independently', 'Build training and inference pipelines from scratch', 'Set up CI/CD that retrains and deploys on data changes'],
          newContent: true,
        },
        {
          week: 20, topic: 'Production hardening — load testing, A/B testing, cost optimization', slugs: [], levels: [],
          project: 'Load test both pipelines, implement A/B model comparison, optimize inference cost',
          objectives: ['Load test ML APIs with Locust and identify bottlenecks', 'Implement A/B testing between model versions', 'Optimize inference latency with batching, caching, or model distillation'],
          newContent: true,
        },
      ],
    },
    {
      term: 6,
      title: 'Phase 6: Career Launch',
      description: 'Portfolio, technical writing, mock interviews, and employer referrals.',
      weeks: [
        {
          week: 21, topic: 'Portfolio — project documentation, Jupyter notebooks, live demos', slugs: [], levels: [],
          project: 'Portfolio with 4+ projects: clean repos, notebooks, and live API demos',
          objectives: ['Write clear project READMEs with problem statement, approach, and results', 'Create well-structured Jupyter notebooks that tell a data story', 'Deploy interactive demos (Streamlit, Gradio, or FastAPI)'],
          newContent: true,
        },
        {
          week: 22, topic: 'Technical writing — blog posts, paper summaries, communication', slugs: [], levels: [],
          project: 'Publish 2 technical blog posts explaining your ML projects to a broad audience',
          objectives: ['Explain complex ML concepts in accessible language', 'Write a structured blog post with visuals and code snippets', 'Summarize a research paper and explain its practical implications'],
          newContent: true,
        },
        {
          week: 23, topic: 'Mock interviews — ML theory, coding, and system design', slugs: [], levels: [],
          project: 'Pass 3 mock interviews: 1 ML theory, 1 coding (LeetCode + Pandas), 1 ML system design',
          objectives: ['Explain bias-variance tradeoff, regularization, and evaluation metrics clearly', 'Solve coding problems involving data manipulation and algorithms', 'Design an ML system end-to-end (data, training, serving, monitoring)'],
          newContent: true,
        },
        {
          week: 24, topic: 'Graduation, employer introductions, and job search strategy', slugs: [], levels: [],
          project: 'Graduation presentation and warm introductions to 3+ hiring partners',
          objectives: ['Present your best ML project to a panel of engineers', 'Develop a targeted job search strategy for ML/AI roles', 'Leverage referral network and follow up professionally'],
          newContent: true,
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// TRACK 3: CLOUD & DEVOPS
// ═══════════════════════════════════════════════════════════════
export const cloudDevOpsTrack: TrackCurriculum = {
  id: 'cloud-devops',
  name: 'Cloud & DevOps',
  tagline: 'From Linux fundamentals to production infrastructure in 24 weeks',
  icon: '☁️',
  color: 'emerald',
  audience: 'Developers wanting to specialize in infrastructure and operations',
  prerequisite: 'Basic programming experience in any language',
  capstoneProject: 'Design and deploy a production-grade microservices platform with full observability',
  terms: [
    {
      term: 1,
      title: 'Phase 1: Linux & Networking',
      description: 'Linux administration, networking fundamentals, shell scripting, and SSH.',
      weeks: [
        {
          week: 1, topic: 'Linux fundamentals — filesystem, users, permissions, package management', slugs: [], levels: [],
          project: 'Set up an Ubuntu server with users, groups, sudo, and essential packages',
          objectives: ['Navigate the Linux filesystem and understand the directory hierarchy', 'Manage users, groups, and file permissions (chmod, chown)', 'Install and update packages with apt and manage services with systemctl'],
          newContent: true,
        },
        {
          week: 2, topic: 'Networking — TCP/IP, DNS, HTTP, ports, firewalls', slugs: [], levels: [],
          project: 'Configure firewall rules (ufw/iptables) and verify with curl, dig, and netstat',
          objectives: ['Explain the TCP/IP stack, DNS resolution, and HTTP request lifecycle', 'Use networking tools: ping, traceroute, dig, curl, netstat, ss', 'Configure firewall rules to allow/deny traffic by port and protocol'],
          newContent: true,
        },
        {
          week: 3, topic: 'Shell scripting — Bash, text processing, cron, automation', slugs: [], levels: [],
          project: 'Automated backup script with logging, error handling, and cron scheduling',
          objectives: ['Write Bash scripts with variables, conditionals, loops, and functions', 'Process text with grep, sed, awk, and pipes', 'Schedule recurring tasks with cron and manage log rotation'],
          newContent: true,
        },
        {
          week: 4, topic: 'SSH, key management, and remote server administration', slugs: [], levels: [],
          project: 'Harden an SSH server: key-only auth, fail2ban, port change, and config management',
          objectives: ['Generate SSH key pairs and configure key-based authentication', 'Harden SSH configuration (disable password auth, change port)', 'Use scp, rsync, and ssh tunneling for file transfer and port forwarding'],
          newContent: true,
        },
      ],
    },
    {
      term: 2,
      title: 'Phase 2: Containers & Orchestration',
      description: 'Docker, Docker Compose, Kubernetes fundamentals, and Helm.',
      weeks: [
        {
          week: 5, topic: 'Docker fundamentals — images, containers, Dockerfiles, registries', slugs: [], levels: [],
          project: 'Containerize a multi-service app (frontend + backend + database) with Dockerfiles',
          objectives: ['Write efficient Dockerfiles with multi-stage builds', 'Build, tag, push, and pull images from Docker Hub', 'Understand layers, caching, and image size optimization'],
          newContent: true,
        },
        {
          week: 6, topic: 'Docker Compose — multi-container apps, networking, volumes', slugs: [], levels: [],
          project: 'docker-compose.yml for a 3-tier app with persistent volumes and health checks',
          objectives: ['Define multi-container applications with Docker Compose', 'Configure container networking, volumes, and environment variables', 'Use health checks, depends_on, and restart policies'],
          newContent: true,
        },
        {
          week: 7, topic: 'Kubernetes fundamentals — pods, deployments, services, namespaces', slugs: [], levels: [],
          project: 'Deploy the 3-tier app to a local Kubernetes cluster (minikube or kind)',
          objectives: ['Explain Kubernetes architecture: control plane, nodes, kubelet', 'Create Deployments, Services, and ConfigMaps with YAML manifests', 'Use kubectl to inspect, debug, and manage resources'],
          newContent: true,
        },
        {
          week: 8, topic: 'Helm charts, Ingress, and Kubernetes storage', slugs: [], levels: [],
          project: 'Package the app as a Helm chart with Ingress routing and persistent storage',
          objectives: ['Create and manage Helm charts with values and templates', 'Configure Ingress controllers for HTTP routing and TLS', 'Provision persistent storage with PersistentVolumeClaims'],
          newContent: true,
        },
      ],
    },
    {
      term: 3,
      title: 'Phase 3: AWS & Infrastructure as Code',
      description: 'Core AWS services (EC2, S3, RDS, Lambda), Terraform, and IAM.',
      weeks: [
        {
          week: 9, topic: 'AWS core — EC2, VPC, security groups, load balancers', slugs: [], levels: [],
          project: 'Deploy a web app on EC2 behind an ALB with auto-scaling group',
          objectives: ['Launch EC2 instances with proper VPC, subnet, and security group config', 'Configure an Application Load Balancer with target groups', 'Set up auto-scaling based on CPU utilization'],
          newContent: true,
        },
        {
          week: 10, topic: 'AWS storage & databases — S3, RDS, DynamoDB, IAM policies', slugs: [], levels: [],
          project: 'Set up RDS PostgreSQL, S3 for file uploads, with least-privilege IAM roles',
          objectives: ['Configure S3 buckets with versioning, lifecycle rules, and access policies', 'Deploy RDS with multi-AZ, backups, and parameter groups', 'Write IAM policies following the principle of least privilege'],
          newContent: true,
        },
        {
          week: 11, topic: 'AWS serverless — Lambda, API Gateway, EventBridge, SQS', slugs: [], levels: [],
          project: 'Build a serverless API with Lambda, API Gateway, and SQS for async processing',
          objectives: ['Write and deploy Lambda functions with proper error handling', 'Configure API Gateway with routes, authorization, and throttling', 'Use SQS and EventBridge for decoupled async processing'],
          newContent: true,
        },
        {
          week: 12, topic: 'Terraform — HCL, state management, modules, plan/apply workflow', slugs: [], levels: [],
          project: 'Rewrite all AWS infrastructure as Terraform with reusable modules',
          objectives: ['Write Terraform HCL for VPC, EC2, RDS, and S3 resources', 'Manage state with remote backends (S3 + DynamoDB lock)', 'Create reusable Terraform modules and use variables/outputs'],
          newContent: true,
        },
      ],
    },
    {
      term: 4,
      title: 'Phase 4: CI/CD & Observability',
      description: 'GitHub Actions, testing pipelines, Prometheus, Grafana, and the ELK stack.',
      weeks: [
        {
          week: 13, topic: 'GitHub Actions — workflows, matrix builds, secrets, artifacts', slugs: [], levels: [],
          project: 'CI pipeline that lints, tests, builds Docker images, and pushes to ECR on merge',
          objectives: ['Write multi-job GitHub Actions workflows with dependencies', 'Use matrix strategy for testing across versions and platforms', 'Manage secrets and artifacts securely in workflows'],
          newContent: true,
        },
        {
          week: 14, topic: 'CD pipelines — blue-green deploys, canary releases, rollbacks', slugs: [], levels: [],
          project: 'CD pipeline with blue-green deployment to ECS and automatic rollback on failure',
          objectives: ['Implement blue-green and canary deployment strategies', 'Configure automatic rollbacks based on health checks', 'Use feature flags for gradual rollouts'],
          newContent: true,
        },
        {
          week: 15, topic: 'Metrics and alerting — Prometheus, Grafana, SLOs', slugs: [], levels: [],
          project: 'Instrument the app with Prometheus metrics and build Grafana dashboards with alerts',
          objectives: ['Instrument applications with Prometheus client libraries', 'Build Grafana dashboards for RED metrics (rate, errors, duration)', 'Define SLOs and configure alerts for SLO violations'],
          newContent: true,
        },
        {
          week: 16, topic: 'Logging and tracing — ELK stack, structured logging, distributed tracing', slugs: [], levels: [],
          project: 'Deploy ELK stack, ship structured logs, and set up distributed tracing with Jaeger',
          objectives: ['Configure Filebeat, Logstash, and Elasticsearch for log aggregation', 'Implement structured JSON logging with correlation IDs', 'Set up distributed tracing with Jaeger or OpenTelemetry'],
          newContent: true,
        },
      ],
    },
    {
      term: 5,
      title: 'Phase 5: Production Infrastructure',
      description: 'Build 2 infrastructure projects: microservices migration and disaster recovery.',
      weeks: [
        {
          week: 17, topic: 'Infra Project 1 — microservices architecture and migration plan', slugs: [], levels: [],
          project: 'Architecture diagram and migration plan for splitting a monolith into 4 microservices',
          objectives: ['Identify bounded contexts and service boundaries', 'Design inter-service communication (REST, gRPC, message queues)', 'Plan a phased migration strategy with the strangler fig pattern'],
          newContent: true,
        },
        {
          week: 18, topic: 'Infra Project 1 — deploy microservices on Kubernetes with service mesh', slugs: [], levels: [],
          project: 'Deploy 4 microservices on EKS with Istio service mesh and observability',
          objectives: ['Deploy a multi-service application on EKS', 'Configure Istio for traffic management, mTLS, and observability', 'Implement circuit breakers and retry policies'],
          newContent: true,
        },
        {
          week: 19, topic: 'Infra Project 2 — disaster recovery and high availability', slugs: [], levels: [],
          project: 'Multi-region DR setup with automated failover, backup verification, and RTO/RPO targets',
          objectives: ['Design multi-region active-passive and active-active architectures', 'Implement automated database backups and cross-region replication', 'Test disaster recovery with chaos engineering (simulate failures)'],
          newContent: true,
        },
        {
          week: 20, topic: 'Scaling and cost optimization', slugs: [], levels: [],
          project: 'Implement auto-scaling policies and reduce AWS bill by 30%+ with right-sizing',
          objectives: ['Configure horizontal and vertical auto-scaling policies', 'Use AWS Cost Explorer and right-size instances and storage', 'Implement spot instances, reserved instances, and savings plans'],
          newContent: true,
        },
      ],
    },
    {
      term: 6,
      title: 'Phase 6: Career Launch',
      description: 'Portfolio, system design preparation, mock interviews, and employer referrals.',
      weeks: [
        {
          week: 21, topic: 'Portfolio — infrastructure projects, architecture docs, live demos', slugs: [], levels: [],
          project: 'Portfolio with architecture diagrams, runbooks, Terraform repos, and live infrastructure',
          objectives: ['Document infrastructure projects with architecture diagrams and decision records', 'Write operational runbooks for incident response and deployment', 'Showcase Terraform repos with clean module structure and documentation'],
          newContent: true,
        },
        {
          week: 22, topic: 'System design preparation — load balancers, caching, databases at scale', slugs: [], levels: [],
          project: 'Complete 5 system design exercises: URL shortener, chat system, CDN, rate limiter, search',
          objectives: ['Estimate capacity: QPS, storage, bandwidth for a given system', 'Design scalable systems with load balancing, caching, and sharding', 'Make and justify tradeoff decisions (consistency vs availability, SQL vs NoSQL)'],
          newContent: true,
        },
        {
          week: 23, topic: 'Mock interviews — Linux troubleshooting, system design, behavioral', slugs: [], levels: [],
          project: 'Pass 3 mock interviews: 1 troubleshooting, 1 system design, 1 behavioral',
          objectives: ['Troubleshoot Linux systems live: diagnose CPU, memory, disk, and network issues', 'Design a distributed system on a whiteboard with clear communication', 'Answer behavioral questions using the STAR method with DevOps examples'],
          newContent: true,
        },
        {
          week: 24, topic: 'Graduation, employer introductions, and job search strategy', slugs: [], levels: [],
          project: 'Graduation presentation and warm introductions to 3+ hiring partners',
          objectives: ['Present your best infrastructure project to a panel of engineers', 'Develop a targeted job search strategy for DevOps/SRE/Platform roles', 'Leverage referral network and follow up professionally'],
          newContent: true,
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// ALL BOOTCAMP TRACKS
// ═══════════════════════════════════════════════════════════════
export const allBootcampTracks: TrackCurriculum[] = [
  fullStackTrack,
  aiMlTrack,
  cloudDevOpsTrack,
];
