import type {ServiceDetail} from './serviceDetailTypes';
import {toolsDetails} from './serviceDetailsTools';
import {coreDetails} from './serviceDetailsCore';
import {platformDetails} from './serviceDetailsPlatform';
import {c03Details} from './serviceDetailsC03';
export const serviceDetails:ServiceDetail[]=[...coreDetails,...toolsDetails,...platformDetails,...c03Details];
export function getServiceDetail(id:string){return serviceDetails.find(detail=>detail.serviceId===id)}
