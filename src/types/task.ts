export type Task = {
  id: string;
  title: string;
  completed: boolean;
  subject?: string;
  dueDate?: string;
  urgent?: boolean;
};

export type TaskFilter = "all" | "active" | "completed";
