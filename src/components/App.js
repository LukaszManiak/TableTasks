function App() {
  return (
    <div className="app">
      <NavBar />
      <AllTables />
      <Table />
    </div>
  );
}

function NavBar() {
  return (
    <nav className="navBar">
      <h2>TableTasks</h2>
      <button className="addTask">+Add New Task</button>
    </nav>
  );
}

function AllTables() {
  return (
    <div className="allTables">
      <p>ALL TABLES (3)</p>
      <ul>
        <li>Store website</li>
        <li>Rebuild project</li>
        <li>Launch steps</li>
      </ul>
      <button>+Add New Table</button>
    </div>
  );
}

function Table() {
  return (
    <div className="table">
      <h2>Store website</h2>
      <div>
        <div>TODO (3)</div>
        <div className="taskBox">
          <p>Build UI for main page</p>
          <p>0 of 3 done</p>
        </div>
      </div>
      <div>
        <div>IN PROGRESS (6)</div>
        <div className="taskBox">
          <p>Build UI for main page</p>
          <p>0 of 3 done</p>
        </div>
      </div>
      <div>
        <div>DONE (9)</div>
        <div className="taskBox">
          <p>Build UI for main page</p>
          <p>0 of 3 done</p>
        </div>
      </div>
    </div>
  );
}

function TaskBox({ title, onClick, tasks }) {
  return (
    <div className="taskBox">
      <p>{title}</p>
      {/* <p>0 of 3 done</p> */}
    </div>
  );
}

function AddNewTask() {
  return (
    <div className="addNewTask">
      <h3>Add New Task</h3>
      <label>Title</label>
      <input placeHolder="Platform setup" />
      <label>Description</label>
      <input placeHolder="Description" />
      <label>Status</label>
      <input placeHolder="Description" />

      <button>Add Task</button>
    </div>
  );
}

export default App;
