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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    fetchTasks(hideCompleted).then(setTasks);
 }, [hideCompleted]);

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

        const saveTask = () => {
          taskRepo.save(task);
       };

        return (
          <div key={task.id}>
            <input type="checkbox"
              checked={task.completed}
              onChange={e => handleChange({ completed: e.target.checked })} />
            <input
              value={task.title}
              onChange={e => handleChange({ title: e.target.value })} />
            <button onClick={saveTask}>Save</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
