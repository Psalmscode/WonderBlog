const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

const JWT_SECRET = process.env.JWT_SECRET || 'velour-jwt-secret';

const requireUser = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) return res.redirect('/login-choice');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch { res.redirect('/login-choice'); }
};

// Login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In — Velour', description: 'Sign in to Velour', message: null, layout: false });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { title: 'Sign In — Velour', description: '', message: 'Invalid credentials.', layout: false });
    }
    const token = jwt.sign({ userId: user._id, username: user.username, userType: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('userToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect('/');
  } catch (err) {
    res.render('login', { title: 'Sign In — Velour', description: '', message: 'An error occurred.', layout: false });
  }
});

// Register
router.get('/register', (req, res) => {
  res.render('register', { title: 'Create Account — Velour', description: 'Join Velour', message: null, layout: false });
});

router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render('register', { title: 'Create Account — Velour', description: '', message: 'Passwords do not match.', layout: false });
  }
  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.render('register', { title: 'Create Account — Velour', description: '', message: 'Username or email already taken.', layout: false });
    }
    const user = await User.create({ username, email, password, userType: 'user' });
    const token = jwt.sign({ userId: user._id, username: user.username, userType: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('userToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect('/');
  } catch (err) {
    res.render('register', { title: 'Create Account — Velour', description: '', message: 'Registration failed. Try again.', layout: false });
  }
});

// User Dashboard
router.get('/dashboard', requireUser, async (req, res) => {
  const posts = await Post.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.render('dashboard', { title: 'My Posts — Velour', description: 'Your Velour dashboard', posts, username: req.user.username });
});

// Add Post
router.get('/user/add-post', requireUser, (req, res) => {
  res.render('user/add-post', { title: 'New Post — Velour', description: 'Create a new post', message: null });
});

router.post('/user/add-post', requireUser, async (req, res) => {
  const { title, content, category, excerpt, tags } = req.body;
  try {
    await Post.create({
      title, content, category: category || 'General',
      excerpt: excerpt || content.substring(0, 140) + '...',
      tags: tags ? tags.split(',').map(t => t.trim()) : [category],
      author: req.user.username, userId: req.user.userId, userType: 'user',
    });
    res.redirect('/dashboard');
  } catch {
    res.render('user/add-post', { title: 'New Post — Velour', description: '', message: 'Failed to create post.' });
  }
});

// Edit Post
router.get('/user/edit-post/:id', requireUser, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!post) return res.redirect('/dashboard');
  res.render('user/edit-post', { title: 'Edit Post — Velour', description: '', post, message: null });
});

router.put('/user/edit-post/:id', requireUser, async (req, res) => {
  const { title, content, category, excerpt, tags } = req.body;
  await Post.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { title, content, category, excerpt, tags: tags ? tags.split(',').map(t => t.trim()) : [] }
  );
  res.redirect('/dashboard');
});

// Delete Post
router.delete('/user/delete-post/:id', requireUser, async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.redirect('/dashboard');
});

module.exports = router;
