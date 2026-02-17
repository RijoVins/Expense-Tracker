import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PlusCircle, Trash2, TrendingUp, TrendingDown } from "lucide-react";

export default function ExpenseTrackerApp() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("all");

  const addTransaction = () => {
    if (!description || !amount) return;
    const newTransaction = {
      id: Date.now(),
      type,
      description,
      amount: parseFloat(amount),
    };
    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const chartData = [
    { name: "Income", value: totals.income, fill: "#22c55e" },
    { name: "Expense", value: totals.expense, fill: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-2">💰 Expense Tracker</h1>
          <p className="text-slate-400">Manage your income and expenses efficiently</p>
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
            <p className="text-4xl font-bold text-white">₹{totals.income.toFixed(2)}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-7 shadow-xl border border-red-400"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-red-100 font-semibold">Total Expense</p>
              <TrendingDown className="w-5 h-5 text-red-200" />
            </div>
            <p className="text-4xl font-bold text-white">₹{totals.expense.toFixed(2)}</p>
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
            <p className="text-4xl font-bold text-white">₹{totals.balance.toFixed(2)}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <span className="absolute left-3 top-3 text-slate-400">₹</span>
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

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white text-2xl">Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-6">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `₹${value.toFixed(2)}`}
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                        labelStyle={{ color: "#e2e8f0" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">No data yet</p>
                    <p className="text-slate-500 text-sm mt-2">Add transactions to see visualization</p>
                  </div>
                )}
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
                    <p className="text-5xl mb-4">📊</p>
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
                      ₹{((totals.income + totals.expense) / transactions.length).toFixed(2)}
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
                          {transaction.type === "income" ? "+" : "-"}₹
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
      </motion.div>
    </div>
  );
}
