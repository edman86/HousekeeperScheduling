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
  const renderCardContent = () => (
    <View style={styles.task}>
      <View style={styles.taskContent}>
        <View style={styles.taskTitleContainer}>
          <Text style={styles.taskOrder}>{isAssigned && typeof index === 'number' ? `${index + 1}. ` : ''}</Text>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
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
    </View>
  );

  return (
    <DraxView
      receptive
      dragPayload={JSON.stringify(task)}
      draggable
      draggingStyle={styles.dragging}
      onReceiveDragDrop={onReceiveDragDrop}
      renderContent={renderCardContent}
    />
  );
}

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskOrder: {
    marginRight: 2,
    fontSize: 14,
  },
  taskTitle: { 
    fontSize: 14, 
    fontWeight: '500',
    color: '#000',
  },
  dragging: {
    opacity: 0.7,
    backgroundColor: '#ffffff',
    borderColor: '#3498db',
    borderWidth: 2,
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
