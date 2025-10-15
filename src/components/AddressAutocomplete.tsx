"use client";
import { useState, useEffect, useRef } from "react";
import { searchAddresses } from "@/services/rentcast";

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "123 Main St, City, ST",
  className = "input md:col-span-3"
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const searchAddressesAPI = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    try {
      console.log("Searching addresses for:", query);
      const results = await searchAddresses(query);
      console.log("Address search results:", results);
      setSuggestions(results);
    } catch (error) {
      console.error("Address search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length >= 3) {
      timeoutRef.current = setTimeout(() => {
        searchAddressesAPI(value);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        autoComplete="off"
      />
      {value.length >= 3 && !loading && suggestions.length === 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-pulse"></div>
        </div>
      )}
      
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-gray-500 text-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Searching addresses...
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium text-gray-900 text-sm">{suggestion}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No addresses found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
