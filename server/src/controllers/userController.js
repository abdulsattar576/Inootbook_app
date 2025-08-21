import { User } from '../models/User.js';

export async function listUsers(_req, res) {
  try {
    const users = await User.find().select('username email role createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function usersCount(_req, res) {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

