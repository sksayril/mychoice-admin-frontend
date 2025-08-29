import React from 'react';
import { X, Package, DollarSign, Tag, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '../types/product';
import { getImageUrl } from '../utils/apiUtils';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-view-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="product-view-modal-title" className="text-2xl font-bold text-gray-800">
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Package className="w-5 h-5 mr-2 text-sky-600" />
                Product Image
              </h3>
                             <div className="relative">
                 <div className="w-full h-80 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                   <img 
                     src={getImageUrl(product.mainImage)} 
                     alt={product.productName}
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.src = 'https://via.placeholder.com/400x320?text=No+Image';
                     }}
                     onLoad={(e) => {
                       // Ensure image is visible when loaded
                       e.currentTarget.style.display = 'block';
                     }}
                   />
                 </div>
                 <div className="absolute top-4 right-4">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                     product.isActive 
                       ? 'bg-emerald-100 text-emerald-700' 
                       : 'bg-red-100 text-red-700'
                   }`}>
                     {product.isActive ? 'Active' : 'Inactive'}
                   </span>
                 </div>
               </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                    <p className="text-lg font-semibold text-gray-800">{product.productName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-sky-600" />
                        <span className="text-gray-800">{product.category || 'Uncategorized'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="text-lg font-semibold text-gray-800">
                          {product.price ? `₹${product.price}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Product ID</label>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                      #{product._id.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-sky-600" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-sky-600" />
                  Product Features
                </h3>
                <div className="space-y-2">
                  {product.productFeatures && product.productFeatures.length > 0 ? (
                    product.productFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-3 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <XCircle className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">No features specified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Status Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <div className="flex items-center">
                      {product.isActive ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        product.isActive ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                    <p className="text-sm text-gray-600">
                      {new Date(product.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
