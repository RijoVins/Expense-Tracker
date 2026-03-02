import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet, Edit2, Check, X, Loader2, LogOut, BarChart3 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot,
  query, 
  orderBy, 
  serverTimestamp,
  where
} from "firebase/firestore";

export default function ExpenseTrackerApp() {
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("all");
  const [reportType, setReportType] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Investment state
  const [investments, setInvestments] = useState([]);
  const [investmentType, setInvestmentType] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentProfitLoss, setInvestmentProfitLoss] = useState("");
  const [editingInvestmentId, setEditingInvestmentId] = useState(null);
  const [editInvestmentType, setEditInvestmentType] = useState("");
  const [editInvestmentAmount, setEditInvestmentAmount] = useState("");
  const [editInvestmentProfitLoss, setEditInvestmentProfitLoss] = useState("");

  // Log current user for debugging
  useEffect(() => {
    if (currentUser) {
      console.log("✅ User authenticated:", currentUser.email);
    }
  }, [currentUser]);



  // Real-time listener for transactions
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    // Safety timeout - loading should never take more than 5 seconds
    const timeout = setTimeout(() => {
      console.warn("⚠️ Loading timeout - Firestore query took too long");
      setLoading(false);
    }, 5000);

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      clearTimeout(timeout);
      const transactionData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bTime - aTime;
      });
      console.log("✅ Transactions:", transactionData.length);
      setTransactions(transactionData);
      setLoading(false);
    }, (error) => {
      clearTimeout(timeout);
      console.error("❌ Transaction error:", error.code, error.message);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [currentUser]);

  // Real-time listener for investments
  useEffect(() => {
    if (!currentUser) {
      setInvestments([]);
      return;
    }

    const investmentsRef = collection(db, "investments");
    const q = query(
      investmentsRef,
      where("userId", "==", currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const investmentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bTime - aTime;
      });
      console.log("✅ Investments:", investmentData.length);
      setInvestments(investmentData);
    }, (error) => {
      console.error("❌ Investment error:", error.code, error.message);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addTransaction = async () => {
    if (!description || !amount || !currentUser) return;
    
    setDescription("");
    setAmount("");
    
    try {
      await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        type,
        description,
        amount: parseFloat(amount),
        createdAt: serverTimestamp(),
      });
      console.log("✅ Transaction saved");
    } catch (error) {
      console.error("❌ Error:", error.code, error.message);
      alert(`Error: ${error.code}`);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Investment functions
  const addInvestment = async () => {
    if (!investmentType || !investmentAmount || !currentUser) return;
    
    // Clear form immediately
    setInvestmentType("");
    setInvestmentAmount("");
    setInvestmentProfitLoss("");
    
    // Save to Firestore
    try {
      await addDoc(collection(db, "investments"), {
        userId: currentUser.uid,
        type: investmentType,
        amount: parseFloat(investmentAmount),
        profitLoss: parseFloat(investmentProfitLoss) || 0,
        createdAt: serverTimestamp(),
      });
      console.log("✅ Investment saved to Firestore");
      alert("✅ Investment saved!");
    } catch (error) {
      console.error("❌ Failed to save investment:", error.code, error.message);
      alert(`❌ Error: ${error.code}\n${error.message}`);
    }
  };

  const deleteInvestment = async (id) => {
    try {
      await deleteDoc(doc(db, "investments", id));
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  const startEditInvestment = (investment) => {
    setEditingInvestmentId(investment.id);
    setEditInvestmentType(investment.type);
    setEditInvestmentAmount(investment.amount.toString());
    setEditInvestmentProfitLoss(investment.profitLoss.toString());
  };

  const saveEditInvestment = async (id) => {
    try {
      await updateDoc(doc(db, "investments", id), {
        type: editInvestmentType,
        amount: parseFloat(editInvestmentAmount),
        profitLoss: parseFloat(editInvestmentProfitLoss) || 0,
      });
      setEditingInvestmentId(null);
      setEditInvestmentType("");
      setEditInvestmentAmount("");
      setEditInvestmentProfitLoss("");
    } catch (error) {
      console.error("Error updating investment:", error);
    }
  };

  const cancelEditInvestment = () => {
    setEditingInvestmentId(null);
    setEditInvestmentType("");
    setEditInvestmentAmount("");
    setEditInvestmentProfitLoss("");
  };

  const investmentTotals = useMemo(() => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalProfitLoss = investments.reduce((sum, inv) => sum + inv.profitLoss, 0);
    const currentValue = totalInvested + totalProfitLoss;
    return { totalInvested, totalProfitLoss, currentValue };
  }, [investments]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const reports = useMemo(() => {
    const monthly = {};
    const yearly = {};

    transactions.forEach(t => {
      let date;
      if (t.createdAt) {
        date = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
      } else {
        date = new Date();
      }

      const monthYear = date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      const year = date.getFullYear().toString();

      if (!monthly[monthYear]) {
        monthly[monthYear] = { income: 0, expense: 0, label: monthYear, time: date.getTime() };
      }
      if (!yearly[year]) {
        yearly[year] = { income: 0, expense: 0, label: year, time: new Date(year, 0, 1).getTime() };
      }

      const amount = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        monthly[monthYear].income += amount;
        yearly[year].income += amount;
      } else if (t.type === 'expense') {
        monthly[monthYear].expense += amount;
        yearly[year].expense += amount;
      }
    });

    return {
      monthly: Object.values(monthly).sort((a, b) => b.time - a.time),
      yearly: Object.values(yearly).sort((a, b) => b.time - a.time)
    };
  }, [transactions]);

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Money Manager</h1>
            <p className="text-slate-400">Manage your income, expenses, and investments efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="text-white font-semibold">{currentUser?.email}</p>
            </div>
            <Button
              onClick={async () => {
                setLoggingOut(true);
                try {
                  await logout();
                } catch (error) {
                  console.error("Logout error:", error);
                } finally {
                  setLoggingOut(false);
                }
              }}
              disabled={loggingOut}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-red-500/30 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-7 shadow-xl border border-green-400"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-green-100 font-semibold">Total Income</p>
              <TrendingUp className="w-5 h-5 text-green-200" />
            </div>
            <p className="text-4xl font-bold text-white">Rs.{totals.income.toFixed(2)}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-7 shadow-xl border border-red-400"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-red-100 font-semibold">Total Expense</p>
              <TrendingDown className="w-5 h-5 text-red-200" />
            </div>
            <p className="text-4xl font-bold text-white">Rs.{totals.expense.toFixed(2)}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-2xl p-7 shadow-xl border ${
              totals.balance >= 0 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400" 
                : "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400"
            }`}
          >
            <p className="text-slate-100 font-semibold mb-3">Balance</p>
            <p className="text-4xl font-bold text-white">Rs.{totals.balance.toFixed(2)}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full bg-slate-800 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white text-2xl">Add Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Transaction Type</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setType("income")}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        type === "income"
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Income
                    </button>
                    <button
                      onClick={() => setType("expense")}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        type === "expense"
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                    >
                      <TrendingDown className="w-4 h-4" />
                      Expense
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Description</label>
                  <Input
                    placeholder="e.g., Salary, Groceries..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">Rs.</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pl-7 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Button
                  onClick={addTransaction}
                  className={`w-full py-3 font-semibold text-base transition-all hover:shadow-lg ${
                    type === "income"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Transaction
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {transactions.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardContent className="flex flex-col items-center justify-center h-full py-12">
                  <div className="text-center">
                    <p className="text-5xl mb-4">Chart</p>
                    <p className="text-slate-300 font-semibold mb-2">Get Started</p>
                    <p className="text-slate-500 text-sm">Add your first transaction to begin tracking</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white text-2xl">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Total Transactions</p>
                    <p className="text-3xl font-bold text-white mt-1">{transactions.length}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Avg Transaction</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      Rs.{((totals.income + totals.expense) / transactions.length).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Income vs Expense</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {totals.income > 0 ? Math.round((totals.expense / totals.income) * 100) : 0}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Investment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Investments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Investment Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-300">Add New Investment</h3>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Investment Type</label>
                    <Input
                      placeholder="e.g., Stocks, Mutual Funds, Crypto..."
                      value={investmentType}
                      onChange={(e) => setInvestmentType(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Amount Invested</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">Rs.</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pl-7 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Profit/Loss</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">Rs.</span>
                      <Input
                        type="number"
                        placeholder="0.00 (negative for loss)"
                        value={investmentProfitLoss}
                        onChange={(e) => setInvestmentProfitLoss(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pl-7 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addInvestment}
                    className="w-full py-3 font-semibold text-base bg-purple-500 hover:bg-purple-600 text-white transition-all hover:shadow-lg"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Investment
                  </Button>
                </div>

                {/* Investment Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-300">Investment Summary</h3>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Total Invested</p>
                    <p className="text-3xl font-bold text-white mt-1">Rs.{investmentTotals.totalInvested.toFixed(2)}</p>
                  </div>
                  <div className={`rounded-lg p-4 ${investmentTotals.totalProfitLoss >= 0 ? "bg-green-900/30" : "bg-red-900/30"}`}>
                    <p className="text-slate-400 text-sm">Total Profit/Loss</p>
                    <p className={`text-3xl font-bold mt-1 ${investmentTotals.totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {investmentTotals.totalProfitLoss >= 0 ? "+" : ""}Rs.{investmentTotals.totalProfitLoss.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                    <p className="text-slate-400 text-sm">Current Value</p>
                    <p className="text-3xl font-bold text-white mt-1">Rs.{investmentTotals.currentValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Investment List */}
              {investments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-300 mb-4">Your Investments</h3>
                  <div className="space-y-3">
                    {investments.map((investment) => (
                      <motion.div
                        key={investment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 rounded-lg border bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60 transition-all"
                      >
                        {editingInvestmentId === investment.id ? (
                          <div className="flex-1 grid grid-cols-3 gap-3 mr-4">
                            <Input
                              value={editInvestmentType}
                              onChange={(e) => setEditInvestmentType(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white h-9"
                              placeholder="Type"
                            />
                            <Input
                              type="number"
                              value={editInvestmentAmount}
                              onChange={(e) => setEditInvestmentAmount(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white h-9"
                              placeholder="Amount"
                            />
                            <Input
                              type="number"
                              value={editInvestmentProfitLoss}
                              onChange={(e) => setEditInvestmentProfitLoss(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white h-9"
                              placeholder="P/L"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-purple-500/20">
                                <Wallet className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">{investment.type}</p>
                                <p className="text-xs text-slate-400">Invested: Rs.{investment.amount.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-bold text-white">Rs.{(investment.amount + investment.profitLoss).toFixed(2)}</p>
                                <p className={`text-sm ${investment.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                                  {investment.profitLoss >= 0 ? "+" : ""}Rs.{investment.profitLoss.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-2 ml-4">
                          {editingInvestmentId === investment.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => saveEditInvestment(investment.id)}
                                className="hover:bg-green-500/20 text-green-400"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEditInvestment}
                                className="hover:bg-slate-500/20 text-slate-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditInvestment(investment)}
                                className="hover:bg-blue-500/20 text-slate-400 hover:text-blue-400"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteInvestment(investment.id)}
                                className="hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions List */}
        {transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white text-2xl mb-4">Recent Transactions</CardTitle>
                <Tabs defaultValue={filter}>
                  <TabsList className="bg-slate-700">
                    <TabsTrigger 
                      value="all" 
                      onClick={() => setFilter("all")}
                      className="data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white"
                    >
                      All ({transactions.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="income"
                      onClick={() => setFilter("income")}
                      className="data-[state=active]:bg-green-600 text-slate-300 data-[state=active]:text-white"
                    >
                      Income ({transactions.filter(t => t.type === "income").length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="expense"
                      onClick={() => setFilter("expense")}
                      className="data-[state=active]:bg-red-600 text-slate-300 data-[state=active]:text-white"
                    >
                      Expense ({transactions.filter(t => t.type === "expense").length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        transaction.type === "income"
                          ? "bg-green-900/20 border-green-500/30 hover:border-green-500/60"
                          : "bg-red-900/20 border-red-500/30 hover:border-red-500/60"
                      }`}
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === "income"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        }`}>
                          {transaction.type === "income" ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{transaction.description}</p>
                          <p className="text-xs text-slate-400 capitalize">{transaction.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p
                          className={`font-bold text-lg ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}Rs.
                          {transaction.amount.toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransaction(transaction.id)}
                          className="hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 mb-10"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Financial Reports
                </CardTitle>
                {transactions.length > 0 && (
                  <Tabs defaultValue={reportType} onValueChange={(v) => setReportType(v)}>
                    <TabsList className="bg-slate-700">
                      <TabsTrigger 
                        value="monthly" 
                        onClick={() => setReportType("monthly")}
                        className={`data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white ${reportType === 'monthly' ? 'bg-blue-600 text-white' : ''}`}
                      >
                        Monthly
                      </TabsTrigger>
                      <TabsTrigger 
                        value="yearly"
                        onClick={() => setReportType("yearly")}
                        className={`data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white ${reportType === 'yearly' ? 'bg-blue-600 text-white' : ''}`}
                      >
                        Yearly
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400">Add transactions to see your financial reports.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(reportType === "monthly" ? reports.monthly : reports.yearly).map((report) => (
                    <motion.div 
                      key={report.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-700/50 p-5 rounded-xl border border-slate-600 hover:border-slate-500 transition-all"
                    >
                      <h4 className="text-white font-semibold mb-4 text-lg border-b border-slate-600 pb-2">{report.label}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm flex items-center gap-1">
                            Income
                          </span>
                          <span className="text-green-400 font-medium">Rs.{report.income.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm flex items-center gap-1">
                            Expense
                          </span>
                          <span className="text-red-400 font-medium">Rs.{report.expense.toFixed(2)}</span>
                        </div>
                        <div className="pt-3 mt-1 border-t border-slate-600 flex justify-between items-center">
                          <span className="text-slate-300 font-medium">Balance</span>
                          <span className={`font-bold ${report.income - report.expense >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                            {report.income - report.expense >= 0 ? "+" : ""}Rs.{(report.income - report.expense).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
