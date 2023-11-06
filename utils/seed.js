const mongoose = require('mongoose');
const { User, Thought, Reaction } = require('./models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const seedData = async () => {
  try {
    // Remove existing data
    await User.deleteMany({});
    await Thought.deleteMany({});
    await Reaction.deleteMany({});

    // Create users
    const users = await User.create([
      {
        username: 'bigbill',
        email: 'bill@example.com',
      },
      {
        username: 'bigjen',
        email: 'jen@example.com',
      },
    ]);

    // Create thoughts
    const thoughts = await Thought.create([
      {
        thoughtText: 'Gee whiz.',
        username: 'bigbill',
        reactions: [],
      },
      {
        thoughtText: 'Coding...',
        username: 'bigjen',
        reactions: [],
      },
    ]);

    // Create reactions
    const reactions = await Reaction.create([
      {
        reactionBody: 'You could say that...',
        username: 'bigben',
      },
      {
        reactionBody: 'I do not mind this.',
        username: 'bigjen',
      },
    ]);

    // Associate thoughts with users and reactions with thoughts
    users[0].thoughts.push(thoughts[0]);
    users[1].thoughts.push(thoughts[1]);
    thoughts[0].reactions.push(reactions[0]);
    thoughts[1].reactions.push(reactions[1]);

    await Promise.all(users.map((user) => user.save()));
    await Promise.all(thoughts.map((thought) => thought.save()));
    await Promise.all(reactions.map((reaction) => reaction.save()));

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
