const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String, default: 'General' },
  tags: [String],
  author: { type: String, default: 'Anonymous' },
  userId: { type: String },
  userType: { type: String, default: 'user' },
  featured: { type: Boolean, default: false },
  readTime: { type: String },
}, { timestamps: true });

PostSchema.pre('save', function(next) {
  const words = this.content.split(' ').length;
  this.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
  if (!this.excerpt) {
    this.excerpt = this.content.substring(0, 140).trim() + '...';
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
