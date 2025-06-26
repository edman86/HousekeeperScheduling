import { mockTasks } from '@/mock/mockTasks';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title: string;
  duration: number;
  deadline: string;
  hotelApartment: string;
  assignedTo: number | null;
}

type TaskState = {
  tasks: Task[];
  originalTasks: Task[];
  isTasksLoading: boolean;
  isTasksError: boolean;
  isSubmitting: boolean;
  isSubmitError: boolean;
  isModified: boolean;
}

const initialState: TaskState = {
  tasks: [],
  originalTasks: [],
  isTasksLoading: false,
  isTasksError: false,
  isSubmitting: false,
  isSubmitError: false,
  isModified: false
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTasks;
      
      // Real API implementation would be:
      // const response = await fetch(`{API_URL}/tasks`);
      // if (!response.ok) throw new Error('Failed to fetch tasks');
      // return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch tasks');
    }
  }
);

export const submitTasks = createAsyncThunk(
  'tasks/submitTasks',
  async (tasks: Task[], { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return tasks;
      
      // Real API implementation would be:
      // const response = await fetch(`${API_URL}/tasks`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(tasks)
      // });
      // if (!response.ok) throw new Error('Failed to submit tasks');
      // return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to submit tasks');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    assignTask(state, action: PayloadAction<{ taskId: string; housekeeperId: number | null }>) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.assignedTo = action.payload.housekeeperId;
        state.isModified = true;
      }
    },
    reorderTasks(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex >= 0 && 
        toIndex >= 0 && 
        fromIndex < state.tasks.length && 
        toIndex < state.tasks.length &&
        fromIndex !== toIndex
      ) {
        // Remove the task from its original position
        const [movedTask] = state.tasks.splice(fromIndex, 1);
        // Insert it at the new position
        state.tasks.splice(toIndex, 0, movedTask);
        state.isModified = true;
      }
    },
    cancelChanges(state) {
      // Reset tasks to the original state
      state.tasks = JSON.parse(JSON.stringify(state.originalTasks));
      state.isModified = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isTasksLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isTasksLoading = false;
        state.tasks = action.payload;
        // Store a deep copy of the original tasks for reset functionality
        state.originalTasks = JSON.parse(JSON.stringify(action.payload));
        state.isModified = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.isTasksLoading = false;
        state.isTasksError = true;
      })
      
      .addCase(submitTasks.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitTasks.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.tasks = action.payload;
        // Update the original tasks after successful submission
        state.originalTasks = JSON.parse(JSON.stringify(action.payload));
        state.isModified = false;
      })
      .addCase(submitTasks.rejected, (state) => {
        state.isSubmitting = false;
        state.isSubmitError = true;
      });
  }
})

export const { assignTask, reorderTasks, cancelChanges } = taskSlice.actions;
export default taskSlice.reducer;