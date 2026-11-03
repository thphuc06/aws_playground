import {coreDeepDives} from './serviceDeepDiveCore';
import {toolsDeepDives} from './serviceDeepDiveTools';

export const serviceDeepDives = [...coreDeepDives, ...toolsDeepDives];
export const getServiceDeepDive = (serviceId: string) => serviceDeepDives.find(item => item.serviceId === serviceId);
