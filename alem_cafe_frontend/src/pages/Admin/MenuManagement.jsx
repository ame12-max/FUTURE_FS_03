import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAPI, getImageUrl } from "../../services/api";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiX,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

const MenuManagement = () => {
  const { user, isAdmin } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    full_description: "",
    price: "",
    category: "",
    calories: "",
    preparation_time: "",
    ingredients: "",
    allergens: "",
    dietary_tags: "",
    nutritional_info: "",
    is_available: true,
    image_url: "",
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await adminAPI.getMenuItems();
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      toast.error("Failed to load menu items");
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "is_available") {
          formDataToSend.append(key, formData[key] ? "1" : "0");
        } else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingItem) {
        await adminAPI.updateMenuItem(editingItem.id, formDataToSend);
        toast.success("Menu item updated");
      } else {
        await adminAPI.addMenuItem(formDataToSend);
        toast.success("Menu item added");
      }
      resetForm();
      fetchMenuItems();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.error || "Failed to save menu item");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await adminAPI.deleteMenuItem(itemToDelete.id);
      toast.success("Item deleted");
      fetchMenuItems();
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await adminAPI.updateMenuItem(id, { is_available: currentStatus ? 0 : 1 });
      toast.success(currentStatus ? "Item hidden from menu" : "Item visible on menu");
      fetchMenuItems();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: "",
      description: "",
      full_description: "",
      price: "",
      category: "",
      calories: "",
      preparation_time: "",
      ingredients: "",
      allergens: "",
      dietary_tags: "",
      nutritional_info: "",
      is_available: true,
      image_url: "",
    });
    setShowModal(false);
  };

  const editItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      full_description: item.full_description || "",
      price: item.price,
      category: item.category || "",
      calories: item.calories || "",
      preparation_time: item.preparation_time || "",
      ingredients: item.ingredients || "",
      allergens: item.allergens || "",
      dietary_tags: item.dietary_tags || "",
      nutritional_info: item.nutritional_info || "",
      is_available: item.is_available === 1,
      image_url: item.image_url || "",
    });
    setImagePreview(item.image_url ? getImageUrl(item.image_url) : null);
    setShowModal(true);
  };

  const filteredItems = showUnavailable 
    ? menuItems 
    : menuItems.filter(item => item.is_available === 1);

  if (!isAdmin) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black/80">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-playfair font-bold text-gold">
            Menu Management
          </h1>
          <div className="flex gap-3">
            <div className="flex bg-white/10 rounded-full p-1">
              <button
                onClick={() => setShowUnavailable(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !showUnavailable
                    ? "bg-gold text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Available Only
              </button>
              <button
                onClick={() => setShowUnavailable(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  showUnavailable
                    ? "bg-gold text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Show All
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gold text-black px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gold-light transition"
            >
              <FiPlus /> Add New Item
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gold">{menuItems.length}</p>
            <p className="text-gray-400 text-sm">Total Items</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {menuItems.filter(i => i.is_available === 1).length}
            </p>
            <p className="text-gray-400 text-sm">Available</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {menuItems.filter(i => i.is_available === 0).length}
            </p>
            <p className="text-gray-400 text-sm">Unavailable</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {menuItems.filter(i => i.category).length}
            </p>
            <p className="text-gray-400 text-sm">Categories</p>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border transition ${
                item.is_available 
                  ? "border-white/10 hover:border-gold/30" 
                  : "border-red-500/20 opacity-75"
              }`}
            >
              <img
                src={
                  getImageUrl(item.image_url) ||
                  "https://via.placeholder.com/300?text=No+Image"
                }
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-gold font-bold">${item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item.id, item.is_available)}
                      className={`p-2 rounded-full transition ${
                        item.is_available
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                      title={item.is_available ? "Click to hide from menu" : "Click to show on menu"}
                    >
                      {item.is_available ? <FiCheck size={16} /> : <FiX size={16} />}
                    </button>
                    <button
                      onClick={() => editItem(item)}
                      className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                      title="Edit item"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      title="Delete item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.dietary_tags
                    ?.split(",")
                    .slice(0, 2)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
                {!item.is_available && (
                  <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <FiX size={12} /> Unavailable
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No menu items found</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={resetForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-black/90 backdrop-blur-xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-gold/30"
            >
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
              <h2 className="text-2xl font-playfair font-bold text-gold mb-4">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... form fields (same as before) ... */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Price *</label>
                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Category</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Main Course, Dessert, Beverage..." className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Calories</label>
                    <input type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Preparation Time (minutes)</label>
                    <input type="number" value={formData.preparation_time} onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Availability</label>
                    <select value={formData.is_available} onChange={(e) => setFormData({ ...formData, is_available: e.target.value === "true" })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold">
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">Short Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">Full Description</label>
                  <textarea value={formData.full_description} onChange={(e) => setFormData({ ...formData, full_description: e.target.value })} rows="3" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Ingredients (comma separated)</label>
                    <input type="text" value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} placeholder="Beef, cheese, lettuce, tomato..." className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Allergens</label>
                    <input type="text" value={formData.allergens} onChange={(e) => setFormData({ ...formData, allergens: e.target.value })} placeholder="Gluten, Dairy, Nuts..." className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Dietary Tags (comma separated)</label>
                    <input type="text" value={formData.dietary_tags} onChange={(e) => setFormData({ ...formData, dietary_tags: e.target.value })} placeholder="Vegetarian, Vegan, Gluten-Free..." className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Nutritional Info (optional)</label>
                    <input type="text" value={formData.nutritional_info} onChange={(e) => setFormData({ ...formData, nutritional_info: e.target.value })} placeholder='{"protein": "45g", "carbs": "65g"}' className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-1">Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />}
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                      <FiImage className="inline mr-2" /> Upload Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-gold text-black py-2 rounded-full font-semibold hover:bg-gold-light transition">
                    {editingItem ? "Update Item" : "Add Item"}
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default MenuManagement;