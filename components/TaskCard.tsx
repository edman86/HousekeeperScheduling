import { Task } from '@/store/slices/taskSlice';
import { AntDesign } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DraxView } from 'react-native-drax';

interface TaskCardProps {
  task: Task;
  index?: number;
  isAssigned: boolean;
  onAssign?: (taskId: string) => void;
  onUnassign?: (taskId: string) => void;
  onReceiveDragDrop?: (args: any) => void;
}

export default function TaskCard({ 
  task, 
  index, 
  isAssigned, 
  onAssign, 
  onUnassign, 
  onReceiveDragDrop 
}: TaskCardProps) {
  return (
    <DraxView
      receptive={true}
      dragPayload={JSON.stringify(task)}
      draggable
      draggingStyle={styles.dragging}
      style={styles.task}
      onReceiveDragDrop={onReceiveDragDrop}
    >
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>
          {isAssigned && typeof index === 'number' ? `${index + 1}. ` : ''}
          {task.title}
        </Text>
        <Text style={styles.taskDetails}>
          {task.hotelApartment} • {task.duration} min
        </Text>
      </View>
      
      {isAssigned ? (
        <Pressable 
          style={styles.unassignButton}
          onPress={() => onUnassign && onUnassign(task.id)}
        >
          <AntDesign name="close" size={16} color="white" />
        </Pressable>
      ) : (
        <Pressable 
          style={styles.assignButton}
          onPress={() => onAssign && onAssign(task.id)}
        >
          <AntDesign name="plus" size={16} color="white" />
        </Pressable>
      )}
    </DraxView>
  );
}

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  taskDetails: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
  dragging: {
    opacity: 0.7,
    backgroundColor: '#e0e0e0',
    borderColor: '#3498db',
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  assignButton: {
    backgroundColor: '#4caf50',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unassignButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});