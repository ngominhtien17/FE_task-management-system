// 1. CONSTANTS - Định nghĩa các giá trị đặc biệt
// =================================================================
export const SELECT_VALUES = {
    ALL: '__ALL__',
    NONE: '__NONE__',
    EMPTY: '__EMPTY__'
} as const;
  
  // 2. UTILITY FUNCTIONS - Hàm tiện ích xử lý giá trị Select
  // =================================================================
export const selectUtils = {
    // Kiểm tra xem giá trị có phải là "tất cả" không
    isAllValue: (value: string) => value === SELECT_VALUES.ALL,
    
    // Kiểm tra xem giá trị có phải là "không có" không  
    isNoneValue: (value: string) => value === SELECT_VALUES.NONE,
    
    // Kiểm tra xem giá trị có phải là rỗng không
    isEmptyValue: (value: string) => !value || value === SELECT_VALUES.EMPTY,
    
    // Chuyển đổi giá trị để sử dụng trong filter/search
    getFilterValue: (value: string) => {
      if (selectUtils.isAllValue(value) || selectUtils.isEmptyValue(value)) {
        return undefined;
      }
      if (selectUtils.isNoneValue(value)) {
        return null;
      }
      return value;
    }
};