const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'created_project',
        'updated_project',
        'created_task',
        'updated_task',
        'moved_task',
        'completed_task',
        'deleted_task',
        'added_member',
        'removed_member',
        'added_comment',
        'attached_file',
      ],
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    details: {
      type: String,
      default: '',
    },
    fromColumn: {
      type: String,
      default: null,
    },
    toColumn: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Activity', activitySchema);
