"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { fetchPortfolio, deleteProperty, type SavedProperty } from "@/services/portfolio";
import Link from "next/link";

export default function PortfolioPage() {
  const [email, setEmail] = useState("");
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPortfolio = async () => {
    if (!email) return;
    
    setLoading(true);
    setError("");
    try {
      const portfolio = await fetchPortfolio(email);
      setProperties(portfolio);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await deleteProperty(id, email);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const totalValue = properties.reduce((sum, p) => sum + p.homeValue, 0);
  const totalCashFlow = properties.reduce((sum, p) => sum + p.cashFlow, 0);
  const avgCapRate = properties.length > 0 
    ? properties.reduce((sum, p) => sum + p.capRate, 0) / properties.length 
    : 0;

  return (
    <main className="container mx-auto px-4 py-8">
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

      {/* Email Input */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Load Portfolio</h2>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input flex-1"
          />
          <button
            onClick={loadPortfolio}
            disabled={!email || loading}
            className="btn-primary"
          >
            {loading ? "Loading..." : "Load Portfolio"}
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

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
