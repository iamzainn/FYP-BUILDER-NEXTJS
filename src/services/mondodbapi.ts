import { WebsiteConfig } from '@/types/website';

export class MongoDBApiService {
  /**
   * Fetch website configuration
   */
  static async getWebsiteConfig(): Promise<WebsiteConfig | null> {
    try {
      const response = await fetch('/api/website', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch configuration');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching website config:', error);
      return null;
    }
  }
  
  /**
   * Fetch website configuration by store name
   */
  static async getWebsiteConfigByStoreName(storeName: string): Promise<WebsiteConfig | null> {
    try {
      const response = await fetch(`/api/website/store/${encodeURIComponent(storeName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config by store name: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch configuration by store name');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching website config by store name:', error);
      return null;
    }
  }
  
  /**
   * Save website configuration
   */
  static async saveWebsiteConfig(config: Partial<WebsiteConfig>): Promise<WebsiteConfig | null> {
    try {
      console.log("nasjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
      
      // Add debugging to see what's being sent
      console.log('Saving website config:', JSON.stringify(config, null, 2));
      
      const response = await fetch('/api/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      // Log response status for debugging
      console.log('Save config response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Try to extract error details from response
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch (parseError) {
          console.log("parseError",parseError);
          
          errorDetails = await response.text();
        }
        
        throw new Error(`Failed to save config: ${response.status} - Details: ${errorDetails}`);
      }
      
      const result = await response.json();
      console.log('Save config response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save configuration');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error saving website config:', error);
      return null;
    }
  }
  
  /**
   * Upload a file
   */
  static async uploadFile(file: File, component: string, itemId?: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('component', component);
      if (itemId) {
        formData.append('itemId', itemId);
      }
      
      console.log('Uploading file to API:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        component,
        itemId: itemId || 'not provided'
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      // Log the response details for debugging
      const responseStatus = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      console.log('Upload response status:', responseStatus);
      
      if (!response.ok) {
        // Try to get more details from the error response
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch (parseError) {
          console.log("parseError",parseError);
          
          errorDetails = await response.text();
        }
        
        throw new Error(`Failed to upload file: ${response.status} - ${response.statusText}. Details: ${errorDetails}`);
      }
      
      const result = await response.json();
      console.log('Upload result:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to upload file');
      }
      
      return result.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      return null;
    }
  }
  
  /**
   * Get all media for a website
   */
  static async getMedia(websiteId = 'default'): Promise<Record<string, unknown>[] | null> {
    try {
      const response = await fetch(`/api/upload?websiteId=${websiteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch media');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      return null;
    }
  }
} 