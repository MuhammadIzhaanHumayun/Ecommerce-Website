import { useState } from "react";

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onRefresh,
}) {
  const [categoryName, setcategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // 1. ADD / CREATE ACTION
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/Categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });
      const result = await res.json();
      if (!res.ok) {
        console.log(result);
        alert(result.error || "Failed to add category");
        return;
      }

      setcategoryName("");
      onRefresh(); // Refresh categories array in itemsView dropdown & table
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. UPDATE / EDIT ACTION
  const handleUpdate = async (id) => {
    if (!editName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/Categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to update category");
        return;
      }

      setEditingId(null);
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. REMOVE / DELETE ACTION
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/Categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Sending ID through body to match your product handlers structure
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to delete category");
        return;
      }

      onRefresh();
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative border">
        {/* Close Modal X Wrapper */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Manage Categories
        </h3>

        {/* Input Form Fields */}
        <form onSubmit={handleAdd} className="flex gap-x-2 mb-6">
          <input
            type="text"
            placeholder="New category name..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 flex-1 text-sm text-gray-900 focus:outline-blue-500"
            value={categoryName}
            onChange={(e) => setcategoryName(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {/* List View Container */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border-t pt-4 scrollbar-none">
          {categories.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-2">
              No categories found.
            </p>
          ) : (
            categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border-b pb-2 text-sm"
              >
                {editingId === c.id ? (
                  <div className="flex gap-x-2 flex-1 mr-2">
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 text-gray-900 focus:outline-blue-500"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={() => handleUpdate(c.id)}
                      disabled={isSubmitting}
                      className="text-green-600 font-medium hover:underline disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 font-medium hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-800 font-medium">{c.name}</span>
                    <div className="flex gap-x-3">
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditName(c.name);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-800 font-medium hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
