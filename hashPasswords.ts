import mongoose from 'mongoose';
import UserModel from './src/models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function hashExistingPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    const users = await UserModel.find({});
    console.log(`Found ${users.length} users`);

    for (let user of users) {
      if (!user.password.startsWith('$2b$')) { // Check if password is not already hashed
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await UserModel.updateOne({ _id: user._id }, { password: hashedPassword });
        console.log(`Hashed password for user: ${user.email}`);
      } else {
        console.log(`Password already hashed for user: ${user.email}`);
      }
    }

    console.log('All passwords processed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

hashExistingPasswords();