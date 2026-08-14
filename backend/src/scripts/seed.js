const connectDB = require('../config/db');
const Content = require('../models/Content');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');

const sampleArticles = [
  {
    title: "Understanding Next.js 15 App Router & Server Components",
    description: "Deep dive into Next.js 15 features including React Server Components, streaming SSR, server actions, and optimized client hydration models.",
    source: "TechCrunch",
    url: "https://nextjs.org/docs",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-14T09:30:00Z"),
  },
  {
    title: "Building Autonomous AI Agents with Node.js & Vector Databases",
    description: "Learn how to build resilient AI agent pipelines using Node.js, OpenAI APIs, Pinecone, and MongoDB Atlas Vector Search for retrieval-augmented generation.",
    source: "Hacker News",
    url: "https://news.ycombinator.com",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-14T08:15:00Z"),
  },
  {
    title: "MongoDB Indexing Strategies for High-Scale Applications",
    description: "Learn how compound indexes, partial indexes, and execution plan analysis with explain() can drastically reduce query latency in production.",
    source: "MongoDB Engineering",
    url: "https://www.mongodb.com/blog",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-13T16:45:00Z"),
  },
  {
    title: "System Architecture: How Top Engineering Teams Scale REST APIs",
    description: "An architectural guide covering rate limiting, Redis caching layers, database indexing, horizontally autoscaling Node.js workers, and load balancing.",
    source: "InfoQ",
    url: "https://infoq.com",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-13T12:00:00Z"),
  },
  {
    title: "Building Resilient Clean Architecture in Node.js REST APIs",
    description: "A comprehensive guide on decoupling business logic from HTTP routing using Controllers, Services, Repositories, and custom error boundaries.",
    source: "FreeCodeCamp",
    url: "https://freecodecamp.org",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-12T14:15:00Z"),
  },
  {
    title: "The Evolution of Micro-Frontends and Module Federation",
    description: "Exploring modular frontend architectures, independent deployment strategies, and dynamic runtime component sharing in web applications.",
    source: "Smashing Magazine",
    url: "https://smashingmagazine.com",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-11T11:00:00Z"),
  },
  {
    title: "Securing Modern Web Apps with JWT and HttpOnly Cookies",
    description: "Mitigating XSS and CSRF risks by implementing proper token rotation, secure cookie flags, and authorization headers in single-page apps.",
    source: "Dev.to",
    url: "https://dev.to",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-10T08:20:00Z"),
  },
  {
    title: "Mastering TypeScript Generics and Utility Types",
    description: "Enhance type safety and write clean, reusable TypeScript code using mapped types, infer, conditional types, and utility helpers.",
    source: "Dev.to",
    url: "https://dev.to",
    image: "https://images.unsplash.com/photo-1516116211223-425826829e2c?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-09T18:00:00Z"),
  },
  {
    title: "PostgreSQL vs MongoDB in 2026: Choosing the Right Database",
    description: "Comparing document databases vs relational SQL engines, schema flexibility vs strict relational constraints, and aggregation performance.",
    source: "MongoDB Engineering",
    url: "https://www.mongodb.com/blog",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-09T10:30:00Z"),
  },
  {
    title: "State Management in 2026: Zustand vs Redux Toolkit vs React Query",
    description: "Comparing client state vs server state caching, boilerplate overhead, and developer ergonomics in modern frontend applications.",
    source: "CSS-Tricks",
    url: "https://css-tricks.com",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-08T13:10:00Z"),
  },
  {
    title: "Designing Accessible UI Systems with Tailwind CSS",
    description: "Best practices for building WCAG AA compliant design tokens, keyboard navigation support, dark mode toggles, and dynamic micro-interactions.",
    source: "UX Collective",
    url: "https://uxdesign.cc",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-07T10:00:00Z"),
  },
  {
    title: "Dockerizing Full-Stack Node.js and Next.js Applications",
    description: "Step-by-step tutorial on multi-stage Docker builds, image size optimization, container orchestration with docker-compose, and environment security.",
    source: "InfoQ",
    url: "https://infoq.com",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-06T15:30:00Z"),
  },
  {
    title: "GraphQL vs REST API: Making the Right Architectural Choice",
    description: "Analyzing payload efficiency, schema versioning, over-fetching vs under-fetching, caching layers, and maintenance overhead for API teams.",
    source: "TechCrunch",
    url: "https://techcrunch.com",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-05T09:45:00Z"),
  },
  {
    title: "Asynchronous JavaScript: Promises, Async/Await and Event Loop Mechanics",
    description: "Demystifying the JavaScript event loop, microtask vs macrotask queues, unhandled rejections, and writing leak-free async code.",
    source: "FreeCodeCamp",
    url: "https://freecodecamp.org",
    image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-04T17:00:00Z"),
  },
  {
    title: "Web Vitals Optimization: Achieving 100/100 Lighthouse Ratings",
    description: "Actionable strategies for optimizing LCP, FID, INP, and CLS metrics through font preloading, image compression, and code splitting.",
    source: "Smashing Magazine",
    url: "https://smashingmagazine.com",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date("2026-08-03T12:20:00Z"),
  }
];

const seedData = async () => {
  try {
    const conn = await connectDB();
    console.log('🌱 Connected to MongoDB Atlas cluster for database seeding...');

    // Clear existing content items
    await Content.deleteMany({});
    console.log('🧹 Cleared existing Content records.');

    // Insert expanded sample articles
    const insertedContent = await Content.insertMany(sampleArticles);
    console.log(`✅ Successfully seeded ${insertedContent.length} engineering articles into MongoDB Atlas!`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
