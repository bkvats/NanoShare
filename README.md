# NanoShare- P2P File Transfer Application 📂
## Use Live Now: https://nanoshare.vercel.app
A peer-to-peer (P2P) file transfer application that enables users to share files directly without relying on a central server for file storage. Users can send files using a unique 6-digit access code, ensuring secure and fast file sharing.

## 🚀 Features

- **Direct Peer-to-Peer Transfers**: File transfer directly between users using WebRTC.
- **6-Digit Access Code**: Simplified code-based connection for secure file sharing.
- **Multiple Receivers**: Share files with multiple receivers simultaneously.
- **Dynamic Speed Optimization**: Optimized transfer speeds using multiple data channels and dynamic throttling.
- **Real-time Speed Monitoring**: Visualize transfer speeds with a dynamic UI.

## 🛠️ Technologies Used

- **Frontend**: [React.js/React-Redux/React-Router-DOM, Tailwind CSS, etc.]
- **Backend**: Node.js with Express.js (for signaling server)
- **WebRTC**: Core technology for P2P connections
- **Database**: MongoDB (for storing socket ID mappings with access codes)
- **Hosting**: [Vercel, Render]

## 🖥️ How It Works

1. **Send File**:  
   - Select one or more files to send.
   - Generate a unique 6-digit access code.
   - Share the code with the receiver.

2. **Receive File**:  
   - Enter the 6-digit access code.
   - Establish a WebRTC connection with the sender.
   - Download files as they are transferred.

3. **Multiple Connections**:  
   - A single sender can connect with multiple receivers simultaneously to share files.

## 📊 Future Enhancements

- File Sharing over local networks as well.
- End-to-end encryption for better security.
- Cross-device file sharing with QR code scanning.
- Detailed transfer analytics for advanced reporting.



Feel free to reach out to me through the following channels:
- **Email:** bkvats2394@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/bhupender-kumar-sharma-2a144a2a7
- **X:** https://x.com/BSharma10111

Let me know if you need help refining this further! 😊
