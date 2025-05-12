'use client';

import { NavbarStyles, fontFamilies } from './types';

interface GlobalStylesEditorProps {
  navStyles: NavbarStyles;
  updateGlobalStyle: (styleKey: keyof NavbarStyles, value: string) => void;
}

export default function GlobalStylesEditor({
  navStyles,
  updateGlobalStyle
}: GlobalStylesEditorProps) {
  return (
    <div className="border-t border-gray-700 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Global Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Background Color */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Navbar Background
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={navStyles.backgroundColor}
              onChange={(e) => updateGlobalStyle('backgroundColor', e.target.value)}
              className="h-10 w-10 rounded border border-gray-600 mr-2"
              aria-label="Navbar background color"
              title="Select navbar background color"
            />
            <span className="text-sm">{navStyles.backgroundColor}</span>
          </div>
        </div>

        {/* Global Text Color */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Global Text Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={navStyles.color}
              onChange={(e) => updateGlobalStyle('color', e.target.value)}
              className="h-10 w-10 rounded border border-gray-600 mr-2"
              aria-label="Global text color"
              title="Select global text color"
            />
            <span className="text-sm">{navStyles.color}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-800 p-3 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Global Font Family
        </label>
        <select
          value={navStyles.fontFamily}
          onChange={(e) => updateGlobalStyle('fontFamily', e.target.value)}
          className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Global font family"
          title="Select global font family"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Padding */}
      <div className="mt-4 bg-gray-800 p-3 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Navbar Padding
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="4"
            step="0.5"
            value={parseFloat(navStyles.padding)}
            onChange={(e) => updateGlobalStyle('padding', `${e.target.value}rem`)}
            className="w-full accent-blue-500"
            aria-label="Navbar padding"
            title="Adjust navbar padding"
          />
          <span className="text-sm bg-gray-700 px-2 py-1 rounded">{navStyles.padding}</span>
        </div>
      </div>
    </div>
  );
} 