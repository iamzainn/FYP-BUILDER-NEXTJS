import { WebsiteConfig } from "@/types/website";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://webifybackend.vercel.app";

/**
 * Service for making API calls to the backend
 */
class ApiService {
  /**
   * Register a new user
   */
  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  }

  /**
   * Verify email with code
   */
  static async verifyEmail(data: { email: string; code: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Verification failed");
    }

    const responseData = await response.json();

    // Store token in localStorage if available
    if (responseData.token) {
      localStorage.setItem("auth_token", responseData.token);
    }

    return responseData;
  }

  /**
   * Resend verification code
   */
  static async resendVerificationCode(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to resend verification code"
      );
    }

    return await response.json();
  }

  /**
   * Login user
   */
  static async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store token in localStorage if it exists in the response
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }

    return data;
  }

  /**
   * Logout user
   */
  static async logout() {
    // Clear token from localStorage
    localStorage.removeItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    return await response.json();
  }

  /**
   * Get user profile
   */
  static async getUserProfile() {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include", // Keep for backward compatibility
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user profile");
    }

    return await response.json();
  }

  /**
   * Get user's websites
   */
  static async getUserWebsites() {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/user/websites`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include", // Keep for backward compatibility
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch websites");
    }

    return await response.json();
  }

  /**
   * Create a new website
   */
  static async createWebsite(data: {
    storeName: string;
    storeConfig?: Record<string, unknown>;
  }) {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/user/websites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include", // Keep for backward compatibility
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create website");
    }

    return await response.json();
  }

  /**
   * Save website configuration
   */
  static async saveWebsiteConfig(config: WebsiteConfig): Promise<boolean> {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`/website`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include", // Keep for backward compatibility
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save website configuration"
        );
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error saving website configuration:", error);
      return false;
    }
  }

  /**
   * Fetch website configuration
   */
  static async getWebsiteConfig(
    storeId: string
  ): Promise<WebsiteConfig | null> {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_BASE_URL}/website/config/${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include", // Keep for backward compatibility
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch website configuration"
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching website configuration:", error);
      return null;
    }
  }

  /**
   * Upload a file
   */
  static async uploadFile(
    file: File,
    component: string,
    itemId?: string
  ): Promise<string | null> {
    try {
      const token = localStorage.getItem("auth_token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("component", component);
      if (itemId) {
        formData.append("itemId", itemId);
      }

      const response = await fetch("/upload", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to upload file");
      }

      return result.data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  /**
   * Get all media for a website
   */
  static async getMedia(
    websiteId = "default"
  ): Promise<Record<string, unknown>[] | null> {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`/upload?websiteId=${websiteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch media");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching media:", error);
      return null;
    }
  }
}

export { ApiService };
