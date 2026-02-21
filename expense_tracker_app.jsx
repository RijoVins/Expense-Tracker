import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    { name: "Income", value: totals.income },
    { name: "Expense", value: totals.expense },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-slate-900 mb-2"
            >
              Financial Dashboard
            </motion.h1>
            <p className="text-lg text-slate-600">Track your income and expenses with precision</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Total Income</CardTitle>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-6">
                <p className="text-4xl font-bold text-emerald-600">
                  ₹{Math.round(totals.income)}
                </p>
                <p className="text-xs text-slate-500 mt-2">All earnings</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Total Expenses</CardTitle>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-6">
                <p className="text-4xl font-bold text-red-600">
                  ₹{Math.round(totals.expense)}
                </p>
                <p className="text-xs text-slate-500 mt-2">All spendings</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-700 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-3 border-b border-blue-600">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Net Balance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-6">
                <p className="text-4xl font-bold text-white">
                  ₹{Math.round(totals.balance)}
                </p>
                <p className="text-xs text-blue-100 mt-2">Current balance</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Add Transaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-lg bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-6 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900">Add New Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-11 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-all"
                />
                <Input
                  type="number"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-all"
                />
                <Select onValueChange={setType} defaultValue="income">
                  <SelectTrigger className="h-11 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 text-slate-900">
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={addTransaction} 
                  className="h-11 lg:col-span-1 md:col-span-2 flex gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <PlusCircle size={18} /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart + Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="rounded-lg bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-6 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-900">Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      outerRadius={80}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="rounded-lg bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-lg font-bold text-slate-900">Transaction History</CardTitle>
                  <Tabs defaultValue="all" onValueChange={setFilter}>
                    <TabsList className="bg-slate-100 border border-slate-200">
                      <TabsTrigger value="all" className="text-slate-700 data-[state=active]:text-white data-[state=active]:bg-blue-600">All</TabsTrigger>
                      <TabsTrigger value="income" className="text-slate-700 data-[state=active]:text-white data-[state=active]:bg-emerald-600">Income</TabsTrigger>
                      <TabsTrigger value="expense" className="text-slate-700 data-[state=active]:text-white data-[state=active]:bg-red-600">Expense</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {filteredTransactions.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No transactions yet.</p>
                )}
                {filteredTransactions.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{t.description}</p>
                      <p className="text-xs text-slate-500 capitalize mt-1">
                        {t.type === 'income' ? '📥 Incoming' : '📤 Outgoing'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`font-bold text-lg whitespace-nowrap ${
                          t.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}₹{Math.round(t.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(t.id)}
                        className="hover:bg-red-100 hover:text-red-600 text-slate-500 transition-colors rounded-lg"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
