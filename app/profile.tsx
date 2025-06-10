import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Optional: for gradient backgrounds

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTaskCount(parsed.length);
        setCompletedCount(parsed.filter((t) => t.completed).length);
      }
    };

    loadTasks();
  }, []);

  const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
  const pendingCount = taskCount - completedCount;

  return (
    <ScrollView style= { styles.container } showsVerticalScrollIndicator = { false} >
      {/* Header Section */ }
      < View style = { styles.header } >
        <View style={ styles.avatarContainer }>
          <View style={ styles.avatar }>
            <Text style={ styles.avatarText }> U </Text>
              </View>
              < View style = { styles.onlineIndicator } />
                </View>
                < Text style = { styles.title } > Your Profile </Text>
                  < Text style = { styles.subtitle } > Task Management Overview </Text>
                    </View>

  {/* Stats Cards Container */ }
  <View style={ styles.statsContainer }>
    {/* Total Tasks Card */ }
    < View style = { [styles.statCard, styles.totalCard]} >
      <View style={ styles.statIconContainer }>
        <Text style={ styles.statIcon }>📋</Text>
          </View>
          < View style = { styles.statContent } >
            <Text style={ styles.statNumber }> { taskCount } </Text>
              < Text style = { styles.statLabel } > Total Tasks </Text>
                </View>
                </View>

  {/* Completed Tasks Card */ }
  <View style={ [styles.statCard, styles.completedCard] }>
    <View style={ styles.statIconContainer }>
      <Text style={ styles.statIcon }>✅</Text>
        </View>
        < View style = { styles.statContent } >
          <Text style={ styles.statNumber }> { completedCount } </Text>
            < Text style = { styles.statLabel } > Completed </Text>
              </View>
              </View>

  {/* Pending Tasks Card */ }
  <View style={ [styles.statCard, styles.pendingCard] }>
    <View style={ styles.statIconContainer }>
      <Text style={ styles.statIcon }>⏳</Text>
        </View>
        < View style = { styles.statContent } >
          <Text style={ styles.statNumber }> { pendingCount } </Text>
            < Text style = { styles.statLabel } > Pending </Text>
              </View>
              </View>
              </View>

  {/* Progress Section */ }
  <View style={ styles.progressSection }>
    <Text style={ styles.progressTitle }> Completion Rate </Text>
      < View style = { styles.progressBarContainer } >
        <View style={ styles.progressBarBackground }>
          <View 
              style={
    [
      styles.progressBarFill,
      { width: `${completionRate}%` }
    ]
  } 
            />
    </View>
    < Text style = { styles.progressText } > { completionRate } % </Text>
      </View>
      </View>

  {/* Achievement Section */ }
  <View style={ styles.achievementSection }>
    <Text style={ styles.achievementTitle }> Quick Stats </Text>
      < View style = { styles.achievementGrid } >
        <View style={ styles.achievementItem }>
          <Text style={ styles.achievementIcon }>🎯</Text>
            < Text style = { styles.achievementText } > Focus Level </Text>
              < Text style = { styles.achievementValue } >
                { completionRate > 80 ? 'High' : completionRate > 50 ? 'Medium' : 'Low'
}
</Text>
  </View>
  < View style = { styles.achievementItem } >
    <Text style={ styles.achievementIcon }>📈</Text>
      < Text style = { styles.achievementText } > Productivity </Text>
        < Text style = { styles.achievementValue } >
          { completedCount > 10 ? 'Excellent' : completedCount > 5 ? 'Good' : 'Getting Started'}
</Text>
  </View>
  </View>
  </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsContainer: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  totalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressSection: {
    margin: 20,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    minWidth: 45,
  },
  achievementSection: {
    margin: 20,
    marginTop: 0,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  achievementGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  achievementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});