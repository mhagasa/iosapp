import React from 'react';
import { KVRentManager } from './KVRentManager';

const rentManager = new KVRentManager();
const KVRentContext = React.createContext(rentManager);

export default KVRentContext;