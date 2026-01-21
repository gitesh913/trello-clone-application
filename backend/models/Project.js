const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['admin', 'member'],
          default: 'member',
        },
      },
    ],
    columns: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        position: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Default columns for new project
projectSchema.pre('save', function (next) {
  if (this.isNew && this.columns.length === 0) {
    this.columns = [
      { _id: new mongoose.Types.ObjectId(), name: 'To-Do', position: 1 },
      { _id: new mongoose.Types.ObjectId(), name: 'In-Progress', position: 2 },
      { _id: new mongoose.Types.ObjectId(), name: 'Done', position: 3 },
    ];
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
