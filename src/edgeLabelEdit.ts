export type LabelledEdge={id:string;label?:string};
export function updateEdgeLabel<T extends LabelledEdge>(edges:T[],id:string,value:string|undefined):T[]{return edges.map(edge=>{if(edge.id!==id)return edge;if(value===undefined){const next={...edge};delete next.label;return next}return {...edge,label:value.slice(0,60)}})}
export function commitEdgeLabel<T extends LabelledEdge>(edges:T[],id:string):T[]{return edges.map(edge=>edge.id===id?{...edge,label:(edge.label||'').slice(0,60).trim()}:edge)}
