import ActionButtons from '@/components/ActionButtons';
import TaskCard from '@/components/TaskCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHousekeepers } from '@/store/slices/housekeeperSlice';
import { Task, assignTask, cancelChanges, fetchTasks, reorderTasks, submitTasks } from '@/store/slices/taskSlice';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const dispatch = useAppDispatch();
  const { 
    tasks, 
    isTasksLoading, 
    isTasksError, 
    isModified, 
    isSubmitting 
  } = useAppSelector((state) => state.tasks);
  const { housekeepers, isHousekeepersLoading, isHousekeepersError } = useAppSelector((state) => state.housekeepers);
  const [selectedHousekeeperId, setSelectedHousekeeperId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchHousekeepers());
  }, [dispatch]);

  useEffect(() => {
    if (housekeepers.length > 0 && selectedHousekeeperId === null) {
      setSelectedHousekeeperId(housekeepers[0].id);
    }
  }, [housekeepers, selectedHousekeeperId]);

  const assignedTasks = tasks.filter((t) => t.assignedTo === selectedHousekeeperId);
  const unassignedTasks = tasks.filter((t) => t.assignedTo === null);

  const handleAssignTask = (taskId: string) => {
    dispatch(assignTask({ taskId, housekeeperId: selectedHousekeeperId }));
  };

  const handleUnassignTask = (taskId: string) => {
    dispatch(assignTask({ taskId, housekeeperId: null }));
  };

  const handleSubmit = () => {
    dispatch(submitTasks(tasks));
  };

  const handleCancel = () => {
    dispatch(cancelChanges());
  };

  const handleReceiveDrop = (index: number) => ({ dragged }: any) => {
    const draggedTask: Task = JSON.parse(dragged.payload);

    // Case 1: Task is coming from the unassigned list
    if (!draggedTask.assignedTo) {
      handleAssignTask(draggedTask.id);
      return;
    }

    // Case 2: Task is already assigned and being reordered
    const fromIndex = assignedTasks.findIndex((t) => t.id === draggedTask.id);
    const toIndex = index;

    // Only reorder if it's a different position (not dropping on itself)
    if (fromIndex !== -1 && fromIndex !== toIndex) {
      // We need to find the global indices in the full tasks array
      // since the reorderTasks action works with the global task list
      dispatch(
        reorderTasks({
          // Find the source task's index in the global tasks array
          fromIndex: tasks.findIndex((t) => t.id === draggedTask.id),
          // Find the target position's task index in the global tasks array
          toIndex: tasks.findIndex((t) => t.id === assignedTasks[toIndex].id),
        })
      );
    }
  };

  if (isTasksLoading || isHousekeepersLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </SafeAreaView>
    );
  }

  if (isTasksError || isHousekeepersError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text>{isTasksError || isHousekeepersError}</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraxProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.header}>🏨 Housekeeper Schedule</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Housekeeper</Text>
              <FlatList
                data={housekeepers}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.housekeeperList}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    style={[styles.housekeeperItem, selectedHousekeeperId === item.id && styles.selectedHousekeeper]}
                    onPress={() => setSelectedHousekeeperId(item.id)}
                  >
                    <Text style={[styles.housekeeperName, selectedHousekeeperId === item.id && styles.selectedHousekeeperText]}>
                      {item.name}
                    </Text>
                  </Pressable>
                )}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assigned Tasks</Text>
              {assignedTasks.length === 0 && (
                <DraxView
                  receptive
                  style={styles.dropZone}
                  onReceiveDragDrop={({ dragged }) => {
                    const task: Task = JSON.parse(dragged.payload);
                    if (!task.assignedTo) {
                      handleAssignTask(task.id);
                    }
                  }}
                >
                  <Text style={styles.emptyText}>Drop tasks here</Text>
                </DraxView>
              )}

              {assignedTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  isAssigned={true}
                  onUnassign={handleUnassignTask}
                  onReceiveDragDrop={handleReceiveDrop(index)}
                />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Unassigned Tasks</Text>
              <DraxView
                receptive
                style={styles.unassignedContainer}
                onReceiveDragDrop={({ dragged }) => {
                  const task: Task = JSON.parse(dragged.payload);
                  handleUnassignTask(task.id);
                }}
              >
                {unassignedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isAssigned={false}
                    onAssign={handleAssignTask}
                  />
                ))}
                {!unassignedTasks.length && <Text style={styles.emptyText}>No unassigned tasks</Text>}
              </DraxView>
            </View>
          </ScrollView>

          <ActionButtons
            isModified={isModified}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </SafeAreaView>
      </DraxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 
    'center', alignItems: 
    'center' 
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  errorText: { 
    fontSize: 18, 
    color: 'red', 
    marginBottom: 10 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
    marginTop: 10,
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 10 
  },
  housekeeperList: { 
    paddingVertical: 10 
  },
  housekeeperItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 120,
    alignItems: 'center',
  },
  selectedHousekeeper: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  housekeeperName: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  selectedHousekeeperText: { 
    color: '#ffffff', 
    fontWeight: '600' 
  },
  dropZone: {
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    backgroundColor: '#f9fff9',
  },
  unassignedContainer: {
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    backgroundColor: '#f0f8ff',
  },
  emptyText: { 
    color: '#aaa', 
    textAlign: 'center', 
    padding: 10 
  },
});
