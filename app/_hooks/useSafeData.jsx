"use client";

import { useState, useEffect, useCallback } from "react";
import { isSafeArray, isSafeToRender, safeProp } from "@/app/_utils/safeDataAccess";

/**
 * Hook để xử lý dữ liệu API an toàn tránh null/undefined errors
 * 
 * @param {Function} fetchFn - Function để fetch dữ liệu
 * @param {Object} options - Tùy chọn
 * @param {Array} options.dependencies - Dependencies cho useEffect
 * @param {boolean} options.autoFetch - Tự động fetch khi mount
 * @param {Object} options.initialData - Dữ liệu khởi tạo
 * @param {Array<string>} options.requiredFields - Các trường bắt buộc
 * @returns {Object} - Trạng thái và functions
 */
export function useSafeData(fetchFn, options = {}) {
  const {
    dependencies = [],
    autoFetch = true,
    initialData = null,
    requiredFields = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValidData, setIsValidData] = useState(false);

  // Function fetch dữ liệu an toàn
  const fetchData = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchFn(...args);
      
      // Kiểm tra dữ liệu có đầy đủ các trường bắt buộc không
      const isValid = isSafeToRender(result, requiredFields);
      
      setData(result);
      setIsValidData(isValid);
      
      if (!isValid) {
        console.warn("Data is missing required fields:", requiredFields);
        setError("Dữ liệu không hợp lệ hoặc thiếu thông tin cần thiết");
      }
      
      return result;
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      setIsValidData(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, requiredFields]);

  // Tự động fetch khi component mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, dependencies);

  // Helper function để truy cập dữ liệu an toàn
  const getSafe = useCallback((path, defaultValue = null) => {
    return safeProp(data, path, defaultValue);
  }, [data]);

  // Helper function để kiểm tra mảng an toàn để map
  const isSafeToMap = useCallback((path) => {
    const array = path ? safeProp(data, path) : data;
    return isSafeArray(array);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    getSafe,
    isSafeToMap,
    isValidData
  };
}

/**
 * Hook để xử lý form data an toàn
 * 
 * @param {Object} initialValues - Giá trị khởi tạo của form
 * @param {Object} validationSchema - Schema validation
 * @returns {Object} Form state và handlers
 */
export function useSafeForm(initialValues = {}, validationSchema = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Kiểm tra giá trị hợp lệ theo schema
  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return "";
    
    const validator = validationSchema[name];
    return validator(value, values) || "";
  }, [validationSchema, values]);

  // Handle change cho input
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Validate khi thay đổi
    if (touched[name]) {
      const error = validateField(name, inputValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  // Handle blur để mark field là đã touched
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  // Validate toàn bộ form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationSchema).forEach(field => {
      const value = values[field];
      const error = validateField(field, value);
      
      if (error) {
        isValid = false;
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validationSchema, values, validateField]);

  // Submit handler
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e?.preventDefault();
      
      setIsSubmitting(true);
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      
      setTouched(allTouched);
      
      const isValid = validateForm();
      
      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      }
      
      setIsSubmitting(false);
    };
  }, [values, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
    setTouched,
    validateForm
  };
} 