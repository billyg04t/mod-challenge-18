const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .sort({ createdAt: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        return res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        return res.json({ message: 'Thought created successfully!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        return res.json({ message: 'Thought updated successfully!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete thought by id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        return User.findOneAndUpdate(
          { thoughts: params.thoughtId },
          { $pull: { thoughts: params.thoughtId } }
        );
      })
      .then(() => res.json({ message: 'Thought deleted successfully!' }))
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
