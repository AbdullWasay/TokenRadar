import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  subscriptionStatus: 'free' | 'premium'
  subscriptionExpiry?: Date
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    subscriptionStatus: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    subscriptionExpiry: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Prevent re-compilation during development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
