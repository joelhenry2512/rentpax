"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { fetchPortfolio, deleteProperty, updateProperty, type SavedProperty } from "@/services/portfolio";
import EditPropertyModal from "@/components/EditPropertyModal";
import Link from "next/link";

export default function PortfolioPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProperty, setEditingProperty] = useState<SavedProperty | null>(null);

  const loadPortfolio = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    setError("");
    try {
      const portfolio = await fetchPortfolio(session.user.email);
      setProperties(portfolio);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load portfolio when user is authenticated
  useEffect(() => {
    if (session?.user?.email) {
      loadPortfolio();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    if (!session?.user?.email) {
      toast.error("You must be signed in to delete properties");
      return;
    }

    try {
      await deleteProperty(id, session.user.email);
      setProperties(properties.filter(p => p.id !== id));
      toast.success("Property deleted successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<SavedProperty>) => {
    if (!session?.user?.email) {
      toast.error("You must be signed in to update properties");
      return;
    }

    try {
      const updated = await updateProperty(id, { ...updates, email: session.user.email });
      setProperties(properties.map(p => p.id === id ? updated : p));
      toast.success("Property updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const totalValue = properties.reduce((sum, p) => sum + p.homeValue, 0);
  const totalCashFlow = properties.reduce((sum, p) => sum + p.cashFlow, 0);
  const avgCapRate = properties.length > 0 
    ? properties.reduce((sum, p) => sum + p.capRate, 0) / properties.length 
    : 0;

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!session) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-4">
            Please sign in to view your portfolio
          </p>
          <Link href="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <EditPropertyModal
        property={editingProperty!}
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        onSave={handleUpdate}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
        <p className="text-gray-600">Manage your saved property investments</p>
      </div>

      {/* Portfolio Summary */}
      {properties.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-600" size={24} />
              <h3 className="font-semibold">Total Value</h3>
            </div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">{properties.length} properties</div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="font-semibold">Monthly Cash Flow</h3>
            </div>
            <div className="text-2xl font-bold">
              ${totalCashFlow.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">
              {totalCashFlow >= 0 ? "Positive" : "Negative"} cash flow
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-purple-600" size={24} />
              <h3 className="font-semibold">Avg Cap Rate</h3>
            </div>
            <div className="text-2xl font-bold">
              {(avgCapRate * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Portfolio average</div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card mb-6">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Properties List */}
      {properties.length === 0 && !loading ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
          <p className="text-gray-600 mb-4">
            Start building your portfolio by analyzing properties
          </p>
          <Link href="/" className="btn-primary">
            Analyze a Property
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => (
            <div key={property.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{property.address}</h3>
                  <div className="text-sm text-gray-600">
                    Added {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit property"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete property"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Home Value</div>
                  <div className="font-semibold">${property.homeValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Rent Estimate</div>
                  <div className="font-semibold">${property.rentEstimate.toLocaleString()}/mo</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cash Flow</div>
                  <div className={`font-semibold ${property.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${property.cashFlow.toFixed(0)}/mo
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cap Rate</div>
                  <div className="font-semibold">{(property.capRate * 100).toFixed(2)}%</div>
                </div>
              </div>

              {property.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Notes:</div>
                  <div className="text-sm">{property.notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
