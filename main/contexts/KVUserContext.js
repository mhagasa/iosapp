import React from 'react';
import { KVUserManager } from './KVUserManager';

const KVUserContext = React.createContext(new KVUserManager());

export default KVUserContext;