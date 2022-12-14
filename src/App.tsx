import { ErrorInfo } from "remult";
import { useEffect, useState } from "react";
import { remult } from "./common";
import { Task } from "./shared/Task";

const taskRepo = remult.repo(Task);

async function fetchTasks(hideCompleted: boolean) {
  return taskRepo.find({
     limit: 20,
     orderBy: { completed: "asc" },
     where: { completed: hideCompleted ? false : undefined }
  });
}

function App() {
  const [tasks, setTasks] = useState<(Task & { error?: ErrorInfo<Task> })[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);


  useEffect(() => {
    fetchTasks(hideCompleted).then(setTasks);
 }, [hideCompleted]);

  const addTask = () => {
    setTasks([...tasks, new Task()])
  };

  return (
    <div>
       <input
        type="checkbox"
        checked={hideCompleted}
        onChange={e => setHideCompleted(e.target.checked)} /> Hide Completed
      <hr />
      {tasks.map(task => {
        const handleChange = (values: Partial<Task>) => {
          setTasks(tasks.map(t => t === task ? { ...task, ...values } : t));
        };

        const saveTask = async () => {
          try {
            const savedTask = await taskRepo.save(task);
            setTasks(tasks.map(t => t === task ? savedTask : t));
          } catch (error: any) {
            alert(error.message);
            setTasks(tasks.map(t => t === task ? { ...task, error } : t));
          }
        }

        const deleteTask = async () => {
          await taskRepo.delete(task);
          setTasks(tasks.filter(t => t !== task));
        };

        return (
          <div key={task.id}>
            <input type="checkbox"
              checked={task.completed}
              onChange={e => handleChange({ completed: e.target.checked })} />
            <input
              value={task.title}
              onChange={e => handleChange({ title: e.target.value })} />
            {task.error?.modelState?.title}
            <button onClick={saveTask}>Save</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        );
      })}
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default App;
