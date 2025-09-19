"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, AlertTriangle, Loader2 } from 'lucide-react';
import type { MindmapData, MindmapNode } from '@/lib/types';
import { Button } from '../ui/button';

interface MindmapProps {
  data: MindmapData | null;
  error: string | null;
  isLoading: boolean;
  onNodeClick: (prompt: string) => void;
}

interface PositionedNode extends MindmapNode {
  position: { x: number; y: number };
}

export function Mindmap({ data, error, isLoading, onNodeClick }: MindmapProps) {
  const [positionedNodes, setPositionedNodes] = useState<PositionedNode[]>([]);
  const containerSize = { width: 500, height: 500 }; // Virtual size

  useEffect(() => {
    if (data && data.nodes) {
      // Simple circular layout algorithm
      const radius = containerSize.width / 2.5;
      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;
      const angleStep = (2 * Math.PI) / (data.nodes.length || 1);

      const nodesWithPositions = data.nodes.map((node, index) => {
        const angle = index * angleStep;
        return {
          ...node,
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          },
        };
      });
      setPositionedNodes(nodesWithPositions);
    } else {
      setPositionedNodes([]);
    }
  }, [data]);

  const edges = useMemo(() => {
    if (!data || !data.edges || positionedNodes.length === 0) return [];
    
    return data.edges.map(edge => {
      const sourceNode = positionedNodes.find(n => n.data.id === edge.data.source);
      const targetNode = positionedNodes.find(n => n.data.id === edge.data.target);
      if (!sourceNode || !targetNode) return null;
      return {
        id: edge.data.id || `${edge.data.source}-${edge.data.target}`,
        x1: sourceNode.position.x,
        y1: sourceNode.position.y,
        x2: targetNode.position.x,
        y2: targetNode.position.y,
      };
    }).filter(Boolean);
  }, [data, positionedNodes]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="font-semibold">Generating Mind Map...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-destructive p-4">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="font-semibold">Mind Map Error</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (!data || positionedNodes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
          <BrainCircuit className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold">Mind Map Panel</h3>
          <p className="text-sm">Your conversation summary will appear here.</p>
        </div>
      );
    }

    return (
      <svg viewBox={`0 0 ${containerSize.width} ${containerSize.height}`} width="100%" height="100%">
        <g>
          {edges.map((edge) => (
            edge && <motion.line
              key={edge.id}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </g>
        <g>
          {positionedNodes.map((node, index) => (
            <motion.g
              key={node.data.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              transform={`translate(${node.position.x}, ${node.position.y})`}
            >
              <foreignObject x="-50" y="-25" width="100" height="50">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full h-full text-xs whitespace-normal leading-tight text-center p-1 bg-background hover:bg-accent"
                    onClick={() => onNodeClick(`Tell me more about ${node.data.label}`)}
                  >
                    {node.data.label}
                  </Button>
              </foreignObject>
            </motion.g>
          ))}
        </g>
      </svg>
    );
  };

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? 'loading' : error ? 'error' : 'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
