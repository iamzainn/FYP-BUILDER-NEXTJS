'use client';

import { UploadButton } from '@/utils/uploadthing';
import { NavItem } from '../types';

interface ImageSettingsProps {
  selectedItem: NavItem;
  updateItemImage: (itemId: string, imageUrl: string) => void;
  removeItemImage: (itemId: string) => void;
  updateItemStyle: (itemId: string, styleKey: string, value: string) => void;
  itemId: string;
}

export default function ImageSettings({
  selectedItem,
  updateItemImage,
  removeItemImage,
  updateItemStyle,
  itemId
}: ImageSettingsProps) {
  return (
    <div className="mb-6 border-b border-gray-700 pb-4">
      <h4 className="text-sm font-medium text-blue-300 mb-3">Image Settings</h4>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Upload Image
        </label>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            if (res && res.length > 0) {
              const imageUrl = res[0].url;
              // Update the item with the new image URL
              updateItemImage(itemId, imageUrl);
              console.log("Upload completed:", imageUrl);
            }
          }}
          onUploadError={(error: any) => {
            console.error("Upload error:", error.message);
            alert("Upload failed: " + error.message);
          }}
          appearance={{
            button: "bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-lg transition-colors",
            allowedContent: "text-sm text-gray-300",
          }}
        />
        {selectedItem.imageUrl && (
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400 mb-1">Current image:</p>
              <button 
                onClick={() => removeItemImage(itemId)}
                className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
            <div className="bg-gray-700 rounded-lg p-2 relative">
              <img 
                src={selectedItem.imageUrl} 
                alt="Uploaded image" 
                className="w-full h-20 object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Object Fit
        </label>
        <select
          value={selectedItem.styles.objectFit || 'contain'}
          onChange={(e) => updateItemStyle(itemId, 'objectFit', e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          title="Select how the image should fit within its container"
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
          <option value="scale-down">Scale Down</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Width (px)
        </label>
        <input
          type="range"
          min="20"
          max="200"
          value={parseInt(selectedItem.styles.width?.replace('px', '') || '40')}
          onChange={(e) => updateItemStyle(itemId, 'width', `${e.target.value}px`)}
          className="w-full"
          title="Image width in pixels"
          placeholder="40"
        />
        <span className="text-sm text-gray-400">
          {selectedItem.styles.width}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Height (px)
        </label>
        <input
          type="range"
          min="20"
          max="200"
          value={parseInt(selectedItem.styles.height?.replace('px', '') || '40')}
          onChange={(e) => updateItemStyle(itemId, 'height', `${e.target.value}px`)}
          className="w-full"
          title="Image height in pixels"
          placeholder="40"
        />
        <span className="text-sm text-gray-400">
          {selectedItem.styles.height}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Border Radius (px)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={parseInt(selectedItem.styles.borderRadius?.replace('px', '') || '0')}
          onChange={(e) => updateItemStyle(itemId, 'borderRadius', `${e.target.value}px`)}
          className="w-full"
          title="Border radius in pixels"
          placeholder="0"
        />
      </div>
    </div>
  );
} 