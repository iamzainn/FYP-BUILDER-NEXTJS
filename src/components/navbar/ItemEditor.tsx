'use client';

import { UploadButton } from '@/utils/uploadthing';
import { NavItem, NavbarStyles, fontFamilies } from './types';
import ImageSettings from './editor/ImageSettings';
import TextSettings from './editor/TextSettings';
import StyleSettings from './editor/StyleSettings';

interface ItemEditorProps {
  navItems: NavItem[];
  navStyles: NavbarStyles;
  selectedItem: string;
  updateItemPosition: (itemId: string, position: 'left' | 'center' | 'right' | 'nav') => void;
  updateItemStyle: (itemId: string, styleKey: string, value: string) => void;
  updateItemText: (itemId: string, field: 'label' | 'link', value: string) => void;
  deleteItem: (itemId: string) => void;
  updateItemImage: (itemId: string, imageUrl: string) => void;
  removeItemImage: (itemId: string) => void;
}

export default function ItemEditor({
  navItems,
  navStyles,
  selectedItem,
  updateItemPosition,
  updateItemStyle,
  updateItemText,
  deleteItem,
  updateItemImage,
  removeItemImage
}: ItemEditorProps) {
  const selectedItemData = navItems.find(item => item.id === selectedItem);
  
  if (!selectedItemData) return null;

  return (
    <div className="mb-8 border-t border-gray-700 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Item Settings
        </h3>
        <button
          onClick={() => deleteItem(selectedItem)}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow hover:shadow-md flex items-center gap-1"
          title="Delete this item"
          aria-label="Delete item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      {/* Text and Link Settings */}
      <div className="mb-4 bg-gray-800 p-3 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Text
        </label>
        <input
          type="text"
          value={selectedItemData.label || ''}
          onChange={(e) => updateItemText(selectedItem, 'label', e.target.value)}
          className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter text"
          title="Item text content"
        />
      </div>

      {selectedItemData.type === 'link' && (
        <div className="mb-4 bg-gray-800 p-3 rounded-lg">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Link URL
          </label>
          <input
            type="text"
            value={selectedItemData.link || ''}
            onChange={(e) => updateItemText(selectedItem, 'link', e.target.value)}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., /about"
            title="Link destination URL"
          />
        </div>
      )}

      {/* Position Settings */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Position Settings
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Menu Position
            </label>
            <select
              value={selectedItemData.position}
              onChange={(e) => updateItemPosition(selectedItem, e.target.value as 'left' | 'center' | 'right' | 'nav')}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Select item position in the navbar"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="nav">Navigation Menu</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Position Type
          </label>
          <select
            value={selectedItemData.styles.position || 'relative'}
            onChange={(e) => updateItemStyle(selectedItem, 'position', e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white"
            title="Select position type"
          >
            <option value="relative">Default (Relative)</option>
            <option value="absolute">Free Position (Absolute)</option>
          </select>
        </div>

        {selectedItemData.styles.position === 'absolute' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Top Position
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={parseInt(selectedItemData.styles.top?.replace('%', '') || '0')}
                  onChange={(e) => updateItemStyle(selectedItem, 'top', `${e.target.value}%`)}
                  className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                  title="Top position percentage"
                  placeholder="Top %"
                />
                <span className="text-sm text-gray-400">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Left Position
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={parseInt(selectedItemData.styles.left?.replace('%', '') || '0')}
                  onChange={(e) => updateItemStyle(selectedItem, 'left', `${e.target.value}%`)}
                  className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                  title="Left position percentage"
                  placeholder="Left %"
                />
                <span className="text-sm text-gray-400">%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Margin Controls */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Margin Controls</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Top Margin
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={parseInt(selectedItemData.styles.marginTop?.replace('px', '') || '0')}
                onChange={(e) => updateItemStyle(selectedItem, 'marginTop', `${e.target.value}px`)}
                className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                title="Top margin in pixels"
                placeholder="0"
              />
              <span className="text-sm text-gray-400">px</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Right Margin
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={parseInt(selectedItemData.styles.marginRight?.replace('px', '') || '0')}
                onChange={(e) => updateItemStyle(selectedItem, 'marginRight', `${e.target.value}px`)}
                className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                title="Right margin in pixels"
                placeholder="0"
              />
              <span className="text-sm text-gray-400">px</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Bottom Margin
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={parseInt(selectedItemData.styles.marginBottom?.replace('px', '') || '0')}
                onChange={(e) => updateItemStyle(selectedItem, 'marginBottom', `${e.target.value}px`)}
                className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                title="Bottom margin in pixels"
                placeholder="0"
              />
              <span className="text-sm text-gray-400">px</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Left Margin
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={parseInt(selectedItemData.styles.marginLeft?.replace('px', '') || '0')}
                onChange={(e) => updateItemStyle(selectedItem, 'marginLeft', `${e.target.value}px`)}
                className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                title="Left margin in pixels"
                placeholder="0"
              />
              <span className="text-sm text-gray-400">px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Settings */}
      {selectedItemData.type === 'image' && (
        <ImageSettings
          selectedItem={selectedItemData}
          updateItemImage={updateItemImage}
          removeItemImage={removeItemImage}
          updateItemStyle={updateItemStyle}
          itemId={selectedItem}
        />
      )}

      {/* Text Styling */}
      <TextSettings
        selectedItem={selectedItemData}
        navStyles={navStyles}
        itemId={selectedItem}
        updateItemStyle={updateItemStyle}
      />

      {/* Additional Styling */}
      <StyleSettings
        selectedItem={selectedItemData}
        itemId={selectedItem}
        updateItemStyle={updateItemStyle}
      />
    </div>
  );
} 