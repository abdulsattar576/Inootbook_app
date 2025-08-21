import { Article } from '../models/Article.js';
import { Comment } from '../models/Comment.js';

export async function createArticle(req, res) {
  try {
    const { title, content, featuredImageUrl } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing fields' });
    const article = await Article.create({
      title,
      content,
      author: req.user.id,
      featuredImageUrl,
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, content, featuredImageUrl } = req.body;
    const updated = await Article.findByIdAndUpdate(
      id,
      { title, content, featuredImageUrl },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    await Comment.deleteMany({ article: id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listArticles(req, res) {
  try {
    const { q, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filters = q ? { title: { $regex: q, $options: 'i' } } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Article.find(filters)
        .populate('author', 'username role')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Article.countDocuments(filters),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getArticle(req, res) {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('author', 'username role')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username role' } });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const analytics = {
      totalLikes: article.likes.length,
      totalComments: article.comments.length,
      totalViews: article.viewCount,
    };
    res.json({ article, analytics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function toggleLike(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const hasLiked = article.likes.some((u) => u.toString() === userId);
    if (hasLiked) {
      article.likes = article.likes.filter((u) => u.toString() !== userId);
    } else {
      article.likes.push(userId);
    }
    await article.save();
    res.json({ likes: article.likes.length, liked: !hasLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const comment = await Comment.create({ content, author: req.user.id, article: id });
    article.comments.push(comment._id);
    await article.save();
    const populated = await comment.populate('author', 'username role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function analyticsSummary(_req, res) {
  try {
    const articles = await Article.find().select('likes comments viewCount');
    const totals = articles.reduce(
      (acc, a) => {
        acc.likes += a.likes.length;
        acc.comments += a.comments.length;
        acc.views += a.viewCount;
        return acc;
      },
      { likes: 0, comments: 0, views: 0 }
    );
    res.json(totals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

