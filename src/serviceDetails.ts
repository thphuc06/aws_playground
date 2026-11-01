import type {ServiceDetail} from './serviceDetailTypes';
import {toolsDetails} from './serviceDetailsTools';
import {coreDetails} from './serviceDetailsCore';
import {platformDetails} from './serviceDetailsPlatform';
export const serviceDetails:ServiceDetail[]=[...coreDetails,...toolsDetails,...platformDetails];
export function getServiceDetail(id:string){return serviceDetails.find(detail=>detail.serviceId===id)}
