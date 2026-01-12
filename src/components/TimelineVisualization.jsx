import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function TimelineVisualization({ timeline, state = 'New' }) {
  if (!timeline) {
    return null;
  }

  const { startDate, dueDate, completedDate, events } = timeline;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Determine completion status
  const isWorkItemCompleted = state === 'Done' || state === 'Completed' || completedDate !== null;

  const calculateProgress = () => {
    // If work item is completed, show 100%
    if (isWorkItemCompleted) return 100;
    
    // If not completed, show time-based progress if dates exist
    if (!startDate || !dueDate) return 0;
    
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(dueDate);
    
    if (today < start) return 0;
    if (today > end) return 100; // If overdue, show 100 to indicate urgency
    
    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
  };

  const daysRemaining = () => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const progress = calculateProgress();
  const daysLeft = daysRemaining();
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isCompleted = isWorkItemCompleted;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
        <Clock size={14} /> Timeline
      </div>

      {/* Timeline Summary */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-blue-50 p-2 rounded text-xs">
          <div className="text-gray-600">Start</div>
          <div className="font-semibold text-gray-800">{formatDate(startDate)}</div>
        </div>
        <div className={`p-2 rounded text-xs ${isCompleted ? 'bg-green-50' : isOverdue ? 'bg-red-50' : 'bg-yellow-50'}`}>
          <div className="text-gray-600">Due</div>
          <div className="font-semibold text-gray-800">{formatDate(dueDate)}</div>
          {daysLeft !== null && (
            <div className={`text-xs mt-1 ${isCompleted ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
              {isCompleted ? '✓ Completed' : isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
            </div>
          )}
        </div>
        <div className="bg-green-50 p-2 rounded text-xs">
          <div className="text-gray-600">Completed</div>
          <div className="font-semibold text-gray-800">{isCompleted ? formatDate(completedDate) : 'Pending'}</div>
        </div>
      </div>

      {/* Progress Bar */}
      {startDate && dueDate && !isCompleted && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-semibold text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline Events */}
      {events && events.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">Activity</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {events.map((event, idx) => (
              <div key={idx} className="flex gap-2 text-xs">
                <div className="flex-shrink-0 pt-0.5">
                  {event.event === 'completed' ? (
                    <CheckCircle size={12} className="text-green-600" />
                  ) : event.event === 'overdue' ? (
                    <AlertCircle size={12} className="text-red-600" />
                  ) : (
                    <Clock size={12} className="text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700 capitalize">{event.event}</span>
                    <span className="text-gray-500">{formatDate(event.date)}</span>
                  </div>
                  {event.description && (
                    <div className="text-gray-600 mt-0.5">{event.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
