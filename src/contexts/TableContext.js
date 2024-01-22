import { createContext, useContext, useEffect, useReducer } from "react";

// creating table context
const TableContext = createContext();

const initialState = {
  // tables
  tables: [],
  // currently selected table
  selectedTable: null,
  //isNewTaskOpen
  isNewTaskOpen: false,
  isNewTableOpen: false,

  // task selection
  isTaskSelected: false,
  currTask: null,
  mode: "dark",
};

function reducer(state, action) {
  switch (action.type) {
    //opening task modal form
    case "newTaskOpen":
      return { ...state, isNewTaskOpen: !state.isNewTaskOpen };
    //opening table modal form
    case "newTableOpen":
      return { ...state, isNewTableOpen: !state.isNewTableOpen };
    // add task
    case "addTask":
      // type of the task
      const actionType = action.payload.type;
      // currently opened table
      const currTable = state.tables
        .map((table) => table.title)
        .indexOf(state.selectedTable);

      // checking for tables and selected table
      if (!state.tables.length || !state.selectedTable) return state;

      if (actionType === "todo") {
        // iterating through all tables and adding given task only to the opened one
        return {
          ...state,
          tables: state.tables.map((table, i) => {
            if (i === currTable) {
              return {
                ...table,
                todoTasks: [...table.todoTasks, action.payload],
              };
            }
            return table;
          }),
        };
      } else if (actionType === "inprogress") {
        return {
          ...state,
          tables: state.tables.map((table, i) => {
            if (i === currTable) {
              return {
                ...table,
                inProgress: [...table.inProgress, action.payload],
              };
            }
            return table;
          }),
        };
      } else if (actionType === "done") {
        return {
          ...state,
          tables: state.tables.map((table, i) => {
            if (i === currTable) {
              return {
                ...table,
                doneTasks: [...table.doneTasks, action.payload],
              };
            }
            return table;
          }),
        };
      } else {
        return state;
      }

    // update task type
    // case "updateTaskType":
    //   const { taskId, taskType, newType } = action.payload;

    // add table
    case "addTable":
      const tableTitle = action.payload.title;
      // if the title input is empty return
      if (tableTitle === "") return state;
      // if there is already table with the same name return
      if (state.tables.map((table) => table.title).includes(tableTitle))
        return state;
      // returning table with the given title and tasks array
      return {
        ...state,
        tables: [...state.tables, action.payload],
      };
    // table selection
    case "tableSelection":
      return { ...state, selectedTable: action.payload };

    // selected task details open
    case "taskSelection":
      return {
        ...state,
        isTaskSelected: !state.isTaskSelected,
        currTask: action.payload,
      };
    // deleting task
    case "taskDelete":
      const { type, id } = action.payload;

      const selectedTable = state.tables.find(
        (table) => table.title === state.selectedTable
      );
      // return state if there is no selected table
      if (!selectedTable) {
        return state;
      }
      // checking type of the table task
      if (type === "todo") {
        // deleting selected task from the todoTasks
        const updatedTodoTasks = selectedTable.todoTasks.filter(
          (task) => task.id !== id
        );

        // setting state
        return {
          ...state,
          isTaskSelected: false,
          tables: state.tables.map((table) =>
            table.title === state.selectedTable
              ? { ...table, todoTasks: updatedTodoTasks }
              : table
          ),
        };
      } else if (type === "inprogress") {
        // deleting selected task from the inprogress Tasks
        const updatedInProgressTasks = selectedTable.inProgress.filter(
          (task) => task.id !== id
        );

        // setting state
        return {
          ...state,
          isTaskSelected: false,
          tables: state.tables.map((table) =>
            table.title === state.selectedTable
              ? { ...table, inProgress: updatedInProgressTasks }
              : table
          ),
        };
      } else if (type === "done") {
        // deleting selected task from the Done Tasks
        const updatedDoneTasks = selectedTable.doneTasks.filter(
          (task) => task.id !== id
        );

        // setting state
        return {
          ...state,
          isTaskSelected: false,
          tables: state.tables.map((table) =>
            table.title === state.selectedTable
              ? { ...table, doneTasks: updatedDoneTasks }
              : table
          ),
        };
      } else {
        return state;
      }
    // delete table
    case "tableDelete":
      // table id
      const deleteTableId = action.payload;
      console.log(action.payload);
      // filtered tables
      const newTables = state.tables.filter(
        (table) => table.id !== deleteTableId
      );

      return { ...state, tables: newTables };

    case "restartApp":
      return { ...initialState };

    //working version of mode toggler
    case "toggleMode":
      const newMode = state.mode === "dark" ? "light" : "dark";

      if (newMode === "dark") {
        document.documentElement.classList.add("invertMode");
      } else {
        document.documentElement.classList.remove("invertMode");
      }

      return { ...state, mode: newMode };
    default:
      throw new Error("Unkown");
  }
}

function TableProvider({ children }) {
  // getting optional data from localStorage / initial state
  const savedData = JSON.parse(localStorage.getItem("data")) || initialState;
  const [
    {
      tables,
      isNewTaskOpen,
      isNewTableOpen,
      selectedTable,
      isTaskSelected,
      currTask,
    },
    dispatch,
  ] = useReducer(reducer, savedData);

  // effect that selects the newly created table
  useEffect(
    function () {
      dispatch({
        type: "tableSelection",
        payload: tables[tables.length - 1]?.title,
      });
    },
    [tables.length]
  );

  // setting localStorage
  useEffect(
    function () {
      localStorage.setItem(
        "data",
        JSON.stringify({
          tables,
          isNewTaskOpen,
          isNewTableOpen,
          selectedTable,
          isTaskSelected,
          currTask,
        })
      );
    },
    [
      tables,
      isNewTaskOpen,
      selectedTable,
      isNewTableOpen,
      isTaskSelected,
      currTask,
    ]
  );

  return (
    <TableContext.Provider
      value={{
        tables,
        isNewTaskOpen,
        selectedTable,
        isNewTableOpen,
        isTaskSelected,
        currTask,
        dispatch,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

function useTable() {
  const context = useContext(TableContext);
  if (context === undefined)
    throw new Error("The context was called in the wrong place");
  return context;
}

export { TableProvider, useTable };
