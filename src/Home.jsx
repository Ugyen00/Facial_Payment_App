"use client";

import { useEffect, useState } from "react";
import {
  LogOut,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  TrendingUp,
  X,
} from "lucide-react";
import axios from "axios";

export default function HomePage() {
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFund, setIsAddingFund] = useState(false);

  const phone = localStorage.getItem("phone");
  const name = localStorage.getItem("name") || "My Wallet";
  const profilePic =
    localStorage.getItem("profile_pic") ||
    "https://randomuser.me/api/portraits/women/44.jpg";

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          "https://facial-payment-app-backend.onrender.com/wallet",
          {
            params: { phone },
          }
        );
        if (res.data.success) {
          setBalance(res.data.balance);
        }
      } catch (err) {
        console.error("Failed to fetch balance");
      } finally {
        setIsLoading(false);
      }
    };

    if (phone) {
      fetchBalance();
      fetchTransactions();

      const interval = setInterval(() => {
        fetchBalance();
        fetchTransactions();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [phone]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "https://facial-payment-app-backend.onrender.com/transactions",
        {
          params: { phone },
        }
      );
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch transactions");
    }
  };

  const handleAddFund = async () => {
    const amount = Number.parseFloat(amountToAdd);
    if (!isNaN(amount) && amount > 0) {
      setIsAddingFund(true);
      try {
        const res = await axios.post(
          "https://facial-payment-app-backend.onrender.com/add_fund",
          {
            phone,
            amount,
          }
        );

        if (res.data.success) {
          setBalance(res.data.new_balance);
          setAmountToAdd("");
          setShowModal(false);
        }
      } catch (err) {
        console.error("Failed to add fund");
      } finally {
        setIsAddingFund(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("phone");
    localStorage.clear();
    window.location.href = "/login";
  };

  const getTransactionIcon = (type) => {
    return type === "credit" ? (
      <ArrowDownLeft className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profilePic || "/placeholder.svg"}
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=48&width=48";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
              <p className="text-sm text-slate-500">Welcome back</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 shadow-xl text-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-emerald-100" />
              <p className="text-sm text-emerald-100 font-medium">
                Available Balance
              </p>
            </div>

            {isLoading ? (
              <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse mb-6"></div>
            ) : (
              <h1 className="text-4xl font-bold mb-6">${balance.toFixed(2)}</h1>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Funds
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl transition-colors flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Invest
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-slate-900">
              {transactions.length}
            </div>
            <div className="text-sm text-slate-500">Transactions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-emerald-600">
              ${transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(0)}
            </div>
            <div className="text-sm text-slate-500">Total Volume</div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Transactions
              </h3>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                {transactions.length}
              </span>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Wallet className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium mb-1">No transactions yet</p>
              <p className="text-sm">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      {getTransactionIcon(tx.type || "debit")}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {tx.user_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(
                            tx.payment_status
                          )}`}
                        >
                          {tx.payment_status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Fund Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Add Funds
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isAddingFund}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFund}
                    disabled={isAddingFund || !amountToAdd}
                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isAddingFund ? "Adding..." : "Add Funds"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
