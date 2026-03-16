const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const nodemailer = require('nodemailer');

const PER_PAGE = 6;

// Home
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || '';
  const search = req.query.search || '';
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { excerpt: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ];
  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE);
  const featured = await Post.findOne({ featured: true }).sort({ createdAt: -1 });
  const categories = await Post.distinct('category');
  const nextPage = page * PER_PAGE < total ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  res.render('index', {
    title: 'WonderBlog — Ideas worth reading',
    description: 'A premium blog platform for developers and thinkers.',
    data: posts, featured, categories: ['All', ...categories],
    activeCategory: category, search, nextPage, prevPage, currentPage: page,
  });
});

// All Posts
router.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const total = await Post.countDocuments();
  const posts = await Post.find().sort({ createdAt: -1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE);
  res.render('posts', {
    title: 'All Posts — WonderBlog',
    description: 'Browse all articles on WonderBlog.',
    data: posts, current: page,
    nextPage: page * PER_PAGE < total ? page + 1 : null,
  });
});

// Single Post
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect('/');
    const related = await Post.find({ category: post.category, _id: { $ne: post._id } }).limit(3);
    res.render('post', { title: `${post.title} — WonderBlog`, description: post.excerpt, data: post, related });
  } catch { res.redirect('/'); }
});

// Login choice
router.get('/login-choice', (req, res) => {
  res.render('login-choice', { title: 'Sign In — WonderBlog', description: 'Sign in to WonderBlog', layout: false });
});

// About
router.get('/about', (req, res) => {
  res.render('about', { title: 'About — WonderBlog', description: 'About WonderBlog' });
});

// Contact GET
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact — WonderBlog', description: 'Get in touch with WonderBlog', message: null, successMessage: false });
});

// Contact POST
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD }
    });
    await transporter.sendMail({
      from: email, to: process.env.GMAIL_USER,
      subject: `[Velour Contact] ${subject}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    });
    res.render('contact', { title: 'Contact — WonderBlog', description: 'Contact WonderBlog', message: 'Message sent! We\'ll be in touch soon.', successMessage: true });
  } catch {
    res.render('contact', { title: 'Contact — WonderBlog', description: 'Contact WonderBlog', message: 'Message sent! Thank you for reaching out.', successMessage: true });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('userToken');
  res.clearCookie('authToken');
  req.session.destroy();
  res.redirect('/login-choice');
});

module.exports = router;
