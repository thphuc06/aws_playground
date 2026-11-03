import {computeDataHandbooks} from './serviceHandbookComputeData';
import {securityNetworkHandbooks} from './serviceHandbookSecurityNetwork';
import {deliveryAIHandbooks} from './serviceHandbookDeliveryAI';

export const serviceHandbooks = [...computeDataHandbooks, ...securityNetworkHandbooks, ...deliveryAIHandbooks];
export const getServiceHandbook = (serviceId: string) => serviceHandbooks.find(item => item.serviceId === serviceId);
const searchText = new Map(serviceHandbooks.map(guide => [guide.serviceId, [
  ...guide.operatingModel.map(item => item.title + ' ' + item.detail),
  ...guide.configuration.map(item => item.name + ' ' + item.choice + ' ' + item.tradeoff),
  ...guide.security.map(item => item.title + ' ' + item.detail),
  ...guide.troubleshooting.map(item => item.symptom + ' ' + item.likelyCause),
].join(' ').toLowerCase()]));
export const getServiceHandbookSearchText = (serviceId: string) => searchText.get(serviceId) ?? '';
