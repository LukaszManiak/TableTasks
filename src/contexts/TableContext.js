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
  // something wrong alert
  wrongAlert: { isShown: false, msg: "" },
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
      if (!state.tables.length || !state.selectedTable)
        return {
          state,
        };

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
    case "taskTypeUpdate":
      const { taskToChangeType, newType } = action.payload;

      const tableToUpdate = state.tables
        .map((table) => table.title)
        .indexOf(state.selectedTable);

      // finding currTusk type
      let taskColumn = setTaskColumnType(state.currTask.type);

      // column where to push task
      let newTaskColumn = setTaskColumnType(newType);

      return {
        ...state,
        tables: state.tables.map((table, i) => {
          if (i === tableToUpdate) {
            return {
              ...table,
              [taskColumn]: table[taskColumn].filter(
                (task) => task.id !== taskToChangeType
              ),
              [newTaskColumn]: [
                ...table[newTaskColumn],
                { ...state.currTask, type: newType },
              ],
            };
          }
          return table;
        }),
        currTask: {
          ...state.currTask,
          type: newType,
        },
      };

    // subtask update
    case "subtaskUpdate":
      const { taskToEnter, subToChangeId } = action.payload;

      const tableToEnter = state.tables
        .map((table) => table.title)
        .indexOf(state.selectedTable);

      // finding currTusk type
      let taskColumnToEnter = setTaskColumnType(state.currTask.type);

      // subtasks array to update
      const subtasksToChange = state.tables[tableToEnter][
        taskColumnToEnter
      ].filter((task) => task.id === taskToEnter)[0].subtasks;

      // updating value of certain subtask
      const updatedSubTasks = subtasksToChange.map((sub) => {
        if (sub.subId === subToChangeId) {
          return { ...sub, checkedSub: !sub.checkedSub };
        } else {
          return sub;
        }
      });

      // checked subtasks
      const checkedSubtasks = updatedSubTasks.filter(
        (sub) => sub.checkedSub === true
      ).length;

      // checking in what stage is our task
      let taskColumnToChange;
      let typeOfNewTask;
      if (checkedSubtasks === updatedSubTasks.length) {
        taskColumnToChange = "doneTasks";
        typeOfNewTask = "done";
      } else if (checkedSubtasks === 0) {
        taskColumnToChange = "todoTasks";
        typeOfNewTask = "todo";
      } else if (
        checkedSubtasks > 0 &&
        checkedSubtasks < updatedSubTasks.length
      ) {
        taskColumnToChange = "inProgress";
        typeOfNewTask = "inprogress";
      } else {
        return;
      }

      return {
        ...state,
        tables: state.tables.map((table, i) => {
          if (i === tableToEnter) {
            return {
              ...table,
              [taskColumnToEnter]: table[taskColumnToEnter].filter(
                (task) => task.id !== taskToEnter
              ),
              [taskColumnToChange]: [
                ...table[taskColumnToEnter].filter(
                  (task) => task.id !== taskToEnter
                ),
                {
                  ...state.currTask,
                  type: typeOfNewTask,
                  subtasks: updatedSubTasks,
                },
              ],
            };
          }
          return table;
        }),
        currTask: {
          ...state.currTask,
          type: typeOfNewTask,
          subtasks: updatedSubTasks,
        },
      };

    // add table
    case "addTable":
      const tableTitle = action.payload.title;

      // returning table with the given title and tasks array
      return {
        ...state,
        tables: [...state.tables, action.payload],
        selectedTable: tableTitle,
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

    case "newTableSelection":
      return {
        ...state,
        selectedTable: action.payload,
      };

    // delete table
    case "tableDelete":
      // table id
      const deleteTableId = action.payload;

      // filtered tables
      const newTables = state.tables.filter(
        (table) => table.id !== deleteTableId
      );

      return {
        ...state,
        tables: newTables,
      };

    // add new note to the table
    case "addNote":
      const ourTable = state.tables
        .map((table) => table.title)
        .indexOf(state.selectedTable);
      // checking for tables and selected table
      if (!state.tables.length || !state.selectedTable) return state;

      return {
        ...state,
        tables: state.tables.map((table, i) => {
          if (i === ourTable) {
            return {
              ...table,
              notes: [...table.notes, { ...action.payload }],
            };
          }
          return table;
        }),
      };

    // delete Note
    case "deleteNote":
      const currentlySelectedTable = state.tables
        .map((table) => table.title)
        .indexOf(state.selectedTable);

      return {
        ...state,
        tables: state.tables.map((table, i) => {
          const newTables = table.notes.filter(
            (note) => note.id !== action.payload
          );
          if (i === currentlySelectedTable) {
            return {
              ...table,
              notes: [...newTables],
            };
          }
          return table;
        }),
      };

    case "restartApp":
      return { ...initialState };

    //working version of mode toggler
    case "toggleMode":
      const newMode = state.mode === "dark" ? "light" : "dark";
      const htmlElement = document.documentElement;

      htmlElement.dataset.theme = newMode;

      return { ...state, mode: newMode };

    case "alertUser":
      return {
        ...state,
        wrongAlert: {
          ...state.wrongAlert,
          isShown: true,
          msg: action.payload,
        },
      };

    // hiding alert box
    case "hideAlertBox":
      return {
        ...state,
        wrongAlert: {
          ...state.wrongAlert,
          isShown: false,
          msg: "",
        },
      };

    default:
      throw new Error("Unkown error");
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
      wrongAlert,
      selectedTable,
      isTaskSelected,
      currTask,
      mode,
    },
    dispatch,
  ] = useReducer(reducer, savedData);

  // selecting last array when length is changed
  // CHECK IT LATER
  /* eslint-disable */
  useEffect(() => {
    dispatch({
      type: "newTableSelection",
      payload: tables[tables.length - 1]?.title,
    });
  }, [tables.length]);
  /* eslint-enable */

  // hide alert window after 3 seconds when it is shown
  useEffect(() => {
    if (wrongAlert?.isShown) {
      const timeout = setTimeout(() => {
        dispatch({
          type: "hideAlertBox",
        });
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [wrongAlert?.isShown]);

  // set color mode
  useEffect(() => {
    dispatch({
      type: "toggleMode",
    });
  }, []);

  // setting localStorage
  useEffect(
    function () {
      localStorage.setItem(
        "data",
        JSON.stringify({
          tables,
          isNewTaskOpen,
          isNewTableOpen,
          wrongAlert,
          selectedTable,
          isTaskSelected,
          currTask,
          mode,
        })
      );
    },
    [
      tables,
      isNewTaskOpen,
      selectedTable,
      wrongAlert,
      isNewTableOpen,
      isTaskSelected,
      currTask,
      mode,
    ]
  );

  return (
    <TableContext.Provider
      value={{
        tables,
        isNewTaskOpen,
        selectedTable,
        isNewTableOpen,
        wrongAlert,
        isTaskSelected,
        currTask,
        dispatch,
        mode,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

// helper functions

// set
function setTaskColumnType(string) {
  switch (string) {
    case "done":
      return "doneTasks";
    case "todo":
      return "todoTasks";
    case "inprogress":
      return "inProgress";
    default:
      throw new Error(`Unknown task type: ${string}`);
  }
}

function useTable() {
  const context = useContext(TableContext);
  if (context === undefined)
    throw new Error("The context was called in the wrong place");
  return context;
}

export { TableProvider, useTable };
