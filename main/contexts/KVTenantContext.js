import React from 'react';
import { KVTenantManager } from './KVTenantManager';

const tenantManager = new KVTenantManager();
const KVTenantContext = React.createContext(tenantManager);

export default KVTenantContext;