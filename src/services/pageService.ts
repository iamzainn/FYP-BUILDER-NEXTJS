/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Type definitions
export interface PageComponent {
  id: number;
  componentType: string;
  content: any;
  order: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  pageType: string;
  isPublished: boolean;
  pageOrder: number;
  components: Record<string, any>;
}

export interface PageUpdate {
  componentUpdates: {
    componentType: string;
    content: any;
  }[];
}

// Service class for page operations
class PageService {
  // Get a page by ID with all components
  async getPageById(pageId: number): Promise<Page> {
    try {
      const response = await axios.get(`/api/pages/${pageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page by ID:', error);
      throw error;
    }
  }

  // Get all pages for a store
  async getPagesByStore(storeName: string, options?: { slug?: string; type?: string }): Promise<Page[]> {
    try {
      let url = `/api/stores/${storeName}/pages`;
      
      // Add query parameters if provided
      if (options) {
        const params = new URLSearchParams();
        if (options.slug) params.append('slug', options.slug);
        if (options.type) params.append('type', options.type);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching pages by store:', error);
      throw error;
    }
  }

  // Get the homepage for a store
  async getHomePage(storeName: string): Promise<Page | null> {
    try {
      const pages = await this.getPagesByStore(storeName, { type: 'HOME' });
      return pages.length > 0 ? pages[0] : null;
    } catch (error) {
      console.error('Error fetching homepage:', error);
      throw error;
    }
  }

  // Update a page's components
  async updatePageComponents(pageId: number, updates: PageUpdate): Promise<Page> {
    console.log('Updating page components:', pageId, updates);
    try {
      const response = await axios.patch(`/api/pages/${pageId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating page components:', error);
      throw error;
    }
  }

  // Update a single component type
  async updateComponent(pageId: number, componentType: string, content: any): Promise<Page> {
    console.log('Updating component:', pageId, componentType, content);
    return this.updatePageComponents(pageId, {
      componentUpdates: [{
        componentType,
        content
      }]
    });
  }
}

// Export singleton instance
export const pageService = new PageService(); 