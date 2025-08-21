import { Comment } from '../models/Comment.js';
import { Article } from '../models/Article.js';

export async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate('author', 'id role');
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const isOwner = comment.author._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
    await comment.deleteOne();
    await Article.updateOne({ _id: comment.article }, { $pull: { comments: comment._id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

