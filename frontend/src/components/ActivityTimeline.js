import React from 'react';

const ActivityTimeline = ({ activities, onClose }) => {
  const getActionLabel = (action) => {
    const labels = {
      created_project: 'Created project',
      updated_project: 'Updated project',
      created_task: 'Created task',
      updated_task: 'Updated task',
      moved_task: 'Moved task',
      deleted_task: 'Deleted task',
      added_comment: 'Added comment',
      added_member: 'Added member',
      removed_member: 'Removed member',
    };
    return labels[action] || action;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-matte-blue-800 to-dark-blue-800 rounded-xl p-8 w-full max-w-2xl max-h-96 overflow-y-auto border border-matte-blue-600 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Activity Timeline</h2>
          <button
            onClick={onClose}
            className="text-matte-blue-300 hover:text-white text-3xl transition"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-matte-blue-300 text-center py-8">No activities yet</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id} className="border-l-4 border-accent-cyan pl-4 py-3 bg-matte-blue-700 bg-opacity-50 rounded-r-lg">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {activity.user?.name} <span className="text-accent-cyan">{getActionLabel(activity.action)}</span>
                    </p>
                    <p className="text-sm text-matte-blue-200">{activity.details}</p>
                    {activity.fromColumn && activity.toColumn && (
                      <p className="text-sm text-matte-blue-300 mt-1">
                        ↳ From <span className="text-accent-blue">"{activity.fromColumn}"</span> to <span className="text-accent-cyan">"{activity.toColumn}"</span>
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-matte-blue-400 whitespace-nowrap">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
