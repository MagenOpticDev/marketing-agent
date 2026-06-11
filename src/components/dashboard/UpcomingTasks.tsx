import Link from "next/link";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";

interface Task {
  id: string;
  title: string;
  due_date?: string;
  priority: string;
  is_completed: boolean;
  lead_id?: string;
}

const priorityColors = {
  high: "text-red-600 bg-red-50",
  medium: "text-yellow-600 bg-yellow-50",
  low: "text-green-600 bg-green-50",
};

const priorityLabels = {
  high: "גבוה",
  medium: "בינוני",
  low: "נמוך",
};

export default function UpcomingTasks({ tasks }: { tasks: Task[] }) {
  const today = new Date().toDateString();

  return (
    <Card padding="none">
      <div className="p-6 border-b border-slate-100">
        <CardHeader className="mb-0">
          <CardTitle>משימות קרובות</CardTitle>
          <Link
            href="/leads"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            כל המשימות
          </Link>
        </CardHeader>
      </div>
      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon className="h-12 w-12" />}
          title="אין משימות קרובות"
          description="כל המשימות בוצעו!"
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const isToday = task.due_date
              ? new Date(task.due_date).toDateString() === today
              : false;
            const isOverdue = task.due_date
              ? new Date(task.due_date) < new Date() && !isToday
              : false;
            const priority = task.priority as keyof typeof priorityColors;

            return (
              <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <ClockIcon
                      className={cn(
                        "h-4 w-4",
                        isOverdue ? "text-red-500" : isToday ? "text-orange-500" : "text-slate-400"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.due_date && (
                        <span
                          className={cn(
                            "text-xs",
                            isOverdue ? "text-red-500 font-medium" : isToday ? "text-orange-500 font-medium" : "text-slate-400"
                          )}
                        >
                          {isOverdue ? "באיחור · " : isToday ? "היום · " : ""}
                          {formatDate(task.due_date)}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          priorityColors[priority] || "bg-slate-100 text-slate-600"
                        )}
                      >
                        {priorityLabels[priority] || task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
