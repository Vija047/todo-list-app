import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Platform,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import Checkbox from 'expo-checkbox';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get('window');

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadTasks();
    requestNotificationPermission();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const requestNotificationPermission = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Enable notifications for reminders.');
      }
    }
  };

  const scheduleNotification = async (title) => {
    try {
      if (Device.isDevice && Platform.OS !== 'web') {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Task Reminder',
            body: `Time to complete: ${title}`,
          },
          trigger: { seconds: 60 },
        });
        return id;
      }
      return null;
    } catch (error) {
      console.warn('Failed to schedule notification:', error);
      return null;
    }
  };

  const cancelNotification = async (id) => {
    if (id) await Notifications.cancelScheduledNotificationAsync(id);
  };

  const addTask = async () => {
    if (!task.trim()) return;

    let notificationId = null;
    try {
      notificationId = await scheduleNotification(task);
    } catch (error) {
      console.warn('Could not set notification:', error);
    }

    const newTask = {
      id: uuidv4(),
      text: task,
      completed: false,
      priority,
      notificationId,
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setPriority('medium');
    setDropdownVisible(false);
  };

  const toggleComplete = async (id) => {
    const updatedTasks = tasks.map((item) => {
      if (item.id === id) {
        if (!item.completed) cancelNotification(item.notificationId);
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setTasks(updatedTasks);
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (taskToDelete?.notificationId) await cancelNotification(taskToDelete.notificationId);
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const openEditModal = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.text);
    setEditModalVisible(true);
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editTaskId ? { ...t, text: editTaskText } : t
    );
    setTasks(updatedTasks);
    setEditModalVisible(false);
    setEditTaskText('');
    setEditTaskId(null);
  };

  const saveTasks = async () => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  };

  const renderItem = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.taskItem, 
        getPriorityStyle(item.priority),
        { 
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <View style={styles.taskContent}>
        <Checkbox
          value={item.completed}
          onValueChange={() => toggleComplete(item.id)}
          style={styles.checkbox}
          color={item.completed ? '#10B981' : '#6366F1'}
        />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskText, item.completed && styles.completedText]}>
            {item.text}
          </Text>
          <View style={[styles.priorityBadge, getPriorityBadgeColor(item.priority)]}>
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          onPress={() => openEditModal(item)}
          style={[styles.actionButton, styles.editButton]}
        >
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => deleteTask(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': 
        return { 
          borderLeftWidth: 4, 
          borderLeftColor: '#EF4444',
          backgroundColor: '#FEF2F2'
        };
      case 'medium': 
        return { 
          borderLeftWidth: 4, 
          borderLeftColor: '#F59E0B',
          backgroundColor: '#FFFBEB'
        };
      case 'low': 
        return { 
          borderLeftWidth: 4, 
          borderLeftColor: '#10B981',
          backgroundColor: '#F0FDF4'
        };
      default: return {};
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
      case 'medium': return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
      case 'low': return { backgroundColor: '#D1FAE5', borderColor: '#10B981' };
      default: return { backgroundColor: '#F3F4F6', borderColor: '#9CA3AF' };
    }
  };

  const renderDropdown = () => (
    <View style={styles.dropdownMenu}>
      {['high', 'medium', 'low'].map((level) => (
        <Pressable 
          key={level} 
          onPress={() => {
            setPriority(level);
            setDropdownVisible(false);
          }}
          style={[
            styles.dropdownItem,
            priority === level && styles.selectedDropdownItem
          ]}
        >
          <View style={styles.dropdownItemContent}>
            <View style={[styles.priorityDot, getPriorityBadgeColor(level)]} />
            <Text style={[
              styles.dropdownText,
              priority === level && styles.selectedDropdownText
            ]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>Stay organized, stay productive</Text>
        
        {totalTasks > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedTasks / totalTasks) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedTasks} of {totalTasks} completed
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View style={[styles.inputSection, { opacity: fadeAnim }]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={task}
            onChangeText={setTask}
            placeholder="What needs to be done?"
            placeholderTextColor="#9CA3AF"
          />
          
          <TouchableOpacity 
            onPress={() => setDropdownVisible(!dropdownVisible)} 
            style={styles.priorityButton}
          >
            <View style={[styles.priorityDot, getPriorityBadgeColor(priority)]} />
            <Text style={styles.priorityButtonText}>{priority}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          
          {dropdownVisible && renderDropdown()}
          
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.tasksList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tasksContainer}
      />

      {/* Enhanced Edit Modal */}
      <Modal 
        visible={editModalVisible} 
        animationType="slide" 
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Task</Text>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editTaskText}
              onChangeText={setEditTaskText}
              placeholder="Update your task..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                onPress={() => setEditModalVisible(false)} 
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                onPress={saveEditedTask} 
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 55,
    right: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    minWidth: 120,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedDropdownItem: {
    backgroundColor: '#F0F9FF',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedDropdownText: {
    color: '#1D4ED8',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  tasksList: {
    flex: 1,
  },
  tasksContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#EBF8FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  editText: {
    fontSize: 16,
  },
  deleteText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width - 48,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  modalInput: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});