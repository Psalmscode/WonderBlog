require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./server/models/Post');

const POSTS = [
  {
    title: "Mastering Async/Await in JavaScript: From Callbacks to Promises",
    content: `Async/await has revolutionized the way we handle asynchronous operations in JavaScript. In this comprehensive guide, we'll explore how to transition from callback hell to clean, readable asynchronous code.

Understanding the Evolution

JavaScript's asynchronous handling has evolved significantly over the years. Callbacks were the original approach, often leading to deeply nested structures known as "callback hell." Promises offered a cleaner alternative, and async/await made asynchronous code read almost like synchronous code.

The key insight is that await pauses execution of the async function until the promise resolves, making error handling with try/catch feel completely natural.

Best Practices

Always wrap async operations in try/catch blocks. Avoid mixing callbacks with async/await. Use Promise.all() when running multiple async operations in parallel to maximize performance.

This pattern has become the industry standard for modern JavaScript development, and mastering it will dramatically improve both the readability and maintainability of your codebase.`,
    category: "JavaScript",
    excerpt: "From callback hell to clean, readable asynchronous code — a complete deep dive into modern async patterns.",
    tags: ["JavaScript", "Async", "ES2017"],
    author: "Wonder",
    userType: "admin",
    featured: true,
  },
  {
    title: "React Hooks Deep Dive: Building Complex State Management",
    content: `React Hooks have transformed how we write components. Let's explore advanced patterns and best practices for building scalable state management.

Core Concepts

Hooks are functions that let you "hook into" React state and lifecycle features from function components. The most common hooks are useState for managing component state and useEffect for side effects.

Custom hooks are a powerful pattern for extracting component logic into reusable functions. By following the rules of hooks and composing them effectively, you can build highly maintainable React applications.

Advanced Patterns

useReducer is perfect for complex state logic. useCallback and useMemo help optimize performance. useContext eliminates prop drilling. Together, these tools give you everything you need to manage state without external libraries.`,
    category: "React",
    excerpt: "Advanced patterns and best practices for building scalable state management with React Hooks.",
    tags: ["React", "Hooks", "State"],
    author: "Wonder",
    userType: "admin",
    featured: false,
  },
  {
    title: "Node.js Performance Optimization: Scaling Your Applications",
    content: `Building fast Node.js applications requires understanding performance optimization techniques. This guide covers everything from profiling to clustering.

Identifying Bottlenecks

The first step is measuring. Use built-in tools like the Node.js profiler and clinic.js to identify bottlenecks. Common issues include blocking the event loop, excessive memory allocation, and inefficient database queries.

Clustering and Scaling

Clustering allows you to take advantage of multi-core systems by spawning multiple Node.js instances. Combined with load balancing strategies like PM2 and caching with Redis, you can dramatically increase throughput and reliability.

Always profile before optimizing — measure twice, cut once. The most impactful optimizations are rarely where you expect them.`,
    category: "Node.js",
    excerpt: "Scaling your applications with profiling, clustering, and advanced performance techniques.",
    tags: ["Node.js", "Performance", "Backend"],
    author: "Wonder",
    userType: "admin",
    featured: false,
  },
  {
    title: "MongoDB Aggregation Pipeline: Advanced Data Analysis",
    content: `MongoDB's aggregation pipeline is a powerful tool for data transformation and analysis. Let's explore advanced techniques for complex queries.

Pipeline Basics

The aggregation pipeline processes documents through stages: $match filters documents, $group aggregates values, $project reshapes documents, and $sort orders results.

Advanced Techniques

Complex pipelines can join collections with $lookup, create new fields with $addFields, and process arrays with $unwind. The $facet stage allows multi-dimensional grouping in a single pipeline pass.

Mastering these stages allows you to perform sophisticated analytics directly in the database, reducing application complexity and improving performance by keeping computation close to the data.`,
    category: "MongoDB",
    excerpt: "Unlock the full power of MongoDB's aggregation framework for complex data transformations.",
    tags: ["MongoDB", "Database", "Aggregation"],
    author: "Wonder",
    userType: "admin",
    featured: true,
  },
  {
    title: "Express.js Middleware: Building Robust API Layers",
    content: `Middleware is the backbone of Express.js applications. This guide covers building custom middleware for authentication, logging, and error handling.

Understanding Middleware Flow

Middleware functions process requests sequentially. Each middleware can modify the request or response, call the next middleware in the chain, or terminate the chain entirely with a response.

Building Custom Middleware

Authentication middleware verifies JWT tokens before protected routes are accessed. Validation middleware checks request data against schemas. Rate limiting middleware prevents abuse. Error handling middleware catches and formats errors consistently.

Composing these layers thoughtfully creates a robust, maintainable API that's both secure and easy to debug.`,
    category: "Express.js",
    excerpt: "Build custom middleware for authentication, logging, validation, and elegant error handling.",
    tags: ["Express.js", "API", "Middleware"],
    author: "Wonder",
    userType: "admin",
    featured: false,
  },
  {
    title: "WebSockets vs REST APIs: Real-Time Communication Guide",
    content: `Real-time applications require different approaches than traditional REST APIs. Let's compare WebSockets and REST APIs for real-time communication.

The REST Model

REST APIs use a request-response model — the client requests data and the server responds. This works well for most applications but requires polling for real-time updates, which is inefficient and adds latency.

WebSockets: Persistent Connections

WebSockets establish a persistent, bidirectional connection between client and server. This enables real-time features like live chat, collaborative editing, and live dashboards without the overhead of repeated HTTP requests.

When to Use Each

Use REST for standard CRUD operations, public APIs, and cacheable resources. Use WebSockets for real-time notifications, collaborative tools, live data feeds, and multiplayer games. Many modern applications use both.`,
    category: "Architecture",
    excerpt: "A comprehensive comparison for choosing the right real-time architecture for your application.",
    tags: ["WebSockets", "REST", "Real-time"],
    author: "Wonder",
    userType: "admin",
    featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URI);
    console.log('✦ Connected to MongoDB');
    await Post.deleteMany({ userType: 'admin' });
    console.log('✦ Cleared existing seed posts');
    const created = await Post.insertMany(POSTS);
    console.log(`✦ Seeded ${created.length} posts successfully`);
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
