describe('Todo App Tests', () => {
  test('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('todo item should have a title', () => {
    const todo = { title: 'Buy groceries', completed: false };
    expect(todo.title).toBeDefined();
    expect(todo.completed).toBe(false);
  });

  test('should add two numbers correctly', () => {
    const add = (a, b) => a + b;
    expect(add(2, 3)).toBe(5);
  });
});