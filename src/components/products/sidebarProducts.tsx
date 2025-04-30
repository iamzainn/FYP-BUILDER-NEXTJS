import React, { useState, useEffect } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import AIChat from '../AIChat';
import { ProductItem, ProductStyles, WebsiteConfig } from '../../types/websiteConfig';

interface SidebarProductsProps {
  isEditing: boolean;
  selectedItem: string | null;
  productItems: ProductItem[];
  productStyles: ProductStyles;
  handleSave: () => void;
  addNewProduct: () => void;
  updateProductDetails: (itemId: string, field: keyof ProductItem, value: any) => void;
  updateProductStyle: (itemId: string, styleKey: string, value: string | boolean) => void;
  updateAllProductsStyle: (styleKey: string, value: string | boolean) => void;
  updateGlobalStyle: (styleKey: string, value: string | number | Record<string, string>) => void;
  deleteProduct: (itemId: string) => void;
  apiKey?: string;
  handleAIConfigUpdate: (newConfig: WebsiteConfig) => void;
}

const SidebarProducts: React.FC<SidebarProductsProps> = ({
  isEditing,
  // selectedItem,
  // productItems,
  productStyles,
  handleSave,
  // addNewProduct,
  // updateProductDetails,
  // updateProductStyle,
  // updateAllProductsStyle,
  updateGlobalStyle,
  // deleteProduct,
  apiKey,
  handleAIConfigUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'individual'>('global');
  const [backgroundType, setBackgroundType] = useState<'color' | 'gradient'>(
    productStyles.backgroundType || 'color'
  );
  
  useEffect(() => {
    setBackgroundType(productStyles.backgroundType || 'color');
  }, [productStyles.backgroundType]);

  const renderInputField = (
    label: string,
    value: string | number | undefined,
    onChange: (value: any) => void,
    type: string = 'text',
    placeholder: string = '',
    options?: { value: string; label: string }[]
  ) => {
    if (!isEditing) return null;

    if (type === 'color') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
          <div className="flex items-center">
            <input
              type="color"
              value={value?.toString() || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded mr-2"
              title={label}
              aria-label={label}
            />
            <input
              type="text"
              value={value?.toString() || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
              placeholder={placeholder}
            />
          </div>
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
          {renderInputField(
            'Title Margin',
            productStyles.sectionTitle.margin,
            (value) => updateGlobalStyle('sectionTitle', { ...productStyles.sectionTitle, margin: value })
          )}
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
                onClick={() => setBackgroundType('color')}
              >
                <span className="text-sm">Solid Color</span>
              </div>
              <div 
                className={`cursor-pointer rounded p-2 ${backgroundType === 'gradient' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setBackgroundType('gradient')}
              >
                <span className="text-sm">Gradient</span>
              </div>
            </div>
          </div>
          
          {/* Background Color/Gradient Settings */}
          {backgroundType === 'color' ? (
            renderInputField(
              'Background Color',
              productStyles.backgroundColor,
              (value) => {
                updateGlobalStyle('backgroundColor', value);
                updateGlobalStyle('backgroundType', 'color');
              },
              'color'
            )
          ) : (
            <>
              {renderInputField(
                'Gradient Start Color',
                productStyles.gradientStart || '#ffffff',
                (value) => {
                  updateGlobalStyle('gradientStart', value);
                  updateGlobalStyle('backgroundType', 'gradient');
                },
                'color'
              )}
              
              {renderInputField(
                'Gradient End Color',
                productStyles.gradientEnd || '#000000',
                (value) => {
                  updateGlobalStyle('gradientEnd', value);
                  updateGlobalStyle('backgroundType', 'gradient');
                },
                'color'
              )}
              
              {renderInputField(
                'Gradient Direction',
                productStyles.gradientDirection || 'to right',
                (value) => {
                  updateGlobalStyle('gradientDirection', value);
                  updateGlobalStyle('backgroundType', 'gradient');
                },
                'select',
                '',
                [
                  { value: 'to right', label: 'Left to Right' },
                  { value: 'to left', label: 'Right to Left' },
                  { value: 'to bottom', label: 'Top to Bottom' },
                  { value: 'to top', label: 'Bottom to Top' },
                  { value: 'to bottom right', label: 'Top Left to Bottom Right' },
                  { value: 'to bottom left', label: 'Top Right to Bottom Left' },
                  { value: 'to top right', label: 'Bottom Left to Top Right' },
                  { value: 'to top left', label: 'Bottom Right to Top Left' },
                ]
              )}
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

  // const selectedProduct = selectedItem ? productItems.find(item => item.id === selectedItem) : null;

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
            {activeTab === 'global' && renderGlobalSettings()}
            
            {/* AI Assistant */}
            {apiKey && (
              <div className="p-4 border-t border-gray-700 mt-4">
                <AIChat
                  apiKey={apiKey}
                  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  currentConfig={{
                    // @ts-expect-error - 'productConfig' is needed for internal API compatibility though not in WebsiteConfig type
                    productConfig: {
                      items: [],
                      styles: productStyles
                    }
                  }}
                  onConfigUpdate={handleAIConfigUpdate}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarProducts; 