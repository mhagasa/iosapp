import React from 'react';
import { KVRoomManager } from './KVRoomManager';

const roomManager = new KVRoomManager();
const KVRoomContext = React.createContext(roomManager);

export default KVRoomContext;