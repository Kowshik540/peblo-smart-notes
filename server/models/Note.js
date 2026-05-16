import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, default: 'Untitled Note' },
    content: { type: String, default: '' },
    tags: [String],
    category: { type: String, default: 'General' },
    archived: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    aiSummary: String,
    actionItems: [String],
    suggestedTitle: String,
    aiUsageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);