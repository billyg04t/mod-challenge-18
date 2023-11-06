const { User } = require('../models');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v -password')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v -password')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        return res.json({ message: 'User updated successfully!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete user by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        return res.json({ message: 'User deleted successfully!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Add a friend to a user's friend list
  addFriend({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        return res.json({ message: 'Friend added successfully!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        return res.json({ message: 'Friend removed successfully!' });
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
