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
        .map((t) => t.title)
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

    // add table
    case "addTable":
      // if the title input is empty return
      if (action.payload.title === "") return state;
      // if there is already table with the same name return
      if (state.tables.map((t) => t.title).includes(action.payload.title))
        return state;
      // returning table with the given title and tasks array
      return {
        ...state,
        tables: [
          ...state.tables,
          {
            title: action.payload.title,
            // table todos
            todoTasks: [],
            inProgress: [],
            doneTasks: [],
          },
        ],
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
    // case "taskDelete":
    //   const [dType, dId] = action.payload;
    //
    //   return {
    //     state,
    //   };

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
