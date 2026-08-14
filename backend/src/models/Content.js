const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Source name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Article URL is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true, // Indexed for sorting feeds by published date efficiently
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for sorting feed items by publishedAt descending
contentSchema.index({ publishedAt: -1, _id: -1 });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
