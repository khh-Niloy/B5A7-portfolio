import toast from "react-hot-toast";

export enum ErrorType {
  VALIDATION = "validation",
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  SERVER = "server",
  CLIENT = "client",
  UNKNOWN = "unknown",
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string | number;
}

export const classifyError = (error: unknown): ErrorInfo => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes("fetch") || message.includes("network") || message.includes("connection")) {
      return {
        type: ErrorType.NETWORK,
        message: "Network error. Please check your connection and try again.",
        details: error.message,
      };
    }
    
    if (message.includes("401") || message.includes("unauthorized") || message.includes("authentication")) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: "Authentication failed. Please log in again.",
        details: error.message,
      };
    }
    
    if (message.includes("403") || message.includes("forbidden") || message.includes("permission")) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: "You don't have permission to perform this action.",
        details: error.message,
      };
    }
    
    if (message.includes("500") || message.includes("server error") || message.includes("internal")) {
      return {
        type: ErrorType.SERVER,
        message: "Server error. Please try again later.",
        details: error.message,
      };
    }
    
    if (message.includes("400") || message.includes("bad request") || message.includes("validation")) {
      return {
        type: ErrorType.CLIENT,
        message: "Invalid request. Please check your input and try again.",
        details: error.message,
      };
    }
    
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      details: error.message,
    };
  }
  
  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      return {
        type: ErrorType.UNKNOWN,
        message: (error as { message: string }).message,
        details: JSON.stringify(error),
      };
    }
  }
  
  return {
    type: ErrorType.UNKNOWN,
    message: "An unexpected error occurred. Please try again.",
    details: String(error),
  };
};

export const showErrorToast = (error: unknown, customMessage?: string) => {
  const errorInfo = classifyError(error);
  const message = customMessage || errorInfo.message;
  
  toast.error(message, {
    duration: 5000,
    position: "top-right",
    style: {
      background: "#1f2937",
      color: "#fca5a5",
      border: "1px solid #ef4444",
    },
  });
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#1f2937",
      color: "#86efac",
      border: "1px solid #10b981",
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    duration: 4000,
    position: "top-right",
    icon: "⚠️",
    style: {
      background: "#1f2937",
      color: "#fbbf24",
      border: "1px solid #f59e0b",
    },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    position: "top-right",
    icon: "ℹ️",
    style: {
      background: "#1f2937",
      color: "#60a5fa",
      border: "1px solid #3b82f6",
    },
  });
};

export const handleApiResponse = async <T>(
  response: Response,
  successMessage?: string
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      
      return {
        success: false,
        error: errorMessage,
      };
    }
    
    const data = await response.json();
    
    if (successMessage) {
      showSuccessToast(successMessage);
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorInfo = classifyError(error);
    return {
      success: false,
      error: errorInfo.message,
    };
  }
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  options: {
    successMessage?: string;
    errorMessage?: string;
    onError?: (error: unknown) => void;
    onSuccess?: (result: T) => void;
  } = {}
): Promise<T | null> => {
  try {
    const result = await operation();
    
    if (options.successMessage) {
      showSuccessToast(options.successMessage);
    }
    
    if (options.onSuccess) {
      options.onSuccess(result);
    }
    
    return result;
  } catch (error) {
    const errorInfo = classifyError(error);
    const message = options.errorMessage || errorInfo.message;
    
    showErrorToast(error, message);
    
    if (options.onError) {
      options.onError(error);
    }
    
    return null;
  }
};

export const createLoadingState = () => {
  let isLoading = false;
  
  return {
    get isLoading() {
      return isLoading;
    },
    setLoading: (loading: boolean) => {
      isLoading = loading;
    },
    withLoading: async <T>(operation: () => Promise<T>): Promise<T | null> => {
      if (isLoading) return null;
      
      isLoading = true;
      try {
        return await operation();
      } finally {
        isLoading = false;
      }
    },
  };
};
