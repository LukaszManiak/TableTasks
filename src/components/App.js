import { useTable } from "../contexts/TableContext";

// components
import AddNewTable from "./Forms/AddNewTable";
import AddNewTask from "./Forms/AddNewTask";
import NavBar from "./UI/Navbar";
import AllTablesList from "./Tables/AllTablesList";
import AlertBox from "./UI/AlertBox";
import TaskModal from "./Task/TaskModal";
import Table from "./Tables/Table";

function App() {
  const { isNewTaskOpen, isNewTableOpen, isTaskSelected, wrongAlert } =
    useTable();

  return (
    <>
      <div className="entry-slide"></div>
      <div className="app">
        <NavBar />
        <AllTablesList />
        <Table />
        {wrongAlert?.isShown && <AlertBox />}
        {isNewTaskOpen && <AddNewTask />}
        {isNewTableOpen && <AddNewTable />}
        {isTaskSelected && <TaskModal />}
        {(isNewTableOpen || isNewTaskOpen || isTaskSelected) && (
          <div className="dark-bg"></div>
        )}
      </div>
    </>
  );
}

export default App;
