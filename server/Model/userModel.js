import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Enter your name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Enter Your Email"],
      lowercase: true,
      index: true, // Index for faster user lookups
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Enter Your Password"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"], // Consistent lowercase values
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Saving password before saving user cred
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified or new
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Below is the solution of OverwriteModelError: Cannot overwrite User model once compiled.
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
