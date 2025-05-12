import React from 'react';
import AIChat from '../AIChat';
import { CollectionItem, CollectionStyles, WebsiteConfig, SidebarCollectionProps } from './types';

const SidebarCollection: React.FC<SidebarCollectionProps> = ({
  isEditing,
  collectionItems,
  collectionStyles,
  handleSave,
  updateGlobalStyle,
  updateAllItemsStyle,
  apiKey,
  handleAIConfigUpdate,
  onItemsChange,
  onStylesChange
}) => {
  if (!isEditing) return null;

  const renderInputField = (
    label: string,
    value: string | undefined,
    onChange: (value: string) => void,
    type: string = 'text',
    placeholder: string = '',
    options?: { value: string; label: string }[]
  ) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {label}
        </label>
        {type === 'select' && options ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label={label}
            title={label}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'color' ? (
          <div className="flex items-center">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 w-9 rounded border border-gray-600 mr-2 cursor-pointer"
              aria-label={`Color for ${label}`}
              title={`Choose a color for ${label}`}
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
            />
          </div>
        ) : type === 'range' ? (
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={value || '0.5'}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 mr-2"
              aria-label={`Range for ${label}`}
              title={`Adjust the ${label}`}
            />
            <span className="text-sm text-gray-300 w-12 text-right">
              {parseFloat(value || '0.5').toFixed(1)}
            </span>
          </div>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed right-0 top-0 h-screen bg-gray-900 text-white shadow-xl p-6 overflow-y-auto z-50 w-80 transition-all duration-300 ease-in-out">
      <div className="sticky top-0 bg-gray-900 pb-4 z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Collection</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save
          </button>
        </div>

        {/* Global Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Section Settings</h3>
          
          <div>
            {/* Background Settings */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-400">Background</h4>
              
              {renderInputField(
                'Background Type',
                collectionStyles.backgroundType || 'color',
                (value) => updateGlobalStyle('backgroundType', value),
                'select',
                '',
                [
                  { value: 'color', label: 'Color' },
                  { value: 'image', label: 'Image' },
                  { value: 'gradient', label: 'Gradient' }
                ]
              )}

              {collectionStyles.backgroundType === 'color' && (
                renderInputField(
                  'Background Color',
                  collectionStyles.backgroundColor || '#FFFFFF',
                  (value) => updateGlobalStyle('backgroundColor', value),
                  'color',
                  '#FFFFFF'
                )
              )}

              {collectionStyles.backgroundType === 'image' && (
                <>
                  {renderInputField(
                    'Background Image URL',
                    collectionStyles.backgroundImage || '',
                    (value) => updateGlobalStyle('backgroundImage', value),
                    'text',
                    'Enter image URL'
                  )}
                  
                  {renderInputField(
                    'Background Size',
                    collectionStyles.backgroundSize || 'cover',
                    (value) => updateGlobalStyle('backgroundSize', value),
                    'select',
                    '',
                    [
                      { value: 'cover', label: 'Cover' },
                      { value: 'contain', label: 'Contain' },
                      { value: 'auto', label: 'Auto' }
                    ]
                  )}
                  
                  {renderInputField(
                    'Background Position',
                    collectionStyles.backgroundPosition || 'center',
                    (value) => updateGlobalStyle('backgroundPosition', value),
                    'select',
                    '',
                    [
                      { value: 'center', label: 'Center' },
                      { value: 'top', label: 'Top' },
                      { value: 'bottom', label: 'Bottom' },
                      { value: 'left', label: 'Left' },
                      { value: 'right', label: 'Right' }
                    ]
                  )}
                </>
              )}

              {collectionStyles.backgroundType === 'gradient' && (
                <>
                  {renderInputField(
                    'Gradient Start Color',
                    collectionStyles.gradientStart || '#FFFFFF',
                    (value) => updateGlobalStyle('gradientStart', value),
                    'color',
                    '#FFFFFF'
                  )}
                  
                  {renderInputField(
                    'Gradient End Color',
                    collectionStyles.gradientEnd || '#000000',
                    (value) => updateGlobalStyle('gradientEnd', value),
                    'color',
                    '#000000'
                  )}
                  
                  {renderInputField(
                    'Gradient Direction',
                    collectionStyles.gradientDirection || 'to right',
                    (value) => updateGlobalStyle('gradientDirection', value),
                    'select',
                    '',
                    [
                      { value: 'to right', label: 'Left to Right' },
                      { value: 'to left', label: 'Right to Left' },
                      { value: 'to bottom', label: 'Top to Bottom' },
                      { value: 'to top', label: 'Bottom to Top' },
                      { value: 'to bottom right', label: 'Diagonal ↘' },
                      { value: 'to bottom left', label: 'Diagonal ↙' }
                    ]
                  )}
                </>
              )}
            </div>

            {/* Section Title Settings */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-400">Section Title</h4>
              
              {renderInputField(
                'Title Text',
                collectionStyles.sectionTitle.text || '',
                (value) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, text: value }),
                'text',
                'Enter section title'
              )}
              
              {renderInputField(
                'Title Color',
                collectionStyles.sectionTitle.color || '#000000',
                (value) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, color: value }),
                'color',
                '#000000'
              )}
              
              {renderInputField(
                'Font Size',
                collectionStyles.sectionTitle.fontSize || '32px',
                (value) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, fontSize: value }),
                'text',
                '32px'
              )}
              
              {renderInputField(
                'Font Weight',
                collectionStyles.sectionTitle.fontWeight || '600',
                (value) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, fontWeight: value }),
                'select',
                '',
                [
                  { value: '400', label: 'Regular' },
                  { value: '500', label: 'Medium' },
                  { value: '600', label: 'Semi Bold' },
                  { value: '700', label: 'Bold' },
                  { value: '800', label: 'Extra Bold' }
                ]
              )}
            </div>

            {/* Layout Settings */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-400">Layout</h4>
              
              {renderInputField(
                'Layout Type',
                collectionStyles.layout || 'grid',
                (value) => updateGlobalStyle('layout', value),
                'select',
                '',
                [
                  { value: 'grid', label: 'Grid' },
                  { value: 'flex', label: 'Flex' },
                  { value: 'masonry', label: 'Masonry' }
                ]
              )}
              
              {renderInputField(
                'Grid Columns',
                collectionStyles.gridColumns?.toString() || '3',
                (value) => updateGlobalStyle('gridColumns', parseInt(value)),
                'number'
              )}
              
              {renderInputField(
                'Gap Between Items',
                collectionStyles.gap || '24px',
                (value) => updateGlobalStyle('gap', value),
                'text',
                '24px'
              )}
              
              {renderInputField(
                'Container Max Width',
                collectionStyles.maxWidth || '1200px',
                (value) => updateGlobalStyle('maxWidth', value),
                'text',
                '1200px'
              )}
              
              {renderInputField(
                'Container Padding',
                collectionStyles.containerPadding || '0 24px',
                (value) => updateGlobalStyle('containerPadding', value),
                'text',
                '0 24px'
              )}
            </div>
          </div>
        </div>

        {/* Item Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Item Settings</h3>
          
          <div>
            {/* Text Styling */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-400">Text Styling</h4>
              
              {renderInputField(
                'Text Color',
                collectionItems[0]?.styles.color || '#FFFFFF',
                (value) => updateAllItemsStyle('color', value),
                'color',
                '#FFFFFF'
              )}
              
              {renderInputField(
                'Font Size',
                collectionItems[0]?.styles.fontSize || '24px',
                (value) => updateAllItemsStyle('fontSize', value),
                'text',
                '24px'
              )}
              
              {renderInputField(
                'Font Weight',
                collectionItems[0]?.styles.fontWeight || '600',
                (value) => updateAllItemsStyle('fontWeight', value),
                'select',
                '',
                [
                  { value: '400', label: 'Regular' },
                  { value: '500', label: 'Medium' },
                  { value: '600', label: 'Semi Bold' },
                  { value: '700', label: 'Bold' },
                  { value: '800', label: 'Extra Bold' }
                ]
              )}
              
              {renderInputField(
                'Text Transform',
                collectionItems[0]?.styles.textTransform || 'none',
                (value) => updateAllItemsStyle('textTransform', value),
                'select',
                '',
                [
                  { value: 'none', label: 'None' },
                  { value: 'uppercase', label: 'UPPERCASE' },
                  { value: 'lowercase', label: 'lowercase' },
                  { value: 'capitalize', label: 'Capitalize' }
                ]
              )}
              
              {renderInputField(
                'Letter Spacing',
                collectionItems[0]?.styles.letterSpacing || '2px',
                (value) => updateAllItemsStyle('letterSpacing', value),
                'text',
                '2px'
              )}
              
              {renderInputField(
                'Text Alignment',
                collectionItems[0]?.styles.textAlign || 'center',
                (value) => updateAllItemsStyle('textAlign', value),
                'select',
                '',
                [
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' }
                ]
              )}
            </div>

            {/* Image Styling */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-400">Image Overlay</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Overlay Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={collectionItems[0]?.styles.imageOverlay?.replace('rgba(', '').split(',')[0] || '#000000'}
                    onChange={(e) => {
                      const opacity = collectionItems[0]?.styles.overlayOpacity || '0.4';
                      const rgba = `rgba(${parseInt(e.target.value.slice(1, 3), 16)}, ${parseInt(e.target.value.slice(3, 5), 16)}, ${parseInt(e.target.value.slice(5, 7), 16)}, ${opacity})`;
                      updateAllItemsStyle('imageOverlay', rgba);
                    }}
                    className="h-9 w-9 rounded border border-gray-600 mr-2 cursor-pointer"
                    aria-label="Overlay color"
                    title="Choose overlay color"
                  />
                  <span className="flex-1 text-sm text-gray-300">Overlay color with opacity</span>
                </div>
              </div>
              
              {renderInputField(
                'Overlay Opacity',
                collectionItems[0]?.styles.overlayOpacity || '0.4',
                (value) => {
                  updateAllItemsStyle('overlayOpacity', value);
                  // Update the imageOverlay color with new opacity
                  if (collectionItems[0]?.styles.imageOverlay) {
                    const rgba = collectionItems[0].styles.imageOverlay.replace(/[\d.]+\)$/g, `${value})`);
                    updateAllItemsStyle('imageOverlay', rgba);
                  }
                },
                'range'
              )}
            </div>

            {/* Effects */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-400">Effects</h4>
              
              {renderInputField(
                'Image Filter',
                collectionItems[0]?.styles.imageFilter || 'none',
                (value) => updateAllItemsStyle('imageFilter', value),
                'select',
                '',
                [
                  { value: 'none', label: 'None' },
                  { value: 'grayscale(100%)', label: 'Grayscale' },
                  { value: 'sepia(100%)', label: 'Sepia' },
                  { value: 'brightness(120%)', label: 'Bright' },
                  { value: 'contrast(120%)', label: 'High Contrast' },
                  { value: 'blur(2px)', label: 'Blur' }
                ]
              )}
              
              {renderInputField(
                'Hover Effect',
                collectionItems[0]?.styles.hoverEffect || 'none',
                (value) => updateAllItemsStyle('hoverEffect', value),
                'select',
                '',
                [
                  { value: 'none', label: 'None' },
                  { value: 'zoom', label: 'Zoom' },
                  { value: 'fade', label: 'Fade' },
                  { value: 'overlay', label: 'Overlay' }
                ]
              )}
              
              {renderInputField(
                'Animation',
                collectionItems[0]?.styles.animation || 'none',
                (value) => updateAllItemsStyle('animation', value),
                'select',
                '',
                [
                  { value: 'none', label: 'None' },
                  { value: 'fade', label: 'Fade' },
                  { value: 'slide', label: 'Slide' },
                  { value: 'zoom', label: 'Zoom' }
                ]
              )}
            </div>
          </div>
        </div>

        {/* AI Chat */}
        {apiKey && (
          <div className="mt-8 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
            <p className="text-sm text-gray-400 mb-4">
              Try asking:
              <br />• &ldquo;Make the background a blue gradient&ldquo;
              <br />• &ldquo;Change text style to uppercase with more spacing&ldquo;
              <br />• &ldquo;Add a zoom effect on hover&ldquo;
              <br />• &ldquo;Make the layout more modern&ldquo;
            </p>
            <AIChat
              apiKey={apiKey}
              currentConfig={{
                collectionConfig: {
                  items: JSON.parse(JSON.stringify(collectionItems)),
                  styles: JSON.parse(JSON.stringify(collectionStyles))
                }
              }}
              onConfigUpdate={(newConfig) => {
                console.log('New config from AI in SidebarCollection:', newConfig);
                
                if (newConfig && (newConfig as any).collectionConfig) {
                  // Make deep clones to avoid reference issues
                  const collectionConfig = JSON.parse(JSON.stringify((newConfig as any).collectionConfig));
                  
                  // Call the parent's AI config update handler
                  handleAIConfigUpdate(newConfig);
                  
                  // Directly update local state if required
                  if (onItemsChange && collectionConfig.items) {
                    onItemsChange(collectionConfig.items);
                  }
                  
                  if (onStylesChange && collectionConfig.styles) {
                    onStylesChange(collectionConfig.styles);
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarCollection;