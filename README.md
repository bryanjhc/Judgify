## **Judgify: Judge SMARTER, NOT HARDER**

---

### **Introduction**
Judgify is a tool designed to provide judges with a **seamless and stress-free experience** during hackathons or competitions. It replaces traditional note-taking and communication tools with a responsive, feature-rich, and user-friendly app to make judging more efficient.

This project was built during a 24-hour hackathon, **Hack&Roll 2025**, and received the **Quakers Commendation Award**.

---

### **Features**
1. **For Judges**:
   - Seamless navigation to assigned tables based on your current location, ensuring the shortest route to your next assignment.
   - Quick access to team data via clickable objects.
   - Streamlined scoring system and note-taking features.
   - Presentation timer to keep sessions on track.
   - Schedule management and clear agenda view.

2. **For Admins**:
   - Event creation and management.
   - Judge ID generation with automatic table assignments.
   - Real-time updates and management.

3. **General**:
   - Mobile-friendly with responsive design.
   - Offline capabilities for certain features.
   - Scalable for large hackathons.

---

### **Getting Started**
1. **Prerequisites**:
   - Install [Node.js](https://nodejs.org/).
   - Install [Expo CLI](https://docs.expo.dev/get-started/installation/).
   - Firebase account with Firestore database setup.

2. **Setup**:
   ```bash
   git clone https://github.com/bryanjhc/Judgify.git
   cd judgify
   npm install
   ```

3. **Configure Firebase**:
   - Add your `firebaseConfig` to the `db/firebaseConfig.js` file.

4. **Run the App**:
   ```bash
   expo start
   ```

5. **Testing**:
   - Install Expo Go on your device.
   - Scan the QR code generated by Expo.

---

### **Screens**
- **Selection Screen**: Login for admins and judges.
- **Judge HomePage**: Assigned table and team information.
- **Map View**: Nearest assigned table navigation.
- **Scoring Page**: Intuitive scoring and note-taking interface.
- **Admin Dashboard**: Schedule dashboard, Event creation, ID generation, and assignments.

---

### **Admin Features**
- **Event Management**: Add, update, and start events.
- **Judge ID Generation**: Automatically assign tables to judges.
- **Real-Time Updates**: Reflect changes across all devices.

---

### **User Roles**
1. **Admin**:
   - Full control over events and assignments.
2. **Judge**:
   - View and score assigned teams.
   - Add notes and submit ratings.

---

### **Contributing**
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

---

### **Future Plans**
- Add **custom layout generation**.
- Implement **live chat support** for judges.
- Improve to  **dynamic 3D routing**
