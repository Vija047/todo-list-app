import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: string;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (updated: Task[]) => {
    setTasks(updated);
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditedText(task.text);
  };

  const submitEdit = (id: string) => {
    if (!editedText.trim()) {
      Alert.alert('Validation', 'Task cannot be empty');
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editedText } : task
    );

    saveTasks(updatedTasks);
    setEditingId(null);
    setEditedText('');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      case 'low': return '#45B7D1';
      default: return '#6C7CE7';
    }
  };

  const renderItem = ({ item, index }: { item: Task; index: number }) => (
    <View style= { [styles.taskCard, { marginTop: index === 0 ? 0 : 12 }]} >
      { editingId === item.id ? (
        <View style= { styles.editContainer } >
    <TextInput
            value={ editedText }
  onChangeText = { setEditedText }
  style = { styles.editInput }
  placeholder = "Update your task..."
  placeholderTextColor = "#A0A0A0"
  multiline
  autoFocus
    />
    <View style={ styles.editActions }>
      <TouchableOpacity 
              onPress={
    () => {
      setEditingId(null);
      setEditedText('');
    }
  }
  style = { [styles.actionButton, styles.cancelButton]}
    >
    <Ionicons name="close" size = { 18} color = "#FF6B6B" />
      </TouchableOpacity>
      < TouchableOpacity
  onPress = {() => submitEdit(item.id)
}
style = { [styles.actionButton, styles.saveButton]}
  >
  <Ionicons name="checkmark" size = { 18} color = "#4CAF50" />
    </TouchableOpacity>
    </View>
    </View>
      ) : (
  <View style= { styles.taskContent } >
  <View style={ styles.taskInfo }>
    <View style={ styles.taskHeader }>
      <View style={ [styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }] } />
        < Text style = {
          [
          styles.taskText,
          item.completed && styles.completedText
          ]} >
          { item.text }
          </Text>
          </View>
{
  item.priority && (
    <View style={ [styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }] }>
      <Text style={ [styles.priorityText, { color: getPriorityColor(item.priority) }] }>
        { item.priority.toUpperCase() }
        </Text>
        </View>
            )
}
</View>
  < TouchableOpacity
onPress = {() => handleEdit(item)}
style = { styles.editButton }
activeOpacity = { 0.7}
  >
  <Ionicons name="create-outline" size = { 20} color = "#6C7CE7" />
    </TouchableOpacity>
    </View>
      )}
</View>
  );

const completedTasks = tasks.filter(task => task.completed).length;
const totalTasks = tasks.length;

return (
  <View style= { styles.container } >
  <StatusBar barStyle="light-content" backgroundColor = "#1A1A2E" />

    {/* Header Section */ }
    < View style = { styles.header } >
      <View style={ styles.headerContent }>
        <Text style={ styles.greeting }> Good day! 👋</Text>
          < Text style = { styles.title } > My Tasks </Text>

            < View style = { styles.statsContainer } >
              <View style={ styles.statCard }>
                <Text style={ styles.statNumber }> { totalTasks } </Text>
                  < Text style = { styles.statLabel } > Total </Text>
                    </View>
                    < View style = { styles.statCard } >
                      <Text style={ styles.statNumber }> { completedTasks } </Text>
                        < Text style = { styles.statLabel } > Done </Text>
                          </View>
                          < View style = { styles.statCard } >
                            <Text style={ styles.statNumber }> { totalTasks - completedTasks}</Text>
                              < Text style = { styles.statLabel } > Pending </Text>
                                </View>
                                </View>
                                </View>
                                </View>

{/* Tasks Section */ }
<View style={ styles.tasksContainer }>
  <Text style={ styles.sectionTitle }> Your Tasks </Text>

    < FlatList
data = { tasks }
keyExtractor = {(item) => item.id}
renderItem = { renderItem }
showsVerticalScrollIndicator = { false}
contentContainerStyle = { styles.listContainer }
ListEmptyComponent = {
            < View style = { styles.emptyContainer } >
  <Ionicons name="checkmark-circle-outline" size = { 80} color = "#E0E0E0" />
    <Text style={ styles.emptyTitle }> No tasks yet </Text>
      < Text style = { styles.emptySubtitle } > Add your first task to get started </Text>
        </View>
          }
        />
  </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#16213E',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 70,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6C7CE7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6C7CE7',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  taskText: {
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 22,
    flex: 1,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
    opacity: 0.7,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 20,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  editButton: {
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    fontSize: 16,
    color: '#2D3748',
    padding: 12,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FED7D7',
  },
  saveButton: {
    backgroundColor: '#F0FFF4',
    borderColor: '#C6F6D5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
  },
});