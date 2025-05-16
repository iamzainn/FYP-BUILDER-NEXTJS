import AIChat from '../AIChat';


import { HeroItem, HeroStyles, WebsiteConfig, fontFamilies } from './types';
import { UploadButton } from '@/utils/uploadthing';

interface HeroSidebarProps {
  isEditing: boolean;
  heroItems: HeroItem[];
  selectedItem: string | null;
  heroStyles: HeroStyles;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  onAddItem: (type: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItemContent: (id: string, content: string) => void;
  onUpdateItemLink: (id: string, link: string) => void;
  onUpdateItemStyle: (id: string, style: Partial<HeroItem['styles']>) => void;
  onUpdateItemPosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateItemAnimation: (id: string, animation: string) => void;
  onUpdateHeroStyle: (style: Partial<HeroStyles>) => void;
  onSave: () => void;
  handleClose: () => void;
  setHeroItems: React.Dispatch<React.SetStateAction<HeroItem[]>>;
  setHeroStyles: React.Dispatch<React.SetStateAction<HeroStyles>>;
  apiKey?: string;
  onAIConfigUpdate?: (newConfig: WebsiteConfig) => void;
  useDirectSave?: boolean;
  componentId?: number;
  isSaving?: boolean;
}

export const HeroSidebar: React.FC<HeroSidebarProps> = ({
  isEditing,
  heroItems,
  selectedItem,
  heroStyles,
  setSelectedItem,
  onAddItem,
  onDeleteItem,
  onUpdateItemContent,
  onUpdateItemLink,
  onUpdateItemStyle,
  onUpdateItemPosition,
  onUpdateItemAnimation,
  onUpdateHeroStyle,
  onSave,
  handleClose,
  setHeroItems,
  setHeroStyles,
  apiKey,
  onAIConfigUpdate,
  useDirectSave,
  componentId,
  isSaving = false
}) => {
  if (!isEditing) return null;
  
  // Local state for file upload
  

  // Update the handleAddItem function
  const handleAddItem = (type: string) => {
    onAddItem(type);
  };

  // Update the handleDeleteItem function
  const handleDeleteItem = (id: string) => {
    onDeleteItem(id);
    // If this was the selected item, clear the selection
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

  // Update the handleUpdateItemContent function
  const handleUpdateItemContent = (id: string, content: string) => {
    console.log(`Updating content for item ${id} to "${content}"`);
    onUpdateItemContent(id, content);
  };

  // Update the handleUpdateItemLink function
  const handleUpdateItemLink = (id: string, link: string) => {
    console.log(`Updating link for item ${id} to "${link}"`);
    onUpdateItemLink(id, link);
  };

  // Update the handleUpdateItemPosition function
  const handleUpdateItemPosition = (id: string, position: 'left' | 'center' | 'right') => {
    console.log(`Updating position for item ${id} to "${position}"`);
    onUpdateItemPosition(id, { 
      x: position === 'left' ? 0 : position === 'center' ? 0.5 : 1, 
      y: 0 
    });
  };

  // Update the handleUpdateItemStyle function
  const handleUpdateItemStyle = (id: string, styleKey: string, value: string) => {
    onUpdateItemStyle(id, { [styleKey]: value });
  };

  // Update the handleUpdateItemAnimation function
  const handleUpdateItemAnimation = (id: string, animation: string) => {
    console.log(`Updating animation for item ${id} to "${animation}"`);
    onUpdateItemAnimation(id, animation);
  };

  // Update the handleUpdateHeroStyle function
  const handleUpdateHeroStyle = (styleKey: string, value: string) => {
    onUpdateHeroStyle({ [styleKey]: value });
  };

  // Handler for uploading an item image (now using UploadThing)
  const handleItemImageUpload = async (id: string, url: string) => {
    // Update item with the new image URL
    onUpdateItemStyle(id, { imageUrl: url });
  };

  // Handler for uploading a hero background image (now using UploadThing)
  const handleHeroBackgroundImageUpload = async (url: string) => {
    // Update hero style with the new background image
    onUpdateHeroStyle({ backgroundImage: url });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 md:w-96 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl p-4 md:p-6 overflow-y-auto z-[9999] transform transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Customize Hero
        </h2>
        <div className="flex gap-2">
          {/* Add close button */}
          <button
            onClick={() => {
              console.log("Hero sidebar close button clicked");
              handleClose();
            }}
            className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Update save button to show loading state */}
          <button
            onClick={() => {
              console.log("Save button clicked");
              console.log("Direct save mode:", useDirectSave ? "enabled" : "disabled");
              console.log("Component ID:", componentId);
              
              try {
                onSave();
                console.log("Save action completed successfully");
              } catch (error) {
                console.error("Error during save operation:", error);
              }
            }}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${
              isSaving
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
            aria-label={isSaving ? "Saving changes..." : "Save changes"}
            title={isSaving ? "Saving changes..." : "Save changes"}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add New Item Buttons */}
      <div className="mb-6 p-4 bg-gray-800 rounded-xl shadow-inner">
        <h3 className="text-lg font-semibold mb-4 text-blue-300">Add New Element</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAddItem('heading')}
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
            title="Add heading"
          >
            Add Heading
          </button>
          <button
            onClick={() => handleAddItem('subheading')}
            className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
            title="Add subheading"
          >
            Add Subheading
          </button>
          <button
            onClick={() => handleAddItem('paragraph')}
            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-sm hover:shadow-md transition-all"
            title="Add paragraph"
          >
            Add Paragraph
          </button>
          <button
            onClick={() => handleAddItem('button')}
            className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow-md transition-all"
            title="Add button"
          >
            Add Button
          </button>
          <button
            onClick={() => handleAddItem('badge')}
            className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg hover:from-yellow-600 hover:to-yellow-700 shadow-sm hover:shadow-md transition-all text-gray-900"
            title="Add badge"
          >
            Add Badge
          </button>
          <button
            onClick={() => handleAddItem('image')}
            className="px-3 py-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg hover:from-pink-600 hover:to-pink-700 shadow-sm hover:shadow-md transition-all"
            title="Add image"
          >
            Add Image
          </button>
        </div>
      </div>

      {/* Item Editor - displayed when an item is selected */}
      {selectedItem && (
        <div className="mb-6 border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Element
            </h3>
            <button
              onClick={() => handleDeleteItem(selectedItem)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
              title="Delete item"
              aria-label="Delete item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          {/* Content Editor */}
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Content
            </label>
            <input
              type="text"
              value={heroItems.find(item => item.id === selectedItem)?.content || ''}
              onChange={(e) => handleUpdateItemContent(selectedItem, e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter content"
              aria-label="Item content"
              title="Enter item content"
            />
          </div>

          {/* Link URL - only shown for buttons */}
          {heroItems.find(item => item.id === selectedItem)?.type === 'button' && (
            <div className="bg-gray-800 p-3 rounded-lg mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Link URL
              </label>
              <input
                type="text"
                value={heroItems.find(item => item.id === selectedItem)?.link || ''}
                onChange={(e) => handleUpdateItemLink(selectedItem, e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., /shop, /products"
                aria-label="Button link"
                title="Enter button link URL"
              />
            </div>
          )}

          {/* Position selector */}
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Position
            </label>
            <select
              value={heroItems.find(item => item.id === selectedItem)?.position}
              onChange={(e) => handleUpdateItemPosition(selectedItem, e.target.value as 'left' | 'center' | 'right')}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Item position"
              title="Select item position"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Animation selector */}
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Animation
            </label>
            <select
              value={heroItems.find(item => item.id === selectedItem)?.animation || 'none'}
              onChange={(e) => handleUpdateItemAnimation(selectedItem, e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Animation type"
              title="Select animation type"
            >
              <option value="none">None</option>
              <option value="fade">Fade In</option>
              <option value="slide">Slide In</option>
              <option value="bounce">Bounce</option>
            </select>
          </div>

          {/* Image upload button - only shown for images */}
          {heroItems.find(item => item.id === selectedItem)?.type === 'image' && (
            <div className="bg-gray-800 p-3 rounded-lg mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Upload Image
                </label>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                      handleItemImageUpload(selectedItem, res[0].url);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('UploadThing error:', error);
                  }}
                  appearance={{
                    button: 'w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center gap-2',
                  }}
                />
              </div>
          )}

          {/* Style settings */}
          <div className="border-t border-gray-700 pt-4 mb-4">
            <h4 className="text-md font-semibold text-blue-300 mb-3">Style Settings</h4>

            {/* Text & Background Color */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={heroItems.find(item => item.id === selectedItem)?.styles.color || heroStyles.color}
                    onChange={(e) => handleUpdateItemStyle(selectedItem, 'color', e.target.value)}
                    className="h-10 w-10 rounded border border-gray-600 mr-2"
                    aria-label="Text color"
                    title="Select text color"
                  />
                  <span className="text-xs text-gray-400">
                    {heroItems.find(item => item.id === selectedItem)?.styles.color || heroStyles.color}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background
                  </label>
                <div className="flex items-center">
                    <input
                    type="color"
                    value={heroItems.find(item => item.id === selectedItem)?.styles.backgroundColor || 'transparent'}
                    onChange={(e) => handleUpdateItemStyle(selectedItem, 'backgroundColor', e.target.value)}
                    className="h-10 w-10 rounded border border-gray-600 mr-2"
                    aria-label="Background color"
                    title="Select background color"
                  />
                  <span className="text-xs text-gray-400">
                    {heroItems.find(item => item.id === selectedItem)?.styles.backgroundColor || 'transparent'}
                  </span>
                </div>
                  </div>
                </div>

            {/* Font Settings */}
                <div className="mb-4">
              <details className="bg-gray-800 p-3 rounded-lg">
                <summary className="text-sm font-medium text-gray-300 cursor-pointer">
                  Font Settings
                </summary>
                <div className="mt-3 space-y-3 pl-2">
                  {/* Font Size */}
                  <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                      Font Size
                  </label>
                    <div className="flex items-center gap-4">
                    <input
                      type="range"
                        min="8"
                        max="96"
                        value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.fontSize || '16')}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'fontSize', `${e.target.value}px`)}
                        className="w-full accent-blue-500"
                        aria-label="Font size"
                        title="Adjust font size"
                      />
                      <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                        {heroItems.find(item => item.id === selectedItem)?.styles.fontSize || '16px'}
                      </span>
                  </div>
                </div>

                  {/* Font Family */}
                  <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                      Font Family
                  </label>
                  <select
                      value={heroItems.find(item => item.id === selectedItem)?.styles.fontFamily || heroStyles.fontFamily}
                      onChange={(e) => handleUpdateItemStyle(selectedItem, 'fontFamily', e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Font family"
                      title="Select font family"
                    >
                      <option value="">Global Font</option>
                      {fontFamilies.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                  </select>
                </div>

                  {/* Font Weight */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Font Weight
                    </label>
                    <select
                      value={heroItems.find(item => item.id === selectedItem)?.styles.fontWeight || '400'}
                      onChange={(e) => handleUpdateItemStyle(selectedItem, 'fontWeight', e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Font weight"
                      title="Select font weight"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extra-Bold (800)</option>
                    </select>
              </div>

                  {/* Text Align */}
                  {heroItems.find(item => item.id === selectedItem)?.type !== 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Text Align
                      </label>
                      <select
                        value={heroItems.find(item => item.id === selectedItem)?.styles.textAlign || 'left'}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'textAlign', e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Text align"
                        title="Select text alignment"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  )}

                  {/* Text Transform */}
                  {heroItems.find(item => item.id === selectedItem)?.type !== 'image' && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                        Text Transform
                      </label>
                      <select
                        value={heroItems.find(item => item.id === selectedItem)?.styles.textTransform || 'none'}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'textTransform', e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Text transform"
                        title="Select text transformation"
                      >
                        <option value="none">None</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </div>
                  )}

                  {/* Letter Spacing */}
                  {heroItems.find(item => item.id === selectedItem)?.type !== 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Letter Spacing
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.letterSpacing || '0')}
                          onChange={(e) => handleUpdateItemStyle(selectedItem, 'letterSpacing', `${e.target.value}px`)}
                          className="w-full accent-blue-500"
                          aria-label="Letter spacing"
                          title="Adjust letter spacing"
                        />
                        <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                          {heroItems.find(item => item.id === selectedItem)?.styles.letterSpacing || '0px'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Line Height */}
                  {heroItems.find(item => item.id === selectedItem)?.type !== 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Line Height
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0.8"
                          max="2"
                          step="0.1"
                          value={parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.lineHeight || '1.2')}
                          onChange={(e) => handleUpdateItemStyle(selectedItem, 'lineHeight', e.target.value)}
                          className="w-full accent-blue-500"
                          aria-label="Line height"
                          title="Adjust line height"
                        />
                        <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                          {heroItems.find(item => item.id === selectedItem)?.styles.lineHeight || '1.2'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            </div>

            {/* Spacing Controls */}
            <div className="mb-4">
              <details className="bg-gray-800 p-3 rounded-lg">
                <summary className="text-sm font-medium text-gray-300 cursor-pointer">
                  Spacing Controls
                </summary>
                <div className="mt-3 space-y-3 pl-2">
                  {/* Margin Controls */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-blue-300">Margins</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Top
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginTop?.replace('px', '') || '0')}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'marginTop', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded-md text-center"
                            min="0"
                            max="100"
                        aria-label="Top margin"
                        title="Enter top margin in pixels"
                      />
                          <span className="text-xs text-gray-400">px</span>
                    </div>
                  </div>
                  
                  <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Right
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginRight?.replace('px', '') || '0')}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'marginRight', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded-md text-center"
                            min="0"
                            max="100"
                        aria-label="Right margin"
                        title="Enter right margin in pixels"
                      />
                          <span className="text-xs text-gray-400">px</span>
                    </div>
                  </div>
                  
                  <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Bottom
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginBottom?.replace('px', '') || '0')}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'marginBottom', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded-md text-center"
                            min="0"
                            max="100"
                        aria-label="Bottom margin"
                        title="Enter bottom margin in pixels"
                      />
                          <span className="text-xs text-gray-400">px</span>
                    </div>
                  </div>
                  
                  <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Left
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginLeft?.replace('px', '') || '0')}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'marginLeft', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded-md text-center"
                            min="0"
                            max="100"
                        aria-label="Left margin"
                        title="Enter left margin in pixels"
                      />
                          <span className="text-xs text-gray-400">px</span>
                    </div>
                  </div>
                </div>
              </div>

                  {/* Padding */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-blue-300">Padding</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Top
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              // Try to extract top padding
                              if (padding.includes(' ')) {
                                // Format could be: "10px 5px 15px 20px" (top right bottom left)
                                // or "10px 5px" (top/bottom left/right)
                                const parts = padding.split(' ').map(p => parseInt(p));
                                return parts[0] || 0;
                              }
                              return parseInt(padding) || 0;
                            })()}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const currentPadding = item.styles.padding || '0';
                                let paddingValues = [0, 0, 0, 0]; // top, right, bottom, left
                                
                                // Parse current padding
                                if (currentPadding.includes(' ')) {
                                  const parts = currentPadding.split(' ').map(p => parseInt(p));
                                  if (parts.length === 4) {
                                    paddingValues = parts;
                                  } else if (parts.length === 2) {
                                    paddingValues = [parts[0], parts[1], parts[0], parts[1]]; // top/bottom left/right
                                  }
                                } else {
                                  const singleValue = parseInt(currentPadding) || 0;
                                  paddingValues = [singleValue, singleValue, singleValue, singleValue];
                                }
                                
                                // Update top padding
                                paddingValues[0] = parseInt(e.target.value);
                                
                                // Create new padding string
                                const newPadding = `${paddingValues[0]}px ${paddingValues[1]}px ${paddingValues[2]}px ${paddingValues[3]}px`;
                                handleUpdateItemStyle(selectedItem, 'padding', newPadding);
                              }
                            }}
                            className="w-full accent-blue-500"
                            aria-label="Top padding"
                            title="Adjust top padding"
                          />
                          <span className="text-xs text-gray-400 w-8 text-center">
                            {(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                return `${parts[0] || 0}px`;
                              }
                              return `${parseInt(padding) || 0}px`;
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Right
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                if (parts.length === 4) return parts[1] || 0;
                                if (parts.length === 2) return parts[1] || 0; // top/bottom left/right
                              }
                              return parseInt(padding) || 0;
                            })()}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const currentPadding = item.styles.padding || '0';
                                let paddingValues = [0, 0, 0, 0];
                                
                                if (currentPadding.includes(' ')) {
                                  const parts = currentPadding.split(' ').map(p => parseInt(p));
                                  if (parts.length === 4) {
                                    paddingValues = parts;
                                  } else if (parts.length === 2) {
                                    paddingValues = [parts[0], parts[1], parts[0], parts[1]];
                                  }
                                } else {
                                  const singleValue = parseInt(currentPadding) || 0;
                                  paddingValues = [singleValue, singleValue, singleValue, singleValue];
                                }
                                
                                paddingValues[1] = parseInt(e.target.value);
                                const newPadding = `${paddingValues[0]}px ${paddingValues[1]}px ${paddingValues[2]}px ${paddingValues[3]}px`;
                                handleUpdateItemStyle(selectedItem, 'padding', newPadding);
                              }
                            }}
                            className="w-full accent-blue-500"
                            aria-label="Right padding"
                            title="Adjust right padding"
                          />
                          <span className="text-xs text-gray-400 w-8 text-center">
                            {(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                if (parts.length === 4) return `${parts[1] || 0}px`;
                                if (parts.length === 2) return `${parts[1] || 0}px`;
                              }
                              return `${parseInt(padding) || 0}px`;
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Bottom
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                if (parts.length === 4) return parts[2] || 0;
                                if (parts.length === 2) return parts[0] || 0; // top/bottom left/right
                              }
                              return parseInt(padding) || 0;
                            })()}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const currentPadding = item.styles.padding || '0';
                                let paddingValues = [0, 0, 0, 0];
                                
                                if (currentPadding.includes(' ')) {
                                  const parts = currentPadding.split(' ').map(p => parseInt(p));
                                  if (parts.length === 4) {
                                    paddingValues = parts;
                                  } else if (parts.length === 2) {
                                    paddingValues = [parts[0], parts[1], parts[0], parts[1]];
                                  }
                                } else {
                                  const singleValue = parseInt(currentPadding) || 0;
                                  paddingValues = [singleValue, singleValue, singleValue, singleValue];
                                }
                                
                                paddingValues[2] = parseInt(e.target.value);
                                const newPadding = `${paddingValues[0]}px ${paddingValues[1]}px ${paddingValues[2]}px ${paddingValues[3]}px`;
                                handleUpdateItemStyle(selectedItem, 'padding', newPadding);
                              }
                            }}
                            className="w-full accent-blue-500"
                            aria-label="Bottom padding"
                            title="Adjust bottom padding"
                          />
                          <span className="text-xs text-gray-400 w-8 text-center">
                            {(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                if (parts.length === 4) return `${parts[2] || 0}px`;
                                if (parts.length === 2) return `${parts[0] || 0}px`;
                              }
                              return `${parseInt(padding) || 0}px`;
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Left
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                if (parts.length === 4) return parts[3] || 0;
                                if (parts.length === 2) return parts[1] || 0; // top/bottom left/right
                              }
                              return parseInt(padding) || 0;
                            })()}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const currentPadding = item.styles.padding || '0';
                                let paddingValues = [0, 0, 0, 0];
                                
                                if (currentPadding.includes(' ')) {
                                  const parts = currentPadding.split(' ').map(p => parseInt(p));
                                  if (parts.length === 4) {
                                    paddingValues = parts;
                                  } else if (parts.length === 2) {
                                    paddingValues = [parts[0], parts[1], parts[0], parts[1]];
                                  }
                                } else {
                                  const singleValue = parseInt(currentPadding) || 0;
                                  paddingValues = [singleValue, singleValue, singleValue, singleValue];
                                }
                                
                                paddingValues[3] = parseInt(e.target.value);
                                const newPadding = `${paddingValues[0]}px ${paddingValues[1]}px ${paddingValues[2]}px ${paddingValues[3]}px`;
                                handleUpdateItemStyle(selectedItem, 'padding', newPadding);
                              }
                            }}
                            className="w-full accent-blue-500"
                            aria-label="Left padding"
                            title="Adjust left padding"
                          />
                          <span className="text-xs text-gray-400 w-8 text-center">
                            {(() => {
                              const padding = heroItems.find(item => item.id === selectedItem)?.styles.padding || '0';
                              if (padding.includes(' ')) {
                                const parts = padding.split(' ').map(p => parseInt(p));
                                if (parts.length === 4) return `${parts[3] || 0}px`;
                                if (parts.length === 2) return `${parts[1] || 0}px`;
                              }
                              return `${parseInt(padding) || 0}px`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 mt-2 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Preview:</span>
                        <div className="relative">
                          <div
                            className="w-16 h-16 bg-blue-500 border-2 border-dashed border-blue-300 flex items-center justify-center"
                            style={{
                              padding: heroItems.find(item => item.id === selectedItem)?.styles.padding || '0'
                            }}
                          >
                            <div className="w-full h-full bg-blue-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Size & Position Controls */}
                <div className="mb-4">
              <details className="bg-gray-800 p-3 rounded-lg">
                <summary className="text-sm font-medium text-gray-300 cursor-pointer">
                  Size & Position
                </summary>
                <div className="mt-3 space-y-3 pl-2">
                  {/* Width & Height for images */}
                  {heroItems.find(item => item.id === selectedItem)?.type === 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Width
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.width?.replace('%', '') || '100')}
                            onChange={(e) => handleUpdateItemStyle(selectedItem, 'width', `${e.target.value}%`)}
                            className="w-full accent-blue-500"
                            aria-label="Width percentage"
                            title="Adjust width percentage"
                          />
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                            {heroItems.find(item => item.id === selectedItem)?.styles.width || '100%'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Height
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="50"
                            max="600"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.height?.replace('px', '') || '300')}
                            onChange={(e) => handleUpdateItemStyle(selectedItem, 'height', `${e.target.value}px`)}
                            className="w-full accent-blue-500"
                            aria-label="Height in pixels"
                            title="Adjust height in pixels"
                          />
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                            {heroItems.find(item => item.id === selectedItem)?.styles.height || '300px'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Border Radius
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.borderRadius?.replace('px', '') || '0')}
                            onChange={(e) => handleUpdateItemStyle(selectedItem, 'borderRadius', `${e.target.value}px`)}
                            className="w-full accent-blue-500"
                            aria-label="Border radius"
                            title="Adjust border radius"
                          />
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                            {heroItems.find(item => item.id === selectedItem)?.styles.borderRadius || '0px'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Position controls */}
                  <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Position Type
                  </label>
                  <select
                    value={heroItems.find(item => item.id === selectedItem)?.styles.position || 'relative'}
                    onChange={(e) => handleUpdateItemStyle(selectedItem, 'position', e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Position type"
                    title="Select position type"
                  >
                    <option value="relative">Default (Relative)</option>
                    <option value="absolute">Free Position (Absolute)</option>
                  </select>
                </div>

                {heroItems.find(item => item.id === selectedItem)?.styles.position === 'absolute' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Top Position
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.top?.replace('%', '') || '0')}
                          onChange={(e) => handleUpdateItemStyle(selectedItem, 'top', `${e.target.value}%`)}
                            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Top position"
                          title="Enter top position percentage"
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
                          value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.left?.replace('%', '') || '0')}
                          onChange={(e) => handleUpdateItemStyle(selectedItem, 'left', `${e.target.value}%`)}
                            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Left position"
                          title="Enter left position percentage"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
          )}

                  {/* Z-Index */}
                  <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
                      Z-Index
            </label>
            <input
                      type="number"
                      value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.zIndex || '1')}
                      onChange={(e) => handleUpdateItemStyle(selectedItem, 'zIndex', e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      aria-label="Z-index"
                      title="Set z-index (stacking order)"
            />
          </div>

                  {/* Opacity */}
                  <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
                      Opacity
            </label>
                    <div className="flex items-center gap-4">
            <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.opacity || '1')}
                        onChange={(e) => handleUpdateItemStyle(selectedItem, 'opacity', e.target.value)}
                        className="w-full accent-blue-500"
                        aria-label="Opacity"
                        title="Adjust opacity"
                      />
                      <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                        {heroItems.find(item => item.id === selectedItem)?.styles.opacity || '1'}
                      </span>
                    </div>
                  </div>
                </div>
              </details>
          </div>

            {/* Advanced Styling */}
          <div className="mb-4">
              <details className="bg-gray-800 p-3 rounded-lg">
                <summary className="text-sm font-medium text-gray-300 cursor-pointer">
                  Advanced Styling
                </summary>
                <div className="mt-3 space-y-3 pl-2">
                  {/* Box Shadow */}
                  <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
                      Box Shadow
            </label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            X Offset
                          </label>
                          <div className="flex items-center gap-2">
            <input
              type="range"
                              min="-20"
                              max="20"
                              value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[0] || '0')}
                              onChange={(e) => {
                                const item = heroItems.find(item => item.id === selectedItem);
                                if (item) {
                                  const boxShadowParts = (item.styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)').split(' ');
                                  boxShadowParts[0] = e.target.value;
                                  handleUpdateItemStyle(selectedItem, 'boxShadow', boxShadowParts.join(' '));
                                }
                              }}
                              className="w-full accent-blue-500"
                            />
                            <span className="bg-gray-700 px-2 py-1 rounded text-sm w-12 text-center">
                              {heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[0] || '0'}px
            </span>
          </div>
          </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Y Offset
            </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="-20"
                              max="20"
                              value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[1]?.replace('px', '') || '2')}
                              onChange={(e) => {
                                const item = heroItems.find(item => item.id === selectedItem);
                                if (item) {
                                  const boxShadowParts = (item.styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)').split(' ');
                                  boxShadowParts[1] = `${e.target.value}px`;
                                  handleUpdateItemStyle(selectedItem, 'boxShadow', boxShadowParts.join(' '));
                                }
                              }}
                              className="w-full accent-blue-500"
                            />
                            <span className="bg-gray-700 px-2 py-1 rounded text-sm w-12 text-center">
                              {heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[1] || '2px'}
                            </span>
          </div>
              </div>
              </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Blur Radius
                </label>
                        <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                            max="30"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[2]?.replace('px', '') || '4')}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const boxShadowParts = (item.styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)').split(' ');
                                boxShadowParts[2] = `${e.target.value}px`;
                                handleUpdateItemStyle(selectedItem, 'boxShadow', boxShadowParts.join(' '));
                              }
                            }}
                            className="w-full accent-blue-500"
                          />
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm w-12 text-center">
                            {heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[2] || '4px'}
                </span>
                        </div>
              </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Shadow Color
                </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.includes('rgba') 
                              ? '#000000' 
                              : (heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.split(' ')[3] || '#000000')}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const boxShadowParts = (item.styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)').split(' ');
                                // Create rgba from hex and current opacity
                                const opacity = 0.1;
                                const hex = e.target.value.replace('#', '');
                                const r = parseInt(hex.substring(0, 2), 16);
                                const g = parseInt(hex.substring(2, 4), 16);
                                const b = parseInt(hex.substring(4, 6), 16);
                                boxShadowParts[3] = `rgba(${r},${g},${b},${opacity})`;
                                handleUpdateItemStyle(selectedItem, 'boxShadow', boxShadowParts.join(' '));
                              }
                            }}
                            className="h-10 w-10 rounded border border-gray-600 mr-2"
                          />
                <input
                  type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.includes('rgba') 
                              ? (parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.match(/rgba\([^)]+,([^)]+)\)/)?.[1] || '0.1'))
                              : 0.1}
                            onChange={(e) => {
                              const item = heroItems.find(item => item.id === selectedItem);
                              if (item) {
                                const boxShadowParts = (item.styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)').split(' ');
                                const currentColor = boxShadowParts[3] || 'rgba(0,0,0,0.1)';
                                // Update opacity in rgba
                                if (currentColor.includes('rgba')) {
                                  boxShadowParts[3] = currentColor.replace(/rgba\(([^)]+),([^)]+)\)/, `rgba($1,${e.target.value})`);
                                } else {
                                  // Default to black with new opacity if not rgba
                                  boxShadowParts[3] = `rgba(0,0,0,${e.target.value})`;
                                }
                                handleUpdateItemStyle(selectedItem, 'boxShadow', boxShadowParts.join(' '));
                              }
                            }}
                            className="w-3/4 accent-blue-500 ml-2"
                          />
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm ml-2">
                            {heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.includes('rgba') 
                              ? (parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.boxShadow?.match(/rgba\([^)]+,([^)]+)\)/)?.[1] || '0.1')).toFixed(2)
                              : '0.10'}
                </span>
              </div>
                      </div>
                      
                      <div className="pt-2 mt-2 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Preview:</span>
                          <div 
                            className="w-16 h-16 bg-blue-500 rounded"
                            style={{ 
                              boxShadow: heroItems.find(item => item.id === selectedItem)?.styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Border Controls */}
                  {heroItems.find(item => item.id === selectedItem)?.type === 'image' && (
                    <>
                      <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
                          Border Width
            </label>
                        <div className="flex items-center gap-4">
            <input
                            type="range"
                            min="0"
                            max="10"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.borderWidth?.replace('px', '') || '0')}
                            onChange={(e) => handleUpdateItemStyle(selectedItem, 'borderWidth', `${e.target.value}px`)}
                            className="w-full accent-blue-500"
                            aria-label="Border width"
                            title="Adjust border width"
                          />
                          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                            {heroItems.find(item => item.id === selectedItem)?.styles.borderWidth || '0px'}
                          </span>
                        </div>
          </div>

                      <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
                          Border Color
            </label>
                        <div className="flex items-center">
            <input
                            type="color"
                            value={heroItems.find(item => item.id === selectedItem)?.styles.borderColor || '#000000'}
                            onChange={(e) => handleUpdateItemStyle(selectedItem, 'borderColor', e.target.value)}
                            className="h-10 w-10 rounded border border-gray-600 mr-2"
                            aria-label="Border color"
                            title="Select border color"
                          />
                          <span className="text-xs text-gray-400">
                            {heroItems.find(item => item.id === selectedItem)?.styles.borderColor || '#000000'}
                          </span>
                        </div>
          </div>

                      <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
                          Border Style
            </label>
                        <select
                          value={heroItems.find(item => item.id === selectedItem)?.styles.borderStyle || 'solid'}
                          onChange={(e) => handleUpdateItemStyle(selectedItem, 'borderStyle', e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Border style"
                          title="Select border style"
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                          <option value="double">Double</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Global Hero Settings */}
      <div className="border-t border-gray-700 pt-4 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Hero Settings
        </h3>
        
        {/* Layout setting */}
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Layout
          </label>
          <select
            value={heroStyles.layout}
            onChange={(e) => setHeroStyles({...heroStyles, layout: e.target.value as 'left-content' | 'right-content' | 'center-content' | 'full-width'})}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Layout"
            title="Select layout"
          >
            <option value="left-content">Left Content</option>
            <option value="right-content">Right Content</option>
            <option value="center-content">Center Content</option>
            <option value="full-width">Full Width</option>
          </select>
        </div>
        
        {/* Background color */}
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Background Color
          </label>
          <div className="flex items-center">
          <input
            type="color"
            value={heroStyles.backgroundColor || '#000000'}
            onChange={(e) => handleUpdateHeroStyle('backgroundColor', e.target.value)}
              className="h-10 w-10 rounded border border-gray-600 mr-2"
            aria-label="Background color"
          />
            <span className="text-white">Background Color</span>
          </div>
        </div>

        {/* Background image */}
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Background Image
            </label>
            <div className="flex gap-2">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]?.url) {
                    handleHeroBackgroundImageUpload(res[0].url);
                  }
                }}
                onUploadError={(error) => {
                  console.error('UploadThing error:', error);
                }}
                appearance={{
                  button: 'flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mr-2 transition-colors flex items-center justify-center gap-2',
                }}
              />
              {heroStyles.backgroundImage && (
                <button
                  onClick={() => handleUpdateHeroStyle('backgroundImage', '')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  aria-label="Remove background image"
                >
                  Remove
                </button>
              )}
            </div>
        </div>

        {/* Height */}
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Section Height
          </label>
          <div className="flex items-center gap-4">
          <input
            type="range"
              min="200"
            max="800"
            step="50"
            value={parseInt(heroStyles.height?.replace('px', '') || '500')}
            onChange={(e) => handleUpdateHeroStyle('height', `${e.target.value}px`)}
              className="w-full accent-blue-500"
            aria-label="Hero height"
          />
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">
              {parseInt(heroStyles.height?.replace('px', '') || '500')}px
            </span>
        </div>
        </div>
        </div>

      {/* AI Chat Interface */}
      {apiKey && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            AI Assistant
          </h3>
          
          <div className="bg-gray-800 p-2 rounded-xl shadow-inner">
        <AIChat
          apiKey={apiKey}
          currentConfig={{
            heroConfig: {
              items: JSON.parse(JSON.stringify(heroItems)),
              styles: JSON.parse(JSON.stringify(heroStyles))
            }
          }}
          onConfigUpdate={(newConfig) => {
            console.log('New config from AI:', newConfig);

            if (newConfig && newConfig.heroConfig) {
              // Make deep clones to avoid reference issues
              const heroConfig = JSON.parse(JSON.stringify(newConfig.heroConfig));
              
              // Update local state first
              if (heroConfig.items) {
                console.log('Updating hero items from AI in sidebar:', heroConfig.items);
                setHeroItems(heroConfig.items);
              }
              
              if (heroConfig.styles) {
                console.log('Updating hero styles from AI in sidebar:', heroConfig.styles);
                setHeroStyles(heroConfig.styles);
              }

              // Call the parent's AI config update handler if available
              if (onAIConfigUpdate) {
                onAIConfigUpdate(newConfig);
              }
            }
          }}
        />
          </div>
    </div>
  )}

      {/* Mobile optimization: Bottom bar with save button for small screens */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 p-4 border-t border-gray-700 flex justify-between z-[10000]">
        <button
          onClick={() => {
            console.log("Mobile hero sidebar close button clicked");
            handleClose();
          }}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg"
          aria-label="Close editor"
          title="Close editor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </button>
        
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg ${
            isSaving 
              ? 'bg-gray-600 text-gray-300' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}
          aria-label={isSaving ? "Saving changes..." : "Save changes"}
          title={isSaving ? "Saving changes..." : "Save changes"}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HeroSidebar;