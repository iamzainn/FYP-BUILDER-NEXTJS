'use client';

import { NavItem, NavbarStyles, fontFamilies } from '../types';

interface TextSettingsProps {
  selectedItem: NavItem;
  navStyles: NavbarStyles;
  itemId: string;
  updateItemStyle: (itemId: string, styleKey: string, value: string) => void;
}

export default function TextSettings({
  selectedItem,
  navStyles,
  itemId,
  updateItemStyle
}: TextSettingsProps) {
  return (
    <div className="mb-6 border-b border-gray-700 pb-4">
      <h4 className="text-sm font-medium text-blue-300 mb-3">Text Styling</h4>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Text Color
        </label>
        <input
          type="color"
          value={selectedItem.styles.color || navStyles.color}
          onChange={(e) => updateItemStyle(itemId, 'color', e.target.value)}
          className="w-full h-10 rounded border"
          title="Choose text color"
          placeholder="#000000"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Font Size (px)
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={parseInt(selectedItem.styles.fontSize?.replace('px', '') || '16')}
          onChange={(e) => updateItemStyle(itemId, 'fontSize', `${e.target.value}px`)}
          className="w-full"
          title="Font size in pixels"
          placeholder="16"
        />
        <span className="text-sm text-gray-400">
          {selectedItem.styles.fontSize}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Font Family
        </label>
        <select
          value={selectedItem.styles.fontFamily || navStyles.fontFamily}
          onChange={(e) => updateItemStyle(itemId, 'fontFamily', e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          title="Select font family"
        >
          <option value="">Use Global Font</option>
          {fontFamilies.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Text Align
        </label>
        <select
          value={selectedItem.styles.textAlign || 'left'}
          onChange={(e) => updateItemStyle(itemId, 'textAlign', e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          title="Select text alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Text Transform
        </label>
        <select
          value={selectedItem.styles.textTransform || 'none'}
          onChange={(e) => updateItemStyle(itemId, 'textTransform', e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          title="Select text transformation"
        >
          <option value="none">None</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Letter Spacing (px)
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={parseFloat(selectedItem.styles.letterSpacing?.replace('px', '') || '0')}
          onChange={(e) => updateItemStyle(itemId, 'letterSpacing', `${e.target.value}px`)}
          className="w-full"
          title="Letter spacing in pixels"
          placeholder="0"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Line Height
        </label>
        <input
          type="range"
          min="0.8"
          max="2"
          step="0.1"
          value={parseFloat(selectedItem.styles.lineHeight || '1.2')}
          onChange={(e) => updateItemStyle(itemId, 'lineHeight', e.target.value)}
          className="w-full"
          title="Line height multiplier"
          placeholder="1.2"
        />
      </div>
    </div>
  );
} 