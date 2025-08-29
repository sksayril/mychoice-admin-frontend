import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, DollarSign, TrendingUp, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { Product, ProductCategory } from '../types/product';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import AddProductModal from './AddProductModal';
import ProductViewModal from './ProductViewModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ErrorBoundary from './ErrorBoundary';
import { safeExtractArrayData, handleApiError, getImageUrl } from '../utils/apiUtils';

const MyProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch products
  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({
        page,
        limit: pagination.limit,
        search,
      });
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to fetch products');
      setError(errorMessage);
      showErrorToast('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
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

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    setDeleteLoading(true);
    try {
      const response = await productAPI.delete(productId);
      if (response.success) {
        showSuccessToast('Product deleted successfully');
        fetchProducts(pagination.page, searchTerm);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        showErrorToast(response.message || 'Failed to delete product');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err, 'Failed to delete product');
      showErrorToast(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchProducts(1, value);
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchProducts(page, searchTerm);
  };

  // Handle add product modal
  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleProductAdded = () => {
    fetchProducts(pagination.page, searchTerm);
  };

  // Handle edit product modal
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductEdited = () => {
    fetchProducts(pagination.page, searchTerm);
  };

  // Handle view product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProduct(null);
  };

  // Calculate stats
  const calculateStats = () => {
    const totalProducts = pagination.total;
    const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);
    const totalSales = products.length; // This would need to come from actual sales data
    const totalViews = Math.floor(Math.random() * 5000) + 1000; // Mock data for now

    return {
      totalProducts,
      totalRevenue,
      totalSales,
      totalViews,
    };
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Cleanup function to clear timeout
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []);

  const stats = calculateStats();

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-emerald-100 text-emerald-700' 
      : 'bg-red-100 text-red-700';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchProducts()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Products</h1>
            <p className="text-gray-600">Manage your product catalog and track performance</p>
          </div>
          <button 
            onClick={handleAddProduct}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Package className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
                              <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSales}</p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Product Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Products table">
              <thead className="bg-sky-50 border-b border-sky-100">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Features</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-sky-25 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          <img 
                            src={getImageUrl(product.mainImage)} 
                            alt={product.productName}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                            onLoad={(e) => {
                              e.currentTarget.style.display = 'block';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{product.productName}</p>
                          <p className="text-sm text-gray-500">ID: #{product._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {product.price ? `₹${product.price}` : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.productFeatures.slice(0, 2).join(', ')}
                          {product.productFeatures.length > 2 && '...'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.isActive)}`}>
                        {getStatusText(product.isActive)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 text-sky-600 hover:bg-sky-100 rounded transition-colors"
                          title="View Product"
                          aria-label={`View ${product.productName}`}
                          onClick={() => handleViewProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Edit Product"
                          aria-label={`Edit ${product.productName}`}
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Delete Product"
                          aria-label={`Delete ${product.productName}`}
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new product.</p>
        </div>
      )}

      {/* Add Product Modal */}
      <ErrorBoundary>
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onProductAdded={handleProductAdded}
        />
      </ErrorBoundary>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <ErrorBoundary>
          <AddProductModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onProductAdded={handleProductEdited}
            editMode={true}
            productToEdit={selectedProduct}
          />
        </ErrorBoundary>
      )}

      {/* View Product Modal */}
      <ErrorBoundary>
        <ProductViewModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          product={selectedProduct}
        />
      </ErrorBoundary>

      {/* Delete Confirmation Modal */}
      <ErrorBoundary>
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onConfirm={() => productToDelete && handleDeleteProduct(productToDelete._id)}
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          itemName={productToDelete?.productName}
          loading={deleteLoading}
        />
      </ErrorBoundary>
    </div>
  );
};

export default MyProducts;