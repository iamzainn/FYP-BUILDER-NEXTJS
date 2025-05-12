'use client';

import AIChat from '../AIChat';
import { UploadButton } from '@/utils/uploadthing';
import { 
  NavItem, 
  NavbarStyles, 
  WebsiteConfig,
  fontFamilies
} from './types';
import ItemEditor from './ItemEditor';
import GlobalStylesEditor from './GlobalStylesEditor';

interface NavbarEditorProps {
  navItems: NavItem[];
  navStyles: NavbarStyles;
  selectedItem: string | null;
  setSelectedItem: (id: string | null) => void;
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  onClose?: () => void;
  addNewItem: (type: 'link' | 'image' | 'text', position?: 'left' | 'center' | 'right' | 'nav') => void;
  updateItemPosition: (itemId: string, position: 'left' | 'center' | 'right' | 'nav') => void;
  updateItemStyle: (itemId: string, styleKey: string, value: string) => void;
  updateItemText: (itemId: string, field: 'label' | 'link', value: string) => void;
  deleteItem: (itemId: string) => void;
  updateGlobalStyle: (styleKey: keyof NavbarStyles, value: string) => void;
  updateItemImage: (itemId: string, imageUrl: string) => void;
  removeItemImage: (itemId: string) => void;
  apiKey?: string;
  onAIConfigUpdate: (newConfig: WebsiteConfig) => void;
}

export default function NavbarEditor({
  navItems,
  navStyles,
  selectedItem,
  setSelectedItem,
  showTooltip,
  setShowTooltip,
  isSaving,
  onSave,
  onClose,
  addNewItem,
  updateItemPosition,
  updateItemStyle,
  updateItemText,
  deleteItem,
  updateGlobalStyle,
  updateItemImage,
  removeItemImage,
  apiKey,
  onAIConfigUpdate
}: NavbarEditorProps) {
  return (
    <>
      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-10px) translateX(-50%); }
        }
        .animate-bounce-gentle {
          animation: gentle-bounce 2s ease-in-out infinite;
        }
      `}</style>
    
      {/* Edit mode help tooltip */}
      {showTooltip && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce-gentle">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Double-click on any navbar item to select and edit it
            </p>
            <button 
              onClick={() => setShowTooltip(false)} 
              className="text-white hover:text-blue-200"
              aria-label="Close tooltip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="fixed inset-y-0 right-0 h-full w-80 md:w-96 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl p-4 md:p-6 overflow-y-auto z-[9999] transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Customize Navbar
          </h2>
          <div className="flex gap-2">
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700'}`}
              aria-label={isSaving ? "Saving changes..." : "Save changes"}
              title={isSaving ? "Saving changes..." : "Save changes"}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

        {/* Instructions for selecting an item */}
        {!selectedItem && (
          <div className="mb-6 p-4 bg-indigo-900 bg-opacity-50 rounded-lg border border-indigo-800">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-300">How to Edit</h3>
                <p className="text-sm text-gray-300 mt-1">Double-click on any navbar item to select it for editing, or add a new item using the buttons below.</p>
              </div>
            </div>
          </div>
        )}

        {/* Add New Item Buttons */}
        <div className="mb-6 p-4 bg-gray-800 rounded-xl shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Add New Item</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => addNewItem('link')}
              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
              title="Add a new link to the navbar"
            >
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                </svg>
                Add Link
              </span>
            </button>
            <button
              onClick={() => addNewItem('image')}
              className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
              title="Add a new image to the navbar"
            >
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add Image
              </span>
            </button>
            <button
              onClick={() => addNewItem('text')}
              className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-sm hover:shadow-md transition-all col-span-2"
              title="Add text to the navbar"
            >
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add Text
              </span>
            </button>
          </div>
        </div>

        {selectedItem && (
          <ItemEditor 
            navItems={navItems}
            navStyles={navStyles}
            selectedItem={selectedItem}
            updateItemPosition={updateItemPosition}
            updateItemStyle={updateItemStyle}
            updateItemText={updateItemText}
            deleteItem={deleteItem}
            updateItemImage={updateItemImage}
            removeItemImage={removeItemImage}
          />
        )}

        {/* Global Settings */}
        <GlobalStylesEditor
          navStyles={navStyles}
          updateGlobalStyle={updateGlobalStyle}
        />

        {/* AI Chat Interface */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            AI Assistant
          </h3>
          
          {/* Add AIChat component */}
          {apiKey ? (
            <div className="bg-gray-800 p-2 rounded-xl shadow-inner">
              <AIChat 
                apiKey={apiKey}
                currentConfig={{
                  navbarConfig: {
                    items: navItems as any, // Type assertion to avoid type mismatch
                    styles: navStyles
                  },
                  heroConfig: null,
                  collectionConfig: null
                }}
                onConfigUpdate={onAIConfigUpdate}
              />
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Please provide an API key to use the AI assistant.
              </p>
            </div>
          )}
        </div>
        
        {/* Mobile optimization: Bottom bar with save button for small screens */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 p-4 border-t border-gray-700 flex justify-center z-[10000]">
          <button
            onClick={onSave}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg"
            aria-label="Save changes (mobile)"
            title="Save changes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
} 