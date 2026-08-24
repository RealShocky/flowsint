import { useState, useCallback, useRef, useEffect } from 'react'
import type { GraphNode } from '@/types'

// react-force-graph's own onLinkHover/edge.source/edge.target types are
// `string | number | NodeObject` — the library mutates a plain edge's
// source/target from an id string into the actual node object once it's
// resolved the graph, and callers see whichever form depending on timing.
// Same duality already reflected on GraphNode.links in types/graph.ts.
type HoveredLink = { source: string | { id: string }; target: string | { id: string } }

const linkEndpointId = (endpoint: string | { id: string }): string =>
  typeof endpoint === 'object' ? endpoint.id : endpoint

export const useHighlightState = () => {
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set())
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set())
  const [hoverNode, setHoverNode] = useState<string | null>(null)
  const hoverFrameRef = useRef<number | null>(null)

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    if (hoverFrameRef.current) {
      cancelAnimationFrame(hoverFrameRef.current)
    }

    hoverFrameRef.current = requestAnimationFrame(() => {
      const newHighlightNodes = new Set<string>()
      const newHighlightLinks = new Set<string>()

      if (node) {
        newHighlightNodes.add(node.id)
        if (node.neighbors) {
          node.neighbors.forEach((neighbor) => {
            newHighlightNodes.add(neighbor.id)
          })
        }
        if (node.links) {
          node.links.forEach((link) => {
            newHighlightLinks.add(`${linkEndpointId(link.source)}-${linkEndpointId(link.target)}`)
          })
        }
        setHoverNode(node.id)
      } else {
        setHoverNode(null)
      }

      setHighlightNodes(newHighlightNodes)
      setHighlightLinks(newHighlightLinks)
      hoverFrameRef.current = null
    })
  }, [])

  const handleLinkHover = useCallback((link: HoveredLink | null) => {
    if (hoverFrameRef.current) {
      cancelAnimationFrame(hoverFrameRef.current)
    }

    hoverFrameRef.current = requestAnimationFrame(() => {
      const newHighlightNodes = new Set<string>()
      const newHighlightLinks = new Set<string>()

      if (link) {
        const sourceId = linkEndpointId(link.source)
        const targetId = linkEndpointId(link.target)
        newHighlightLinks.add(`${sourceId}-${targetId}`)
        newHighlightNodes.add(sourceId)
        newHighlightNodes.add(targetId)
      }

      setHoverNode(null)
      setHighlightNodes(newHighlightNodes)
      setHighlightLinks(newHighlightLinks)
      hoverFrameRef.current = null
    })
  }, [])

  const clearHighlights = useCallback(() => {
    setHighlightNodes(new Set())
    setHighlightLinks(new Set())
    setHoverNode(null)
  }, [])

  useEffect(() => {
    return () => {
      if (hoverFrameRef.current) {
        cancelAnimationFrame(hoverFrameRef.current)
      }
    }
  }, [])

  return {
    highlightNodes,
    highlightLinks,
    hoverNode,
    handleNodeHover,
    handleLinkHover,
    clearHighlights
  }
}
