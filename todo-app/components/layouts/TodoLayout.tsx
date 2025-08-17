import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoList } from "@/components/todo/TodoList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodo } from "@/context/TodoContext";
import { isPastDue } from "@/lib/priority-utils";
import { CheckCircle2, Clock, Edit3 } from "lucide-react";

export default function TodoLayout() {
  const { todos, filter, setFilter } = useTodo();

  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
    overdue: todos.filter((todo) => !todo.completed && isPastDue(todo.dueDate)).length,
  };

  const progress = todos.length > 0 ? (stats.completed / todos.length) * 100 : 0;

  const getTabValue = (filter: string) => {
    switch (filter) {
      case "all":
        return "todas";
      case "active":
        return "pendientes";
      case "completed":
        return "completadas";
      case "overdue":
        return "vencidas";
      default:
        return "todas";
    }
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "todas":
        setFilter("all");
        break;
      case "pendientes":
        setFilter("active");
        break;
      case "completadas":
        setFilter("completed");
        break;
      case "vencidas":
        setFilter("overdue");
        break;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 mb-2">
              <Edit3 className="h-6 w-6 text-primary" />
              Lista de Tareas
            </CardTitle>
            <p className="text-sm text-muted-foreground">Organiza y gestiona todas tus tareas</p>
          </div>
          <CreateTodoDialog />
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Progreso general</p>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={getTabValue(filter)} onValueChange={handleTabChange} className="mt-2">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="todas" className="gap-2">
              Todas
              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">{stats.total}</span>
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="gap-2">
              <Clock className="h-4 w-4" />
              <span>Pendientes</span>
              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {stats.pending}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completadas" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completadas</span>
              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {stats.completed}
              </span>
            </TabsTrigger>
            <TabsTrigger value="vencidas" className="gap-2">
              Vencidas
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                {stats.overdue}
              </span>
            </TabsTrigger>
          </TabsList>
          <TodoList />
        </Tabs>
      </CardContent>
    </Card>
  );
}
