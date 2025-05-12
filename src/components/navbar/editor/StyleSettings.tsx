'use client';

import { NavItem } from '../types';

interface StyleSettingsProps {
  selectedItem: NavItem;
  itemId: string;
  updateItemStyle: (itemId: string, styleKey: string, value: string) => void;
}

export default function StyleSettings({
  selectedItem,
  itemId,
  updateItemStyle
}: StyleSettingsProps) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-blue-300 mb-3">Additional Styling</h4>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Background Color
        </label>
        <input
          type="color"
          value={selectedItem.styles.backgroundColor || 'transparent'}
          onChange={(e) => updateItemStyle(itemId, 'backgroundColor', e.target.value)}
          className="w-full h-10 rounded border"
          title="Choose background color"
          placeholder="#ffffff"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Opacity
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={parseFloat(selectedItem.styles.opacity || '1')}
          onChange={(e) => updateItemStyle(itemId, 'opacity', e.target.value)}
          className="w-full"
          title="Set opacity level (0-1)"
          placeholder="1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Z-Index
        </label>
        <input
          type="number"
          value={parseInt(selectedItem.styles.zIndex || '1')}
          onChange={(e) => updateItemStyle(itemId, 'zIndex', e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          title="Z-index value"
          placeholder="1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Box Shadow
        </label>
        <input
          type="text"
          value={selectedItem.styles.boxShadow || 'none'}
          onChange={(e) => updateItemStyle(itemId, 'boxShadow', e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          placeholder="e.g., 0 2px 4px rgba(0,0,0,0.1)"
          title="CSS box shadow value"
        />
      </div>
    </div>
  );
} 