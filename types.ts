
import React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tools: Tool[];
}

export interface NavLink {
    name: string;
    path: string;
}
