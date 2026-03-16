const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const JWT_SECRET = process.env.JWT_SECRET || 'velour-jwt-secret';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'Author';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Orooluwaiyanumi';

const requireAdmin = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.redirect('/admin');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userType !== 'admin') return res.redirect('/admin');
    req.admin = decoded;
    next();
  } catch { res.redirect('/admin'); }
};

// Admin Login Page
router.get('/', (req, res) => {
  res.render('admin/contact', { title: 'Admin Login — WonderBlog', description: 'Admin access', message: null, layout: false });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username, userType: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/contact', { title: 'Admin Login — WonderBlog', description: '', message: 'Invalid admin credentials.', layout: false });
});

router.get('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.redirect('/login-choice');
});

// Dashboard
router.get('/dashboard', requireAdmin, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  const totalPosts = posts.length;
  const authors = [...new Set(posts.map(p => p.author))].length;
  const categories = [...new Set(posts.map(p => p.category))].length;
  const featured = posts.filter(p => p.featured).length;
  res.render('admin/dashboard', {
    title: 'Admin Dashboard — WonderBlog', description: 'Manage WonderBlog',
    data: posts, username: req.admin.username,
    stats: { totalPosts, authors, categories, featured }
  });
});

// Add Post
router.get('/add-post', requireAdmin, (req, res) => {
  res.render('admin/add-post', { title: 'New Post — WonderBlog', description: '', message: null });
});

router.post('/add-post', requireAdmin, async (req, res) => {
  const { title, content, category, excerpt, tags, featured } = req.body;
  await Post.create({
    title, content, category: category || 'General',
    excerpt: excerpt || content.substring(0, 140) + '...',
    tags: tags ? tags.split(',').map(t => t.trim()) : [category],
    author: req.admin.username, userType: 'admin',
    featured: !!featured,
  });
  res.redirect('/admin/dashboard');
});

// Edit Post
router.get('/edit-post/:id', requireAdmin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.redirect('/admin/dashboard');
  res.render('admin/edit-post', { title: 'Edit Post — WonderBlog', description: '', post, message: null });
});

router.put('/edit-post/:id', requireAdmin, async (req, res) => {
  const { title, content, category, excerpt, tags, featured } = req.body;
  await Post.findByIdAndUpdate(req.params.id, {
    title, content, category, excerpt,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    featured: !!featured,
  });
  res.redirect('/admin/dashboard');
});

// Delete Post
router.delete('/delete-post/:id', requireAdmin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
});

module.exports = router;
