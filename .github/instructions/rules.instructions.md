# AI Agent Instructions for Todo App

## Project Overview

This is a modern Todo List application built with Next.js 13+ (App Router), TypeScript, Tailwind CSS, Framer Motion, and Shadcn UI. The project emphasizes clean code, type safety, and smooth user interactions.

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Data Persistence**: Local Storage

## Project Structure

```
todo-app/
├── app/                  # Next.js App Router directory
├── components/
│   ├── todo/            # Todo-specific components
│   └── ui/              # Shadcn UI components
├── types/               # TypeScript type definitions
├── context/            # React Context providers
├── lib/                # Utilities and helpers
└── styles/            # Global styles and Tailwind config
```

## Key Conventions

### Component Architecture

- Components are functional and use TypeScript
- Shadcn UI components are used as base building blocks
- Components follow atomic design principles
- Each component has a single responsibility

### TypeScript Patterns

```typescript
// Use interfaces for data models
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority?: "low" | "medium" | "high";
}

// Use type for unions and specific types
type TodoFilter = "all" | "active" | "completed";
```

### State Management

- Use React Context for global state
- Keep state updates immutable
- Implement optimistic updates for better UX
- Use local state for component-specific data

### Styling Conventions

- Use Tailwind utility classes directly
- Follow mobile-first responsive design
- Maintain dark mode compatibility
- Use CSS variables for theme values

### Animation Patterns

- Use Framer Motion for transitions
- Keep animations subtle and purposeful
- Ensure animations work with reduced motion preferences

## Common Workflows

### Adding New Features

1. Create component in appropriate directory
2. Add TypeScript interfaces/types
3. Implement component logic
4. Add Tailwind styles
5. Integrate Framer Motion animations
6. Update context if needed
7. Test across screen sizes and themes

### Using Shadcn UI

```typescript
// Import components from local ui directory
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Add components using CLI
// npx shadcn@latest add [component-name]
```

### State Updates Example

```typescript
const updateTodo = (id: string, updates: Partial<Todo>) => {
  setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)));
};
```

## Important Files

- `app/layout.tsx`: Root layout with providers
- `components/todo/TodoList.tsx`: Main todo list component
- `context/TodoContext.tsx`: Global state management
- `types/index.ts`: Shared type definitions

## Development Guidelines

- Write semantic HTML
- Ensure keyboard navigation works
- Maintain mobile responsiveness
- Keep bundle size optimized
- Follow TypeScript strict mode
- Use proper error boundaries
- Implement proper loading states

## Testing

- Test component rendering
- Test user interactions
- Test state updates
- Test responsive behavior
- Test accessibility

## Performance Considerations

- Use React.memo() for expensive renders
- Implement proper list virtualization
- Optimize images and animations
- Keep context updates efficient
- Use proper key props for lists

This documentation should be updated as new patterns and conventions emerge in the project.
