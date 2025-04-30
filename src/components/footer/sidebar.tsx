import React, { useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import AIChat from '../AIChat';

// Define the proper interfaces
interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

interface SocialLink {
  id: string;
  platform: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterStyles {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  linkHoverColor: string;
  borderColor: string;
  padding: string;
  fontFamily: string;
  useGradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string;
  footerBottom: {
    backgroundColor: string;
    textColor: string;
    useGradient: boolean;
    gradientFrom: string;
    gradientTo: string;
    gradientDirection: string;
  };
}

interface FooterSidebarProps {
  isEditing: boolean;
  selectedItem: string | null;
  footerColumns: FooterColumn[];
  socialLinks: SocialLink[];
  footerStyles: FooterStyles;
  handleSave: () => void;
  setFooterColumns?: React.Dispatch<React.SetStateAction<FooterColumn[]>>;
  setSocialLinks?: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  setFooterStyles?: React.Dispatch<React.SetStateAction<FooterStyles>>;
  apiKey?: string;
  handleAIConfigUpdate?: (newConfig: { footerConfig: { columns: FooterColumn[], styles: FooterStyles, socialLinks: SocialLink[] } }) => void;
}

// Font families options
const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'system-ui',
  'Roboto',
  'Inter',
  'Open Sans'
];

// Gradient directions options
const gradientDirections = [
  'to right',
  'to left',
  'to bottom',
  'to top',
  'to right bottom',
  'to right top',
  'to left bottom',
  'to left top'
];

const FooterSidebar: React.FC<FooterSidebarProps> = ({
  isEditing,
  selectedItem,
  footerColumns,
  socialLinks,
  footerStyles,
  handleSave,
  setFooterColumns,
  setSocialLinks,
  setFooterStyles,
  apiKey,
  handleAIConfigUpdate
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'global' | 'columns' | 'social' | 'ai'>('global');
  
  // State for new column and link
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('/');
  
  if (!isEditing) return null;
  
  // Handler to update footer styles
  const updateFooterStyle = (key: string, value: string | boolean) => {
    if (setFooterStyles) {
      setFooterStyles(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  // Handler to update footer bottom styles
  const updateFooterBottomStyle = (key: string, value: string | boolean) => {
    if (setFooterStyles) {
      setFooterStyles(prev => ({
        ...prev,
        footerBottom: {
          ...prev.footerBottom,
          [key]: value
        }
      }));
    }
  };

  // Handler for AI config updates
  const handleFooterAIUpdate = (newConfig: any) => {
    if (newConfig.footerConfig && handleAIConfigUpdate) {
      handleAIConfigUpdate(newConfig);
      
      if (newConfig.footerConfig.columns && setFooterColumns) {
        setFooterColumns(newConfig.footerConfig.columns);
      }
      
      if (newConfig.footerConfig.styles && setFooterStyles) {
        setFooterStyles(newConfig.footerConfig.styles);
      }
      
      if (newConfig.footerConfig.socialLinks && setSocialLinks) {
        setSocialLinks(newConfig.footerConfig.socialLinks);
      }
    }
  };

  // Handler to add a new column
  const addNewColumn = () => {
    if (setFooterColumns && newColumnTitle.trim()) {
      const newColumn: FooterColumn = {
        id: `column-${Date.now()}`,
        title: newColumnTitle,
        links: []
      };
      
      setFooterColumns(prev => [...prev, newColumn]);
      setNewColumnTitle('');
    }
  };

  // Handler to update column title
  const updateColumnTitle = (columnId: string, newTitle: string) => {
    if (setFooterColumns) {
      setFooterColumns(prev => 
        prev.map(column => 
          column.id === columnId ? { ...column, title: newTitle } : column
        )
      );
    }
  };

  // Handler to delete a column
  const deleteColumn = (columnId: string) => {
    if (setFooterColumns) {
      setFooterColumns(prev => prev.filter(column => column.id !== columnId));
    }
  };

  // Handler to add a new link to a column
  const addNewLink = (columnId: string) => {
    if (setFooterColumns && newLinkLabel.trim()) {
      const newLink: FooterLink = {
        id: `link-${Date.now()}`,
        label: newLinkLabel,
        href: newLinkHref
      };
      
      setFooterColumns(prev => 
        prev.map(column => 
          column.id === columnId
            ? { ...column, links: [...column.links, newLink] }
            : column
        )
      );
      
      setNewLinkLabel('');
      setNewLinkHref('/');
    }
  };

  // Handler to update a link
  const updateLink = (columnId: string, linkId: string, field: 'label' | 'href', value: string) => {
    if (setFooterColumns) {
      setFooterColumns(prev => 
        prev.map(column => 
          column.id === columnId
            ? {
                ...column,
                links: column.links.map(link => 
                  link.id === linkId
                    ? { ...link, [field]: value }
                    : link
                )
              }
            : column
        )
      );
    }
  };

  // Handler to delete a link
  const deleteLink = (columnId: string, linkId: string) => {
    if (setFooterColumns) {
      setFooterColumns(prev => 
        prev.map(column => 
          column.id === columnId
            ? { ...column, links: column.links.filter(link => link.id !== linkId) }
            : column
        )
      );
    }
  };

  // Get the ID parts from a selected item (format: column-columnId or link-columnId-linkId)
  const getSelectedItemParts = () => {
    if (!selectedItem) return null;
    
    const parts = selectedItem.split('-');
    if (parts[0] === 'column' && parts.length >= 2) {
      return { type: 'column', columnId: parts.slice(1).join('-') };
    } else if (parts[0] === 'link' && parts.length >= 3) {
      return { 
        type: 'link', 
        columnId: parts[1], 
        linkId: parts.slice(2).join('-') 
      };
    } else if (parts[0] === 'social' && parts.length >= 2) {
      return { type: 'social', platformId: parts.slice(1).join('-') };
    }
    
    return null;
  };

  // Get the selected column or link
  const selectedItemParts = getSelectedItemParts();
  const selectedColumn = selectedItemParts?.type === 'column'
    ? footerColumns.find(col => col.id === selectedItemParts.columnId)
    : null;
  
  const selectedLink = selectedItemParts?.type === 'link'
    ? footerColumns
        .find(col => col.id === selectedItemParts.columnId)
        ?.links.find(link => link.id === selectedItemParts.linkId)
    : null;

  const selectedSocialLink = selectedItemParts?.type === 'social'
    ? socialLinks.find(link => link.id === selectedItemParts.platformId)
    : null;

  return (
    <div className="fixed inset-y-0 right-0 h-full w-80 md:w-96 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl p-4 md:p-6 overflow-y-auto z-[9999] transform transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Customize Footer
        </h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          aria-label="Save changes"
          title="Save changes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Save
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === 'global' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('global')}
        >
          Global Styles
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === 'columns' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('columns')}
        >
          Columns
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === 'social' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('social')}
        >
          Social
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('ai')}
        >
          AI Help
        </button>
      </div>
      
      {/* Global Styles Tab */}
      {activeTab === 'global' && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Main Footer Appearance</h3>
            
            {/* Background Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Background Type
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateFooterStyle('useGradient', false)}
                  className={`px-3 py-2 rounded flex-1 ${!footerStyles.useGradient ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => updateFooterStyle('useGradient', true)}
                  className={`px-3 py-2 rounded flex-1 ${footerStyles.useGradient ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Gradient
                </button>
              </div>
            </div>
            
            {/* Background Color */}
            {!footerStyles.useGradient ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={footerStyles.backgroundColor}
                    onChange={(e) => updateFooterStyle('backgroundColor', e.target.value)}
                    className="h-10 w-10 rounded border border-gray-600 mr-2"
                    title="Select background color"
                  />
                  <span className="text-sm">{footerStyles.backgroundColor}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gradient From
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={footerStyles.gradientFrom}
                      onChange={(e) => updateFooterStyle('gradientFrom', e.target.value)}
                      className="h-10 w-10 rounded border border-gray-600 mr-2"
                      title="Select gradient start color"
                    />
                    <span className="text-sm">{footerStyles.gradientFrom}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gradient To
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={footerStyles.gradientTo}
                      onChange={(e) => updateFooterStyle('gradientTo', e.target.value)}
                      className="h-10 w-10 rounded border border-gray-600 mr-2"
                      title="Select gradient end color"
                    />
                    <span className="text-sm">{footerStyles.gradientTo}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gradient Direction
                  </label>
                  <select
                    value={footerStyles.gradientDirection}
                    onChange={(e) => updateFooterStyle('gradientDirection', e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    title="Select gradient direction"
                  >
                    {gradientDirections.map(direction => (
                      <option key={direction} value={direction}>
                        {direction}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {/* Text Colors */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Text Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={footerStyles.textColor}
                  onChange={(e) => updateFooterStyle('textColor', e.target.value)}
                  className="h-10 w-10 rounded border border-gray-600 mr-2"
                  title="Select text color"
                />
                <span className="text-sm">{footerStyles.textColor}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Heading Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={footerStyles.headingColor}
                  onChange={(e) => updateFooterStyle('headingColor', e.target.value)}
                  className="h-10 w-10 rounded border border-gray-600 mr-2"
                  title="Select heading color"
                />
                <span className="text-sm">{footerStyles.headingColor}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Link Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={footerStyles.linkColor}
                  onChange={(e) => updateFooterStyle('linkColor', e.target.value)}
                  className="h-10 w-10 rounded border border-gray-600 mr-2"
                  title="Select link color"
                />
                <span className="text-sm">{footerStyles.linkColor}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Link Hover Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={footerStyles.linkHoverColor}
                  onChange={(e) => updateFooterStyle('linkHoverColor', e.target.value)}
                  className="h-10 w-10 rounded border border-gray-600 mr-2"
                  title="Select link hover color"
                />
                <span className="text-sm">{footerStyles.linkHoverColor}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Border Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={footerStyles.borderColor}
                  onChange={(e) => updateFooterStyle('borderColor', e.target.value)}
                  className="h-10 w-10 rounded border border-gray-600 mr-2"
                  title="Select border color"
                />
                <span className="text-sm">{footerStyles.borderColor}</span>
              </div>
            </div>
            
            {/* Font Family */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Font Family
              </label>
              <select
                value={footerStyles.fontFamily}
                onChange={(e) => updateFooterStyle('fontFamily', e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                title="Select font family"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Padding */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Padding
              </label>
              <input
                type="text"
                value={footerStyles.padding}
                onChange={(e) => updateFooterStyle('padding', e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                placeholder="e.g., 3rem 1.5rem"
                title="Enter padding values"
              />
            </div>
          </div>
          
          {/* Footer Bottom Styles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Footer Bottom Appearance</h3>
            
            {/* Background Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Background Type
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateFooterBottomStyle('useGradient', false)}
                  className={`px-3 py-2 rounded flex-1 ${!footerStyles.footerBottom.useGradient ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => updateFooterBottomStyle('useGradient', true)}
                  className={`px-3 py-2 rounded flex-1 ${footerStyles.footerBottom.useGradient ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Gradient
                </button>
              </div>
            </div>
            
            {/* Background Color */}
            {!footerStyles.footerBottom.useGradient ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={footerStyles.footerBottom.backgroundColor}
                    onChange={(e) => updateFooterBottomStyle('backgroundColor', e.target.value)}
                    className="h-10 w-10 rounded border border-gray-600 mr-2"
                    title="Select bottom background color"
                  />
                  <span className="text-sm">{footerStyles.footerBottom.backgroundColor}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gradient From
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={footerStyles.footerBottom.gradientFrom}
                      onChange={(e) => updateFooterBottomStyle('gradientFrom', e.target.value)}
                      className="h-10 w-10 rounded border border-gray-600 mr-2"
                      title="Select bottom gradient start color"
                    />
                    <span className="text-sm">{footerStyles.footerBottom.gradientFrom}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gradient To
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={footerStyles.footerBottom.gradientTo}
                      onChange={(e) => updateFooterBottomStyle('gradientTo', e.target.value)}
                      className="h-10 w-10 rounded border border-gray-600 mr-2"
                      title="Select bottom gradient end color"
                    />
                    <span className="text-sm">{footerStyles.footerBottom.gradientTo}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gradient Direction
                  </label>
                  <select
                    value={footerStyles.footerBottom.gradientDirection}
                    onChange={(e) => updateFooterBottomStyle('gradientDirection', e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    title="Select bottom gradient direction"
                  >
                    {gradientDirections.map(direction => (
                      <option key={direction} value={direction}>
                        {direction}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {/* Text Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Text Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={footerStyles.footerBottom.textColor}
                  onChange={(e) => updateFooterBottomStyle('textColor', e.target.value)}
                  className="h-10 w-10 rounded border border-gray-600 mr-2"
                  title="Select bottom text color"
                />
                <span className="text-sm">{footerStyles.footerBottom.textColor}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Columns Tab */}
      {activeTab === 'columns' && (
        <div className="space-y-4">
          {/* Selected column/link editor */}
          {selectedItemParts && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {selectedItemParts.type === 'column' ? 'Edit Column' : 'Edit Link'}
                </h3>
                <button
                  onClick={() => {
                    if (selectedItemParts.type === 'column' && selectedItemParts.columnId) {
                      deleteColumn(selectedItemParts.columnId);
                    } else if (selectedItemParts.type === 'link' && selectedItemParts.columnId && selectedItemParts.linkId) {
                      deleteLink(selectedItemParts.columnId, selectedItemParts.linkId);
                    }
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                  title={`Delete ${selectedItemParts.type}`}
                  aria-label={`Delete ${selectedItemParts.type}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>

              {/* Column Editor */}
              {selectedItemParts.type === 'column' && selectedColumn && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Column Title
                    </label>
                    <input
                      type="text"
                      value={selectedColumn.title}
                      onChange={(e) => updateColumnTitle(selectedColumn.id, e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter column title"
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-2">
                    <h4 className="text-md font-semibold text-blue-300 mb-3">Links in this column</h4>
                    
                    {selectedColumn.links.length > 0 ? (
                      <ul className="space-y-2 mb-4">
                        {selectedColumn.links.map(link => (
                          <li 
                            key={link.id}
                            className={`p-2 rounded ${selectedItemParts.type === 'link' && selectedItemParts.linkId === link.id ? 'bg-blue-900' : 'bg-gray-700 hover:bg-gray-600'} cursor-pointer`}
                            onClick={() => selectedItemParts.type === 'link' && selectedItemParts.linkId === link.id ? null : window.dispatchEvent(new CustomEvent('selectFooterItem', { detail: `link-${selectedColumn.id}-${link.id}` }))}
                          >
                            <div className="text-sm font-medium">{link.label}</div>
                            <div className="text-xs text-gray-400">{link.href}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm mb-4">No links in this column yet.</p>
                    )}

                    <div className="bg-gray-700 p-3 rounded-lg">
                      <h5 className="text-sm font-medium mb-2 text-blue-200">Add New Link</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Link Label
                          </label>
                          <input
                            type="text"
                            value={newLinkLabel}
                            onChange={(e) => setNewLinkLabel(e.target.value)}
                            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Contact Us"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Link URL
                          </label>
                          <input
                            type="text"
                            value={newLinkHref}
                            onChange={(e) => setNewLinkHref(e.target.value)}
                            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., /contact"
                          />
                        </div>
                        <button
                          onClick={() => addNewLink(selectedColumn.id)}
                          disabled={!newLinkLabel.trim()}
                          className={`w-full px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${newLinkLabel.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Link Editor */}
              {selectedItemParts.type === 'link' && selectedLink && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Link Label
                    </label>
                    <input
                      type="text"
                      value={selectedLink.label}
                      onChange={(e) => {
                        if (selectedItemParts.columnId && selectedLink.id) {
                          updateLink(selectedItemParts.columnId, selectedLink.id, 'label', e.target.value);
                        }
                      }}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter link label"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={selectedLink.href}
                      onChange={(e) => {
                        if (selectedItemParts.columnId && selectedLink.id) {
                          updateLink(selectedItemParts.columnId, selectedLink.id, 'href', e.target.value);
                        }
                      }}
                      className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter link URL (e.g., /contact)"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Columns List */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Footer Columns</h3>
            
            {footerColumns.length > 0 ? (
              <div className="space-y-3 mb-6">
                {footerColumns.map(column => (
                  <div 
                    key={column.id}
                    className={`p-3 rounded-lg cursor-pointer ${selectedItemParts?.type === 'column' && selectedItemParts.columnId === column.id ? 'bg-blue-900 ring-2 ring-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => selectedItemParts?.type === 'column' && selectedItemParts.columnId === column.id ? null : window.dispatchEvent(new CustomEvent('selectFooterItem', { detail: `column-${column.id}` }))}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{column.title}</h4>
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                        {column.links.length} {column.links.length === 1 ? 'link' : 'links'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No columns defined yet.</p>
            )}

            {/* Add New Column Form */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-blue-200">Add New Column</h4>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-400">
                    Column Title
                  </label>
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Quick Links"
                  />
                </div>
                <button
                  onClick={addNewColumn}
                  disabled={!newColumnTitle.trim()}
                  className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${newColumnTitle.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Social & Contact Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          {/* Selected social link editor */}
          {selectedItemParts?.type === 'social' && selectedSocialLink && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Social Link
                </h3>
                <button
                  onClick={() => {
                    if (setSocialLinks) {
                      setSocialLinks(prev => prev.filter(link => link.id !== selectedSocialLink.id));
                    }
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                  title="Delete social link"
                  aria-label="Delete social link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={selectedSocialLink.platform}
                  onChange={(e) => {
                    if (setSocialLinks) {
                      setSocialLinks(prev => 
                        prev.map(link => 
                          link.id === selectedSocialLink.id
                            ? { ...link, platform: e.target.value }
                            : link
                        )
                      );
                    }
                  }}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Facebook, Twitter, Instagram"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  URL
                </label>
                <input
                  type="text"
                  value={selectedSocialLink.href}
                  onChange={(e) => {
                    if (setSocialLinks) {
                      setSocialLinks(prev => 
                        prev.map(link => 
                          link.id === selectedSocialLink.id
                            ? { ...link, href: e.target.value }
                            : link
                        )
                      );
                    }
                  }}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., https://facebook.com/yourpage"
                />
              </div>

              <div className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
                <p>Icon settings are managed automatically based on the platform type.</p>
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Social Media Links</h3>
            
            {socialLinks.length > 0 ? (
              <div className="space-y-3 mb-6">
                {socialLinks.map(social => (
                  <div 
                    key={social.id}
                    className={`p-3 rounded-lg cursor-pointer ${selectedItemParts?.type === 'social' && selectedItemParts.platformId === social.id ? 'bg-blue-900 ring-2 ring-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => selectedItemParts?.type === 'social' && selectedItemParts.platformId === social.id ? null : window.dispatchEvent(new CustomEvent('selectFooterItem', { detail: `social-${social.id}` }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-600 rounded-full">
                        {/* Render a simple placeholder icon instead of trying to render social.icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">{social.platform}</h4>
                        <div className="text-xs text-gray-400 truncate max-w-[200px]">
                          {social.href}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No social media links defined yet.</p>
            )}

            {/* Add New Social Link - Simplified for now */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-blue-200">Add More Platforms</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (setSocialLinks) {
                      const newSocialLink: SocialLink = {
                        id: `linkedin-${Date.now()}`,
                        platform: 'LinkedIn',
                        href: 'https://linkedin.com',
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                          </svg>
                        )
                      };
                      setSocialLinks(prev => [...prev, newSocialLink]);
                    }
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  {/* Use a static SVG instead of the dynamic icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                  LinkedIn
                </button>
                
                <button
                  onClick={() => {
                    if (setSocialLinks) {
                      const newSocialLink: SocialLink = {
                        id: `tiktok-${Date.now()}`,
                        platform: 'TikTok',
                        href: 'https://tiktok.com',
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          </svg>
                        )
                      };
                      setSocialLinks(prev => [...prev, newSocialLink]);
                    }
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  {/* Use a static SVG instead of the dynamic icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  TikTok
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Newsletter Settings</h3>
            <p className="text-gray-400 text-sm">
              Newsletter settings will be added in a future update.
            </p>
          </div>
        </div>
      )}
      
      {/* AI Chat Tab */}
      {activeTab === 'ai' && apiKey && (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">AI Assistant</h3>
            <p className="text-gray-400 text-sm mb-4">
              Ask the AI to help you design your footer. Try asking for specific styles, colors, layouts, or content suggestions.
            </p>
            
            <div className="bg-indigo-900 bg-opacity-50 p-3 rounded-lg mb-4">
              <p className="text-indigo-200 text-sm">
                <strong>Examples:</strong>
              </p>
              <ul className="mt-2 space-y-2 text-xs text-indigo-200">
                <li>• &quot;Create a dark footer with social media icons&quot;</li>
                <li>• &quot;Update the footer columns with services and contact info&quot;</li>
                <li>• &quot;Design a footer with a blue gradient background&quot;</li>
                <li>• &quot;Add a newsletter signup form to the footer&quot;</li>
              </ul>
            </div>
            
            {/* AI Chat Component */}
            <AIChat 
              apiKey={apiKey}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
              currentConfig={{
                footerConfig: {
                  columns: footerColumns,
                  styles: footerStyles,
                  socialLinks: socialLinks
                }
              } as any}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
              onConfigUpdate={handleFooterAIUpdate as any}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterSidebar; 