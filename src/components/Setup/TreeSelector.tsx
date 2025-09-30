import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  checked?: boolean;
}

interface TreeSelectorProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  showCheckboxes?: boolean;
}

export const TreeSelector: React.FC<TreeSelectorProps> = ({
  data,
  onSelect,
  showCheckboxes = true
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(new Set());

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleCheck = (nodeId: string) => {
    const newChecked = new Set(checkedNodes);
    if (newChecked.has(nodeId)) {
      newChecked.delete(nodeId);
    } else {
      newChecked.add(nodeId);
    }
    setCheckedNodes(newChecked);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isChecked = checkedNodes.has(node.id);

    return (
      <div key={node.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            paddingLeft: `${12 + level * 24}px`,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2a3441';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(node.id);
            }
            if (onSelect) {
              onSelect(node);
            }
          }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <div style={{ marginRight: '8px', color: '#64748b' }}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
          {!hasChildren && (
            <div style={{ width: '24px' }} />
          )}

          {/* Checkbox */}
          {showCheckboxes && (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                e.stopPropagation();
                toggleCheck(node.id);
              }}
              style={{
                marginRight: '12px',
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#3b82f6'
              }}
            />
          )}

          {/* Label */}
          <span style={{
            color: '#ffffff',
            fontSize: '14px',
            userSelect: 'none'
          }}>
            {node.label}
          </span>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#0f1419',
      border: '1px solid #2a3441',
      borderRadius: '6px',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      {data.map(node => renderNode(node))}
    </div>
  );
};

// Example tree data for the detailed product tree
export const productTreeData: TreeNode[] = [
  {
    id: 'tumor-agnostic',
    label: 'Tumor-Agnostic Indications',
    children: [
      {
        id: 'odaiazol-main',
        label: 'Odaiazol',
        children: []
      },
      {
        id: 'ntrk-fusion',
        label: 'NTRK fusion',
        children: []
      }
    ]
  },
  {
    id: 'braf-v600e',
    label: 'BRAF V600E-mutant tumors',
    children: []
  }
];

// Market tree data for the total market product tree
export const marketTreeData: TreeNode[] = [
  {
    id: 'total-market',
    label: 'TOTAL MARKET',
    children: [
      {
        id: 'respiratory',
        label: 'TOTAL RESPIRATORY MARKET',
        children: [
          { id: 'ics-laba', label: 'ICS LABA' },
          { id: 'ics', label: 'ICS' },
          { id: 'laba', label: 'LABA' },
          { id: 'laba-lama', label: 'LABA/LAMA' },
          { id: 'lama', label: 'LAMA' },
          { id: 'triple-sitt', label: 'TRIPLE - SITT' },
          { id: 'sama', label: 'SAMA' },
          { id: 'biologic', label: 'BIOLOGIC' }
        ]
      }
    ]
  }
];