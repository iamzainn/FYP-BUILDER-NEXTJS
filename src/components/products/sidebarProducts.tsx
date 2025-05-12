import React, { useState, useEffect } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
// import AIChat from '../AIChat';
import AIChat from '../AIChat';
import { ProductItem, ProductStyles, WebsiteConfig, SidebarProductsProps } from './types';

const SidebarProducts: React.FC<SidebarProductsProps> = ({
  isEditing,
  selectedItem,
  productItems,
  productStyles,
  handleSave,
  addNewProduct,
  updateProductDetails,
  updateProductStyle,
  updateAllProductsStyle,
  updateGlobalStyle,
  deleteProduct,
  apiKey,
  handleAIConfigUpdate,
  onItemsChange,
  onStylesChange
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'individual'>('global');
  const [backgroundType, setBackgroundType] = useState<'color' | 'gradient'>(
    productStyles.backgroundType || 'color'
  );
  
  useEffect(() => {
    setBackgroundType(productStyles.backgroundType || 'color');
  }, [productStyles]);

  // Create a wrapper function for the updateGlobalStyle that includes logging
  const updateStyleWithLog = (styleKey: string, value: string | number | Record<string, string>) => {
    console.log(`Updating style: ${styleKey} with value:`, value);
    updateGlobalStyle(styleKey, value);
  };

  const renderInputField = (
    label: string,
    value: string | number | boolean | undefined,
    onChange: (value: any) => void,
    type: string = 'text',
    placeholder: string = '',
    options?: { value: string; label: string }[]
  ) => {
    if (!isEditing) return null;

    if (type === 'color') {
      // For color fields, always ensure we have a valid string value
      const colorValue = typeof value === 'string' && value ? value : '#ffffff';
      
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
          <div className="flex items-center">
            <input
              type="color"
              value={colorValue}
              onChange={(e) => {
                // Get uppercase color value for consistency
                const newColorValue = e.target.value.toUpperCase();
                console.log(`Color picker selected for ${label}:`, newColorValue);
                // Call onChange with the new color value
                onChange(newColorValue);
              }}
              className="w-10 h-10 rounded mr-2 cursor-pointer"
              title={label}
              aria-label={label}
            />
            <input
              type="text"
              value={colorValue}
              onChange={(e) => {
                // Pass the text input value directly to onChange
                onChange(e.target.value);
              }}
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
              placeholder={placeholder || "#FFFFFF"}
            />
          </div>
          <div className="mt-2 h-4 rounded" style={{ backgroundColor: colorValue }}></div>
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
          <select
            value={value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
            title={label}
            aria-label={label}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'checkbox') {
      return (
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 mr-2 rounded"
            id={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
            title={label}
            aria-label={label}
          />
          <label 
            htmlFor={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-sm font-medium text-gray-200"
          >
            {label}
          </label>
        </div>
      );
    }

    if (type === 'range' || type === 'range-price') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
          <div className="flex items-center">
            <input
              type="range"
              min={type === 'range-price' ? '0' : '0'}
              max={type === 'range-price' ? '1000' : '1'}
              step={type === 'range-price' ? '0.01' : '0.1'}
              value={value?.toString() || (type === 'range-price' ? '99.99' : '0.5')}
              onChange={(e) => onChange(type === 'range-price' ? parseFloat(e.target.value) : e.target.value)}
              className="flex-1 mr-2"
              title={label}
              aria-label={label}
            />
            <span className="text-sm text-gray-300 w-16 text-right">
              {type === 'range-price' ? 
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number) :
                parseFloat(value?.toString() || '0.5').toFixed(1)
              }
            </span>
          </div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
          <textarea
            value={value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
            placeholder={placeholder}
            rows={3}
            title={label}
            aria-label={label}
          />
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
        <input
          type={type}
          value={value?.toString() || ''}
          onChange={(e) => {
            const val = type === 'number' ? parseFloat(e.target.value) : e.target.value;
            onChange(val);
          }}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
          placeholder={placeholder}
          title={label}
          aria-label={label}
        />
      </div>
    );
  };

  const handleAIUpdate = (newConfig: any) => {
    console.log('New config from AI in SidebarProducts:', newConfig);
    
    if (newConfig && newConfig.productsConfig) {
      // Make deep clones to avoid reference issues
      const productsConfig = JSON.parse(JSON.stringify(newConfig.productsConfig));
      
      // Call the parent's AI config update handler
      handleAIConfigUpdate(newConfig as WebsiteConfig);
      
      // Directly update local state if required
      if (onItemsChange && productsConfig.items) {
        onItemsChange(productsConfig.items);
      }
      
      if (onStylesChange && productsConfig.styles) {
        onStylesChange(productsConfig.styles);
      }
    }
  };

  // Margin Control Component
  const MarginControl = ({ 
    value, 
    onChange,
    label
  }: { 
    value: string, 
    onChange: (value: string) => void,
    label: string
  }) => {
    // Parse the margin value (assuming format like "10px 20px 10px 20px" or similar)
    const parseMarginValue = (val: string): [number, number, number, number] => {
      const defaultValue: [number, number, number, number] = [0, 0, 0, 0];
      if (!val) return defaultValue;
      
      // Remove 'px' and split by spaces
      const parts = val.split(' ')
        .map(part => parseInt(part.replace('px', '')) || 0);
      
      if (parts.length === 1) {
        return [parts[0], parts[0], parts[0], parts[0]] as [number, number, number, number]; // Same value all sides
      } else if (parts.length === 2) {
        return [parts[0], parts[1], parts[0], parts[1]] as [number, number, number, number]; // top/bottom, left/right
      } else if (parts.length === 3) {
        return [parts[0], parts[1], parts[2], parts[1]] as [number, number, number, number]; // top, left/right, bottom
      } else if (parts.length >= 4) {
        return [parts[0], parts[1], parts[2], parts[3]] as [number, number, number, number]; // top, right, bottom, left
      }
      
      return defaultValue;
    };
    
    const [margins, setMargins] = useState<[number, number, number, number]>(parseMarginValue(value));
    
    // Update margins when prop value changes
    useEffect(() => {
      setMargins(parseMarginValue(value));
    }, [value]);
    
    // Update the margin when a control changes
    const handleMarginChange = (index: number, newValue: number) => {
      const newMargins = [...margins] as [number, number, number, number];
      newMargins[index] = newValue;
      setMargins(newMargins);
      onChange(`${newMargins[0]}px ${newMargins[1]}px ${newMargins[2]}px ${newMargins[3]}px`);
    };
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
        
        <div className="relative mt-2 bg-gray-800 border border-gray-700 rounded p-4 h-48">
          {/* Outer rectangle (container) */}
          <div className="absolute inset-0 m-4 border border-gray-500 rounded"></div>
          
          {/* Inner rectangle (content) */}
          <div 
            className="absolute bg-blue-500 rounded"
            style={{
              top: `${margins[0] + 16}px`,
              right: `${margins[1] + 16}px`,
              bottom: `${margins[2] + 16}px`,
              left: `${margins[3] + 16}px`,
            }}
          ></div>
          
          {/* Top control */}
          <input 
            type="range"
            min="0"
            max="40"
            value={margins[0]}
            onChange={(e) => handleMarginChange(0, parseInt(e.target.value))}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2"
            title="Top margin"
            aria-label="Top margin"
          />
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 mt-4">
            {margins[0]}px
          </span>
          
          {/* Right control */}
          <input 
            type="range"
            min="0"
            max="40"
            value={margins[1]}
            onChange={(e) => handleMarginChange(1, parseInt(e.target.value))}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 -rotate-90 origin-right"
            title="Right margin"
            aria-label="Right margin"
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 mr-8">
            {margins[1]}px
          </span>
          
          {/* Bottom control */}
          <input 
            type="range"
            min="0"
            max="40"
            value={margins[2]}
            onChange={(e) => handleMarginChange(2, parseInt(e.target.value))}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2"
            title="Bottom margin"
            aria-label="Bottom margin"
          />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 mb-4">
            {margins[2]}px
          </span>
          
          {/* Left control */}
          <input 
            type="range"
            min="0"
            max="40"
            value={margins[3]}
            onChange={(e) => handleMarginChange(3, parseInt(e.target.value))}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 rotate-90 origin-left"
            title="Left margin"
            aria-label="Left margin"
          />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 ml-8">
            {margins[3]}px
          </span>
        </div>
        
        <div className="mt-2 flex justify-center">
          <span className="text-xs text-gray-400">
            {value}
          </span>
        </div>
      </div>
    );
  };

  const renderGlobalSettings = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Global Settings</h3>
        
        {/* Section Title */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-200 mb-2 border-b border-gray-700 pb-1">Section Title</h4>
          {renderInputField(
            'Title Text',
            productStyles.sectionTitle.text,
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, text: value })
          )}
          {renderInputField(
            'Title Color',
            productStyles.sectionTitle.color,
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, color: value }),
            'color'
          )}
          {renderInputField(
            'Title Font Size',
            productStyles.sectionTitle.fontSize,
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, fontSize: value })
          )}
          {renderInputField(
            'Title Font Weight',
            productStyles.sectionTitle.fontWeight,
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, fontWeight: value }),
            'select',
            '',
            [
              { value: '400', label: 'Regular (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semi-Bold (600)' },
              { value: '700', label: 'Bold (700)' },
              { value: '800', label: 'Extra Bold (800)' },
            ]
          )}
          {renderInputField(
            'Title Alignment',
            productStyles.sectionTitle.textAlign,
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, textAlign: value }),
            'select',
            '',
            [
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
            ]
          )}
          {renderInputField(
            'Title Text Transform',
            productStyles.sectionTitle.textTransform || 'none',
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, textTransform: value }),
            'select',
            '',
            [
              { value: 'none', label: 'None' },
              { value: 'uppercase', label: 'UPPERCASE' },
              { value: 'lowercase', label: 'lowercase' },
              { value: 'capitalize', label: 'Capitalize' },
            ]
          )}
          
          {/* Replace regular margin input with MarginControl */}
          <MarginControl
            label="Title Margin"
            value={productStyles.sectionTitle.margin}
            onChange={(value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, margin: value })}
          />
        </div>
        
        {/* Layout & Background */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-200 mb-2 border-b border-gray-700 pb-1">Layout & Background</h4>
          
          {/* Background Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">Background Type</label>
            <div className="flex items-center space-x-4">
              <div 
                className={`cursor-pointer rounded p-2 ${backgroundType === 'color' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => {
                  // First update the global style to ensure state is consistent
                  updateGlobalStyle('backgroundType', 'color');
                  // Then update local state
                  setBackgroundType('color');
                }}
              >
                <span className="text-sm">Solid Color</span>
              </div>
              <div 
                className={`cursor-pointer rounded p-2 ${backgroundType === 'gradient' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => {
                  // First update the global style to ensure state is consistent
                  updateGlobalStyle('backgroundType', 'gradient');
                  // Then update local state
                  setBackgroundType('gradient');
                }}
              >
                <span className="text-sm">Gradient</span>
              </div>
            </div>
          </div>
          
          {/* Background Color/Gradient Settings */}
          {backgroundType === 'color' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={productStyles.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    const newColor = e.target.value.toUpperCase();
                    console.log(`Selected new background color: ${newColor}`);
                    
                    // Update both the type and color in separate calls
                    updateGlobalStyle('backgroundType', 'color');
                    
                    // Small delay to ensure type is set first
                    setTimeout(() => {
                      updateGlobalStyle('backgroundColor', newColor);
                      setBackgroundType('color');
                    }, 50);
                  }}
                  className="w-10 h-10 rounded cursor-pointer"
                  aria-label="Background Color"
                />
                <input
                  type="text"
                  value={productStyles.backgroundColor || ''}
                  onChange={(e) => {
                    updateGlobalStyle('backgroundType', 'color');
                    updateGlobalStyle('backgroundColor', e.target.value);
                    setBackgroundType('color');
                  }}
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
                  placeholder="#FFFFFF"
                />
                <button 
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    // Apply the color from the picker explicitly
                    const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
                    if (colorInput) {
                      const colorValue = colorInput.value.toUpperCase();
                      updateGlobalStyle('backgroundType', 'color');
                      updateGlobalStyle('backgroundColor', colorValue);
                      setBackgroundType('color');
                    }
                  }}
                >
                  Apply
                </button>
              </div>
              <div className="mt-2 h-8 rounded" style={{ backgroundColor: productStyles.backgroundColor || '#ffffff' }}></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">Gradient Start Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={productStyles.gradientStart || '#ffffff'}
                    onChange={(e) => {
                      const newColor = e.target.value.toUpperCase();
                      console.log(`Selected new gradient start color: ${newColor}`);
                      
                      // Update type first, then color with a small delay
                      updateGlobalStyle('backgroundType', 'gradient');
                      
                      setTimeout(() => {
                        updateGlobalStyle('gradientStart', newColor);
                        setBackgroundType('gradient');
                      }, 50);
                    }}
                    className="w-10 h-10 rounded cursor-pointer"
                    aria-label="Gradient Start Color"
                  />
                  <input
                    type="text"
                    value={productStyles.gradientStart || ''}
                    onChange={(e) => {
                      updateGlobalStyle('backgroundType', 'gradient');
                      updateGlobalStyle('gradientStart', e.target.value);
                      setBackgroundType('gradient');
                    }}
                    className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
                    placeholder="#FFFFFF"
                  />
                  <button 
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      // Apply the color from the picker explicitly
                      const colorInput = document.querySelectorAll('input[type="color"]')[1] as HTMLInputElement;
                      if (colorInput) {
                        const colorValue = colorInput.value.toUpperCase();
                        updateGlobalStyle('backgroundType', 'gradient');
                        updateGlobalStyle('gradientStart', colorValue);
                        setBackgroundType('gradient');
                      }
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">Gradient End Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={productStyles.gradientEnd || '#000000'}
                    onChange={(e) => {
                      const newColor = e.target.value.toUpperCase();
                      console.log(`Selected new gradient end color: ${newColor}`);
                      
                      // Update type first, then color with a small delay
                      updateGlobalStyle('backgroundType', 'gradient');
                      
                      setTimeout(() => {
                        updateGlobalStyle('gradientEnd', newColor);
                        setBackgroundType('gradient');
                      }, 50);
                    }}
                    className="w-10 h-10 rounded cursor-pointer"
                    aria-label="Gradient End Color"
                  />
                  <input
                    type="text"
                    value={productStyles.gradientEnd || ''}
                    onChange={(e) => {
                      updateGlobalStyle('backgroundType', 'gradient');
                      updateGlobalStyle('gradientEnd', e.target.value);
                      setBackgroundType('gradient');
                    }}
                    className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
                    placeholder="#000000"
                  />
                  <button 
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      // Apply the color from the picker explicitly
                      const colorInput = document.querySelectorAll('input[type="color"]')[2] as HTMLInputElement;
                      if (colorInput) {
                        const colorValue = colorInput.value.toUpperCase();
                        updateGlobalStyle('backgroundType', 'gradient');
                        updateGlobalStyle('gradientEnd', colorValue);
                        setBackgroundType('gradient');
                      }
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">Gradient Direction</label>
                <select
                  value={productStyles.gradientDirection || 'to right'}
                  onChange={(e) => {
                    updateGlobalStyle('backgroundType', 'gradient');
                    updateGlobalStyle('gradientDirection', e.target.value);
                    setBackgroundType('gradient');
                  }}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
                  aria-label="Gradient Direction"
                >
                  <option value="to right">Left to Right</option>
                  <option value="to left">Right to Left</option>
                  <option value="to bottom">Top to Bottom</option>
                  <option value="to top">Bottom to Top</option>
                  <option value="to bottom right">Top Left to Bottom Right</option>
                  <option value="to bottom left">Top Right to Bottom Left</option>
                  <option value="to top right">Bottom Left to Top Right</option>
                  <option value="to top left">Bottom Right to Top Left</option>
                </select>
              </div>
              <div className="mt-2 h-8 rounded" style={{ 
                background: `linear-gradient(${productStyles.gradientDirection || 'to right'}, ${productStyles.gradientStart || '#ffffff'}, ${productStyles.gradientEnd || '#000000'})` 
              }}></div>
            </>
          )}
          
          {renderInputField(
            'Section Padding',
            productStyles.padding,
            (value) => updateGlobalStyle('padding', value)
          )}
          {renderInputField(
            'Container Max Width',
            productStyles.maxWidth,
            (value) => updateGlobalStyle('maxWidth', value)
          )}
          {renderInputField(
            'Container Padding',
            productStyles.containerPadding,
            (value) => updateGlobalStyle('containerPadding', value)
          )}
          {renderInputField(
            'Grid Columns',
            productStyles.gridColumns,
            (value) => updateGlobalStyle('gridColumns', value),
            'select',
            '',
            [
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' },
              { value: '4', label: '4 Columns' },
              { value: '5', label: '5 Columns' },
              { value: '6', label: '6 Columns' },
            ]
          )}
          {renderInputField(
            'Grid Gap',
            productStyles.gap,
            (value) => updateGlobalStyle('gap', value)
          )}
          {renderInputField(
            'Font Family',
            productStyles.fontFamily,
            (value) => updateGlobalStyle('fontFamily', value),
            'select',
            '',
            [
              { value: 'Inter, system-ui, sans-serif', label: 'Inter (Sans-serif)' },
              { value: 'Georgia, serif', label: 'Georgia (Serif)' },
              { value: 'ui-monospace, monospace', label: 'Monospace' },
              { value: 'Poppins, sans-serif', label: 'Poppins' },
              { value: 'Roboto, sans-serif', label: 'Roboto' },
              { value: 'Playfair Display, serif', label: 'Playfair Display' },
              { value: 'Montserrat, sans-serif', label: 'Montserrat' },
              { value: 'Lato, sans-serif', label: 'Lato' },
            ]
          )}
        </div>
        
        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  

  if (!isEditing) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-900 text-white z-50 overflow-y-auto transition-all duration-300 ease-in-out ${
        isEditing ? 'w-80 md:w-96 translate-x-0' : 'w-0 translate-x-full'
      }`}
    >
      {isEditing && (
        <>
          <div className="p-4 bg-gray-800 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Products Editor</h2>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                Save
              </button>
            </div>
            
            <div className="flex mt-4 border-b border-gray-700">
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'global' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('global')}
                title="Global Settings"
              >
                Global Settings
              </button>
             
            </div>
          </div>

          <div className="p-0 overflow-y-auto scrollbar-thin">
            { renderGlobalSettings()}
            
            {/* AI Assistant */}
           
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarProducts; 