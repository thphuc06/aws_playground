import type {ServiceLearningModel} from './learningModel';
import {dataModels} from './learningModelsData';
import {platformModels} from './learningModelsPlatform';
import {toolsModels} from './learningModelsTools';
/** Registry contains only implemented, reviewed local lessons. Custom API/Lambda/EventBridge drawers are separate. */
export const serviceLearningModels:ServiceLearningModel[]=[...dataModels,...platformModels,...toolsModels];
export const getServiceLearningModel=(serviceId:string)=>serviceLearningModels.find(model=>model.serviceId===serviceId);
