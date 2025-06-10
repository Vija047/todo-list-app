# My Tasks App

A React Native mobile application for task management with local notifications and priority settings.

## Assignment Details
- **Company**: AffWorld LLC
- **Location**: 512 ONYX TOWER 2 DUBAI INTERNET CITY DUBAI 000000
- **Deadline**: 11/06/2025
- **Position**: React Native Developer Assignment

## Project Description
This mobile application helps users manage their daily tasks with features like task prioritization, local notifications, and data persistence.

## Features
-  Task creation and management
-  Local notifications for task reminders
-  Task prioritization (High, Medium, Low)
-  Data persistence using AsyncStorage
-  Task editing capabilities
-  Task completion tracking
-  Task deletion

## Technologies Used
- React Native
- Expo Go
- Expo Notifications
- AsyncStorage
- JavaScript ES6+ & React Hooks

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd Todolist
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on device:
- Install Expo Go on your mobile device
- Scan the QR code from terminal using Expo Go

## Implementation Challenges & Solutions

1. **Notification Management**
   - Challenge: Handling notifications across platforms
   - Solution: Implemented platform-specific checks and error handling

2. **Data Persistence**
   - Challenge: Maintaining state across app restarts
   - Solution: Utilized AsyncStorage with proper error handling

3. **Priority System**
   - Challenge: Visual representation of priorities
   - Solution: Implemented color-coded border system

## Project Structure

```
Todolist/
  ├── app/
  │   └── index.tsx       # Main application file
  ├── package.json        # Dependencies
  └── README.md          # Documentation
```

## Core Functionalities

1. **Task Management**
   - Add, edit, and delete tasks
   - Mark tasks as complete
   - Set task priorities

2. **Notifications**
   - Automatic scheduling
   - Cancellation on task completion

3. **Data Persistence**
   - Local storage implementation
   - State management

## Future Enhancements
- Task categories
- Due dates
- Task sharing capabilities
- Dark mode support

## Contact Information
For any queries regarding this assignment submission, please contact [Your Name]
