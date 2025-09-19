
"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, AlertTriangle, Loader2, Download, Share2 } from 'lucide-react';
import type { MindmapData, MindmapNode as AppMindmapNode } from '@/lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import cytoscape from 'cytoscape';
// You might need to add other extensions depending on the final implementation
// e.g., import dagre from 'cytoscape-dagre';
// cytoscape.use(dagre);

interface MindmapProps {
  data: MindmapData | null;
  error: string | null;
  isLoading: boolean;
  isDemo: boolean;
  onNodeClick: (prompt: string) => void;
}

export function Mindmap({ data, error, isLoading, isDemo, onNodeClick }: MindmapProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const elements = [
      ...data.nodes.map(node => ({ group: 'nodes' as const, data: { ...node, id: node.id, label: node.label }, classes: node.type })),
      ...data.edges.map(edge => ({ group: 'edges' as const, data: { source: edge.from, target: edge.to, label: edge.label } })),
    ];
    
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        { selector: 'node', style: { 'label': 'data(label)', 'text-wrap': 'wrap', 'text-max-width': '100px', 'text-valign': 'center', 'text-halign': 'center', 'background-color': '#fff', 'border-color': '#ccc', 'border-width': 2, 'color': '#333', 'font-size': '10px', 'width': 'label', 'height': 'label', 'padding': '8px' } },
        { selector: 'edge', style: { 'label': 'data(label)', 'width': 1, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'font-size': '8px', 'color': '#666' } },
        { selector: '.stage', style: { 'shape': 'round-rectangle', 'background-color': 'hsl(var(--card))', 'border-color': 'hsl(var(--primary))', 'font-weight': 'bold' } },
        { selector: '.choice', style: { 'shape': 'ellipse', 'background-color': 'hsl(var(--secondary))' } },
        { selector: '.skill', style: { 'shape': 'round-diamond', 'background-color': 'hsl(var(--accent))', 'border-width': 0, color: 'hsl(var(--accent-foreground))' } },
        { selector: '.resource', style: { 'border-style': 'dashed' } },
        { selector: '.goal', style: { 'shape': 'star', 'background-color': 'gold' } },
        { selector: 'node:selected', style: { 'border-color': 'hsl(var(--ring))', 'border-width': 3 } }
      ],
      layout: {
        name: 'breadthfirst', // or dagre if you prefer
        spacingFactor: 1.2,
        directed: true,
      },
       // Interactivity
      zoom: 1,
      pan: { x: 0, y: 0 },
      minZoom: 0.5,
      maxZoom: 2.5,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.1,
    });

    cyRef.current.on('tap', 'node', (evt) => {
        const node = evt.target;
        const metadata = node.data('metadata');
        const defaultPrompt = `Tell me more about ${node.data('label')}`;
        const suggestion = metadata?.personaPrompt || defaultPrompt;
        
        onNodeClick(suggestion);

        // Visual feedback
        cyRef.current?.$('node:selected').unselect();
        node.select();
    });

    return () => {
      cyRef.current?.destroy();
    };

  }, [data, onNodeClick]);

  const handleExport = (format: 'png' | 'svg') => {
    if (!cyRef.current) return;
    const exportFn = format === 'png' ? cyRef.current.png : cyRef.current.svg;
    const result = exportFn({ output: 'base64', full: true });
    const link = document.createElement('a');
    link.download = `way-to-nexus-mindmap.${format}`;
    link.href = format === 'svg' ? 'data:image/svg+xml;base64,' + result : result;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="font-semibold">Generating Interactive Roadmap...</p>
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
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
          <BrainCircuit className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold">Mind Map Panel</h3>
          <p className="text-sm">Your conversation summary will appear here.</p>
        </div>
      );
    }

    return (
       <>
        <div ref={containerRef} className="w-full h-full" />
        <div className="absolute top-2 right-2 flex gap-2">
            {isDemo && <Badge variant="destructive">Demo</Badge>}
            <Button variant="outline" size="icon" onClick={() => handleExport('png')} title="Export as PNG">
                <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport('svg')} title="Export as SVG">
                <Share2 className="h-4 w-4" />
            </Button>
        </div>
       </>
    );
  };

  return (
    <div className="w-full h-full relative border rounded-lg bg-background">
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
