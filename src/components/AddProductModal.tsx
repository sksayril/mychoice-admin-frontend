import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { ProductCategory } from '../types/product';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { safeExtractArrayData, handleApiError, validateProductData } from '../utils/apiUtils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  editMode?: boolean;
  productToEdit?: any;
}

const AddProductModal = React.memo<AddProductModalProps>(({ isOpen, onClose, onProductAdded, editMode = false, productToEdit }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: '',
    productFeatures: [''],
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories on component mount and populate form for edit mode
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      
      // Populate form data if in edit mode
      if (editMode && productToEdit) {
        setFormData({
          productName: productToEdit.productName || '',
          description: productToEdit.description || '',
          price: productToEdit.price ? productToEdit.price.toString() : '',
          category: productToEdit.category || '',
          productFeatures: productToEdit.productFeatures && productToEdit.productFeatures.length > 0 
            ? productToEdit.productFeatures 
            : [''],
        });
        
        // Set image preview if product has an image
        if (productToEdit.mainImage) {
          setImagePreview(productToEdit.mainImage);
        }
      }
    }
  }, [isOpen, editMode, productToEdit]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await productAPI.getCategories();
      const categoriesData = safeExtractArrayData<ProductCategory>(response);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.productFeatures];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, productFeatures: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      productFeatures: [...prev.productFeatures, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.productFeatures.length > 1) {
      const newFeatures = formData.productFeatures.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, productFeatures: newFeatures }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    // Only require image for new products, not for editing
    if (!editMode && !mainImage) {
      newErrors.mainImage = 'Main image is required';
    }

    // Filter out empty features and validate
    const validFeatures = formData.productFeatures.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.productFeatures = 'At least one product feature is required';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Filter out empty features before sending
      const validFeatures = formData.productFeatures.filter(f => f.trim());
      
      let productData;
      
      // For edit mode, we might not have a new image
      if (editMode && !mainImage) {
        // Skip image validation for edit mode if no new image is selected
        productData = {
          mainImage: new File([], 'placeholder'), // Placeholder for validation
          productName: formData.productName.trim(),
          productFeatures: validFeatures,
          description: formData.description.trim() || undefined,
          price: formData.price ? Number(formData.price) : undefined,
          category: formData.category || undefined,
        };
      } else {
        // For new products or when editing with new image
        productData = {
          mainImage: mainImage!,
          productName: formData.productName.trim(),
          productFeatures: validFeatures,
          description: formData.description.trim() || undefined,
          price: formData.price ? Number(formData.price) : undefined,
          category: formData.category || undefined,
        };
      }

      // Validate product data before sending
      const validation = validateProductData(productData);
      if (!validation.isValid) {
        showErrorToast(validation.errors.join(', '));
        return;
      }

      // Debug: Log the data being sent
      console.log('Sending product data:', productData);
      
      let response;
      if (editMode && productToEdit) {
        // Update existing product
        const updateData = {
          productName: productData.productName,
          productFeatures: productData.productFeatures,
          description: productData.description,
          price: productData.price,
          category: productData.category,
        };
        
        response = await productAPI.update(productToEdit._id, updateData);
        
        // If there's a new image, update it separately
        if (mainImage && response.success) {
          try {
            await productAPI.updateMainImage(productToEdit._id, mainImage);
          } catch (imageError) {
            console.error('Failed to update image:', imageError);
            // Don't fail the entire update if image update fails
          }
        }
        
        if (response.success) {
          showSuccessToast('Product updated successfully!');
        } else {
          showErrorToast(response.message || 'Failed to update product');
        }
      } else {
        // Create new product
        response = await productAPI.create(productData);
        if (response.success) {
          showSuccessToast('Product created successfully!');
        } else {
          showErrorToast(response.message || 'Failed to create product');
        }
      }
      
      if (response.success) {
        onProductAdded();
        handleClose();
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err, editMode ? 'Failed to update product' : 'Failed to create product');
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      productName: '',
      description: '',
      price: '',
      category: '',
      productFeatures: [''],
    });
    setMainImage(null);
    setImagePreview('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            {editMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                errors.productName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
              aria-describedby={errors.productName ? 'productName-error' : undefined}
              aria-invalid={!!errors.productName}
            />
            {errors.productName && (
              <p id="productName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.productName}
              </p>
            )}
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image *
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 100MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    aria-describedby={errors.mainImage ? 'mainImage-error' : undefined}
                    aria-invalid={!!errors.mainImage}
                  />
                </label>
              </div>
                             {imagePreview && (
                 <div className="relative">
                   <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                     <img
                       src={imagePreview}
                       alt="Preview"
                       className="w-full h-full object-contain rounded-lg"
                       onLoad={(e) => {
                         e.currentTarget.style.display = 'block';
                       }}
                     />
                   </div>
                   <button
                     type="button"
                     onClick={() => {
                       setMainImage(null);
                       setImagePreview('');
                     }}
                     className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               )}
            </div>
            {errors.mainImage && (
              <p id="mainImage-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.mainImage}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="₹0.00"
                step="0.01"
                min="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                disabled={categoriesLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                </option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Features *
            </label>
            <div className="space-y-2">
              {formData.productFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.productFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Feature</span>
              </button>
            </div>
            {errors.productFeatures && (
              <p className="mt-1 text-sm text-red-600">{errors.productFeatures}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{editMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{editMode ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AddProductModal;
