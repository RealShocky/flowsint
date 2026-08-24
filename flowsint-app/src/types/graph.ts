import type * as LucideIcons from 'lucide-react'

// Field shape is genuinely dynamic — driven by whichever custom type schema
// the backend defines for this node's nodeType, not a fixed TS shape. Callers
// narrow with typeof/Array.isArray/an explicit cast at the point they read a
// specific field, same as any other JSON-from-the-backend value.
export type NodeProperties = {
  [key: string]: unknown
}

export const flagColors = {
  red: 'text-red-400 fill-red-200',
  orange: 'text-orange-400 fill-orange-200',
  blue: 'text-blue-400 fill-blue-200',
  green: 'text-green-400 fill-green-200',
  yellow: 'text-yellow-400 fill-yellow-200'
} as const

type flagColor = keyof typeof flagColors

// Same as NodeProperties above — backend-defined, not statically shaped.
export type NodeMetadata = {
  [key: string]: unknown
}

export type NodeShape = 'circle' | 'square' | 'hexagon' | 'triangle'

export type GraphNode = {
  id: string
  nodeType: string
  nodeLabel: string
  nodeProperties: NodeProperties
  nodeSize: number
  nodeColor: string | null
  nodeIcon: keyof typeof LucideIcons | null
  nodeImage: string | null
  nodeFlag: flagColor | null
  nodeShape: NodeShape | null
  nodeMetadata: NodeMetadata
  x: number
  y: number
  val?: number
  // Populated by transformGraphData (graph-data-transformer.ts) after the
  // initial fetch — every consumer only ever reads .id off a neighbor and
  // .source.id/.target.id off a link, so that's all this declares. Not
  // GraphNode[]/GraphEdge[]: neighbors briefly holds react-force-graph's
  // own runtime node objects mid-transform, and a fully accurate type would
  // have to be self-referential for no benefit nothing here reads.
  neighbors?: { id: string }[]
  // source/target start as plain id strings on the raw edge and get mutated
  // into node-object references by react-force-graph after it renders —
  // both forms show up here depending on when a consumer reads it (see the
  // `typeof x === 'object' ? x.id : x` guard used elsewhere for the edge
  // itself).
  links?: { source: string | { id: string }; target: string | { id: string } }[]
}

export type GraphEdge = {
  source: GraphNode['id']
  target: GraphNode['id']
  date?: string
  id: string
  label: string
  caption?: string
  type?: string
  weight?: number
  confidence_level?: number | string
}

export type PathNode = {
  id: string
  label: string
  node_type: string
}

export type PathEdge = {
  id: string
  source: string
  target: string
  label: string
  caption?: string
}

export type Path = {
  ids: string[]
  nodes: PathNode[]
  edges: PathEdge[]
}
