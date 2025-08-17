export const getPriorityColor = (priority: "baja" | "media" | "alta") => {
  switch (priority) {
    case "alta":
      return "bg-destructive";
    case "media":
      return "bg-amber-500";
    case "baja":
      return "bg-green-600";
  }
};

export const getPriorityVariant = (
  priority: "baja" | "media" | "alta"
): "default" | "secondary" | "destructive" | "outline" => {
  switch (priority) {
    case "alta":
      return "destructive";
    case "media":
      return "secondary";
    case "baja":
      return "default";
  }
};

export const getPriorityLabel = (priority: "baja" | "media" | "alta") => {
  switch (priority) {
    case "alta":
      return "Alta";
    case "media":
      return "Media";
    case "baja":
      return "Baja";
  }
};

export const isPastDue = (date?: string | Date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export const isDueSoon = (date?: string | Date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dueDate >= today && dueDate <= tomorrow;
};
