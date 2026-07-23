/**
 * Seed script — inserts 12 demo courses into the database.
 *
 * Usage:
 *   INSTRUCTOR_ID=<keycloak-user-uuid> DATABASE_URL=<postgres-url> \
 *   npx ts-node -r tsconfig-paths/register src/seeds/seed-courses.ts
 *
 * Or with docker-compose:
 *   docker compose exec backend sh -c \
 *     "INSTRUCTOR_ID=<uuid> npx ts-node -r tsconfig-paths/register src/seeds/seed-courses.ts"
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Course } from '../modules/courses/domain/course.entity';

const INSTRUCTOR_ID = process.env.INSTRUCTOR_ID ?? '00000000-0000-0000-0000-000000000001';

const COURSES: Partial<Course>[] = [
  /* ── Free courses ── */
  {
    title: 'JavaScript Fundamentals',
    description: 'Master the building blocks of the web. Variables, functions, DOM manipulation, async/await, and modern ES2024 features explained clearly.',
    category: 'Programming',
    level: 'Beginner',
    isPremium: false,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Getting Started',
        lessons: [
          { title: 'What is JavaScript?', duration: '8 min', content: 'JavaScript is the language of the web. In this lesson we explore its history, how it runs in the browser, and why it matters.' },
          { title: 'Variables & Data Types', duration: '12 min', content: 'Learn about var, let, const and the primitive data types: string, number, boolean, null, undefined, and symbol.' },
          { title: 'Operators & Expressions', duration: '10 min', content: 'Arithmetic, comparison, logical operators and how JavaScript evaluates expressions.' },
        ],
      },
      {
        title: 'Functions & Scope',
        lessons: [
          { title: 'Declaring Functions', duration: '11 min', content: 'Function declarations, expressions, arrow functions, and the difference between them.' },
          { title: 'Scope & Closures', duration: '14 min', content: 'Understand lexical scope, the closure concept, and practical use-cases like data privacy.' },
        ],
      },
      {
        title: 'Async JavaScript',
        lessons: [
          { title: 'Callbacks & Promises', duration: '15 min', content: 'How asynchronous code works, the callback pattern, and Promise-based alternatives.' },
          { title: 'Async / Await', duration: '13 min', content: 'Modern async syntax, error handling with try/catch, and best practices.' },
        ],
      },
    ],
  },
  {
    title: 'Git & GitHub Mastery',
    description: 'Go from zero to confident with Git. Learn branching strategies, pull requests, resolving conflicts, and collaborating on open-source projects.',
    category: 'Programming',
    level: 'Beginner',
    isPremium: false,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Git Basics',
        lessons: [
          { title: 'What is Version Control?', duration: '7 min', content: 'The problem version control solves and why Git became the industry standard.' },
          { title: 'init, add, commit', duration: '10 min', content: 'Your first repository: initialising, staging files, and writing meaningful commit messages.' },
          { title: 'Viewing History', duration: '8 min', content: 'git log, git diff, and navigating the commit history.' },
        ],
      },
      {
        title: 'Branching & Merging',
        lessons: [
          { title: 'Branches Explained', duration: '9 min', content: 'Creating, switching, and deleting branches. The HEAD pointer demystified.' },
          { title: 'Merging & Rebasing', duration: '12 min', content: 'Fast-forward vs three-way merges, resolving conflicts, and when to rebase.' },
        ],
      },
      {
        title: 'GitHub Collaboration',
        lessons: [
          { title: 'Remote Repositories', duration: '10 min', content: 'push, pull, fetch, and the origin remote.' },
          { title: 'Pull Requests', duration: '11 min', content: 'Opening, reviewing, and merging pull requests. Code review best practices.' },
        ],
      },
    ],
  },
  {
    title: 'CSS & Tailwind CSS',
    description: 'Build beautiful, responsive UIs from scratch. Covers the box model, flexbox, grid, animations, and utility-first styling with Tailwind.',
    category: 'Web Development',
    level: 'Beginner',
    isPremium: false,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'CSS Core Concepts',
        lessons: [
          { title: 'Selectors & Specificity', duration: '10 min', content: 'Type, class, ID, attribute selectors and how specificity is calculated.' },
          { title: 'Box Model & Sizing', duration: '11 min', content: 'margin, padding, border, content-box vs border-box.' },
          { title: 'Flexbox Layout', duration: '16 min', content: 'flex-direction, justify-content, align-items, gap — building real-world layouts.' },
        ],
      },
      {
        title: 'Tailwind CSS',
        lessons: [
          { title: 'Utility-First Philosophy', duration: '9 min', content: 'Why utility classes beat component classes for maintainability and speed.' },
          { title: 'Responsive Design', duration: '13 min', content: 'Breakpoint prefixes, mobile-first approach, and responsive grids in Tailwind.' },
          { title: 'Dark Mode & Theming', duration: '12 min', content: 'Enabling dark mode, custom themes, and extending the Tailwind config.' },
        ],
      },
    ],
  },
  {
    title: 'Node.js REST API Development',
    description: 'Build production-grade REST APIs using Node.js, Express, and PostgreSQL. JWT auth, input validation, error handling, and deployment included.',
    category: 'Web Development',
    level: 'Intermediate',
    isPremium: false,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Express Foundations',
        lessons: [
          { title: 'Setting Up Express', duration: '10 min', content: 'Project structure, routing, middleware chain, and the request/response cycle.' },
          { title: 'Route Handlers & Controllers', duration: '12 min', content: 'Organising routes, query params, route params, and request bodies.' },
        ],
      },
      {
        title: 'Database Integration',
        lessons: [
          { title: 'PostgreSQL with node-postgres', duration: '14 min', content: 'Connecting to Postgres, parameterised queries, and preventing SQL injection.' },
          { title: 'Database Migrations', duration: '11 min', content: 'Managing schema changes safely with migration scripts.' },
        ],
      },
      {
        title: 'Authentication & Security',
        lessons: [
          { title: 'JWT Authentication', duration: '16 min', content: 'Signing tokens, verifying them, and securing routes with middleware.' },
          { title: 'Input Validation & Error Handling', duration: '13 min', content: 'Joi/Zod validation, centralised error responses, and safe error messages.' },
        ],
      },
    ],
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn how great products are designed. Covers colour theory, typography, layout principles, accessibility, and design thinking processes.',
    category: 'Design',
    level: 'Beginner',
    isPremium: false,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Design Fundamentals',
        lessons: [
          { title: 'Colour Theory', duration: '12 min', content: 'Colour wheel, complementary colours, contrast ratios, and choosing a palette.' },
          { title: 'Typography', duration: '11 min', content: 'Type scales, pairing fonts, line height, and readability.' },
          { title: 'Layout & White Space', duration: '10 min', content: 'Grid systems, proximity, alignment, and breathing room in interfaces.' },
        ],
      },
      {
        title: 'UX Process',
        lessons: [
          { title: 'User Research Basics', duration: '13 min', content: 'Interviews, surveys, and turning data into insights.' },
          { title: 'Wireframing & Prototyping', duration: '14 min', content: 'Low-fi wireframes, clickable prototypes, and gathering feedback early.' },
        ],
      },
    ],
  },
  {
    title: 'Figma for Developers',
    description: 'Bridge the design-dev gap. Learn to read Figma files, extract tokens, use Dev Mode, and collaborate effectively with your design team.',
    category: 'Design',
    level: 'Beginner',
    isPremium: false,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Figma Basics',
        lessons: [
          { title: 'Navigating the Figma Interface', duration: '9 min', content: 'Layers panel, assets, components, and frames vs groups.' },
          { title: 'Inspecting Design Specs', duration: '10 min', content: 'Using the inspect panel to extract spacing, colours, and typography.' },
        ],
      },
      {
        title: 'Dev Mode & Handoff',
        lessons: [
          { title: 'Dev Mode Overview', duration: '11 min', content: 'Annotated specs, code snippets, and redlines for pixel-perfect implementation.' },
          { title: 'Design Tokens', duration: '12 min', content: 'Extracting variables, connecting to your codebase, and keeping parity.' },
        ],
      },
    ],
  },

  /* ── Premium courses ── */
  {
    title: 'React & Next.js Complete Guide',
    description: 'Go from React novice to full-stack Next.js developer. App Router, Server Components, data fetching, authentication, and deployment on Vercel.',
    category: 'Web Development',
    level: 'Intermediate',
    isPremium: true,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'React Fundamentals',
        lessons: [
          { title: 'Components & Props', duration: '14 min', content: 'Functional components, prop drilling, children, and component composition.' },
          { title: 'useState & useEffect', duration: '16 min', content: 'Managing local state, side effects, cleanup, and dependency arrays.' },
          { title: 'Context & useReducer', duration: '15 min', content: 'Lifting state, React Context, and complex state management with useReducer.' },
        ],
      },
      {
        title: 'Next.js App Router',
        lessons: [
          { title: 'File-Based Routing', duration: '12 min', content: 'Pages, layouts, loading states, error boundaries, and route groups.' },
          { title: 'Server vs Client Components', duration: '18 min', content: 'When to use each, the composability model, and avoiding "client creep".' },
          { title: 'Data Fetching Patterns', duration: '17 min', content: 'fetch in server components, streaming, Suspense, and revalidation strategies.' },
        ],
      },
      {
        title: 'Production & Deployment',
        lessons: [
          { title: 'Authentication with NextAuth', duration: '20 min', content: 'Setting up OAuth providers, session management, and protecting routes.' },
          { title: 'Deploying to Vercel', duration: '13 min', content: 'Environment variables, preview deployments, and performance monitoring.' },
        ],
      },
    ],
  },
  {
    title: 'Python for Data Analysis',
    description: 'Master Pandas, NumPy, and Matplotlib to analyse real datasets. Covers data cleaning, exploratory analysis, visualisation, and statistical insights.',
    category: 'Data Science',
    level: 'Intermediate',
    isPremium: true,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Python Data Stack',
        lessons: [
          { title: 'NumPy Arrays', duration: '14 min', content: 'ndarray, vectorised operations, broadcasting, and performance vs plain Python.' },
          { title: 'Pandas Series & DataFrames', duration: '18 min', content: 'Creating, indexing, slicing, and understanding the Pandas data model.' },
        ],
      },
      {
        title: 'Data Wrangling',
        lessons: [
          { title: 'Cleaning Messy Data', duration: '16 min', content: 'Handling nulls, duplicates, type coercion, and applying transformations.' },
          { title: 'GroupBy & Aggregations', duration: '15 min', content: 'split-apply-combine, pivot tables, and reshaping data.' },
          { title: 'Merging & Joining', duration: '14 min', content: 'merge, join, concat — choosing the right operation for each situation.' },
        ],
      },
      {
        title: 'Visualisation',
        lessons: [
          { title: 'Matplotlib Foundations', duration: '13 min', content: 'Figures, axes, line/bar/scatter plots, and styling.' },
          { title: 'Seaborn Statistical Plots', duration: '15 min', content: 'Distribution plots, heatmaps, pair plots, and facet grids.' },
        ],
      },
    ],
  },
  {
    title: 'Machine Learning with Python',
    description: 'Build and deploy ML models from scratch using scikit-learn and PyTorch. Covers supervised learning, neural networks, evaluation, and MLOps basics.',
    category: 'Data Science',
    level: 'Advanced',
    isPremium: true,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Supervised Learning',
        lessons: [
          { title: 'Linear & Logistic Regression', duration: '18 min', content: 'The mathematics behind regression, gradient descent, and regularisation.' },
          { title: 'Decision Trees & Random Forests', duration: '16 min', content: 'Tree structure, overfitting, ensembles, and feature importance.' },
          { title: 'Model Evaluation', duration: '15 min', content: 'Cross-validation, confusion matrix, ROC-AUC, and choosing the right metric.' },
        ],
      },
      {
        title: 'Neural Networks with PyTorch',
        lessons: [
          { title: 'Tensors & Autograd', duration: '17 min', content: 'PyTorch tensors, computation graphs, and automatic differentiation.' },
          { title: 'Building a Neural Network', duration: '20 min', content: 'nn.Module, layers, activation functions, and training loop from scratch.' },
          { title: 'CNNs for Image Classification', duration: '22 min', content: 'Convolutional layers, pooling, batch normalisation, and transfer learning.' },
        ],
      },
    ],
  },
  {
    title: 'Docker & Kubernetes',
    description: 'Containerise any application and orchestrate it at scale. Covers Dockerfiles, Compose, Kubernetes deployments, Helm charts, and CI/CD integration.',
    category: 'DevOps',
    level: 'Advanced',
    isPremium: true,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Docker Deep Dive',
        lessons: [
          { title: 'Images & Containers', duration: '13 min', content: 'Layered filesystem, copy-on-write, and running your first container.' },
          { title: 'Writing Production Dockerfiles', duration: '16 min', content: 'Multi-stage builds, minimising image size, and security best practices.' },
          { title: 'Docker Compose', duration: '14 min', content: 'Multi-service apps, networking, volumes, and health checks.' },
        ],
      },
      {
        title: 'Kubernetes',
        lessons: [
          { title: 'Core Concepts', duration: '18 min', content: 'Pods, Deployments, Services, ConfigMaps, Secrets — how they relate.' },
          { title: 'Deployments & Scaling', duration: '16 min', content: 'Rolling updates, rollbacks, horizontal pod autoscaling, and resource limits.' },
          { title: 'Helm Charts', duration: '17 min', content: 'Packaging apps with Helm, templating, values files, and repository management.' },
        ],
      },
    ],
  },
  {
    title: 'PostgreSQL & Database Design',
    description: 'Design schemas that scale. Covers normalisation, indexes, query optimisation, transactions, JSONB, and advanced PostgreSQL features.',
    category: 'Programming',
    level: 'Intermediate',
    isPremium: true,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'Schema Design',
        lessons: [
          { title: 'Normalisation (1NF → 3NF)', duration: '16 min', content: 'Eliminating redundancy, functional dependencies, and real-world trade-offs.' },
          { title: 'Primary & Foreign Keys', duration: '12 min', content: 'Referential integrity, cascade rules, and designing relationships.' },
          { title: 'JSONB for Semi-Structured Data', duration: '14 min', content: 'When to use JSONB, indexing strategies, and querying operators.' },
        ],
      },
      {
        title: 'Performance',
        lessons: [
          { title: 'Index Types & Strategy', duration: '18 min', content: 'B-tree, Hash, GIN, GIST — choosing the right index for each query pattern.' },
          { title: 'EXPLAIN ANALYZE', duration: '15 min', content: 'Reading query plans, identifying seq scans, and rewriting slow queries.' },
          { title: 'Transactions & Isolation Levels', duration: '16 min', content: 'ACID guarantees, isolation levels, and avoiding deadlocks.' },
        ],
      },
    ],
  },
  {
    title: 'DevOps CI/CD Pipeline',
    description: 'Automate your software delivery. Build GitHub Actions pipelines, implement blue-green deployments, set up monitoring, and practice SRE principles.',
    category: 'DevOps',
    level: 'Intermediate',
    isPremium: true,
    published: true,
    instructorId: INSTRUCTOR_ID,
    sections: [
      {
        title: 'GitHub Actions',
        lessons: [
          { title: 'Workflows & Triggers', duration: '13 min', content: 'YAML syntax, push/PR triggers, matrix builds, and reusable workflows.' },
          { title: 'Build, Test & Lint Jobs', duration: '15 min', content: 'Caching dependencies, running tests in parallel, and uploading artefacts.' },
          { title: 'Secrets & Environments', duration: '12 min', content: 'Managing credentials, environment protection rules, and OIDC authentication.' },
        ],
      },
      {
        title: 'Deployment Strategies',
        lessons: [
          { title: 'Blue-Green Deployments', duration: '16 min', content: 'Zero-downtime releases, traffic switching, and rollback procedures.' },
          { title: 'Canary Releases', duration: '14 min', content: 'Gradual rollout, feature flags, and measuring deployment success.' },
          { title: 'Observability & Alerting', duration: '17 min', content: 'Prometheus, Grafana dashboards, SLIs/SLOs, and on-call practices.' },
        ],
      },
    ],
  },
];

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL ?? 'postgresql://skillflow:skillflow@localhost:5432/skillflow',
    entities: [Course],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Connected to database');

  const repo = dataSource.getRepository(Course);

  let created = 0;
  let skipped = 0;

  for (const data of COURSES) {
    const exists = await repo.findOne({ where: { title: data.title } });
    if (exists) {
      console.log(`  → skipped (exists): ${data.title}`);
      skipped++;
      continue;
    }
    const course = repo.create(data);
    await repo.save(course);
    const badge = data.isPremium ? '👑 Premium' : '🆓 Free   ';
    console.log(`  ✓ created ${badge}: ${data.title}`);
    created++;
  }

  await dataSource.destroy();
  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
