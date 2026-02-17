import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PlusCircle, Trash2 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center"
        >
          Expense Tracker
        </motion.h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-green-600">
              ₹{Math.round(totals.income)}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-red-600">
              ₹{Math.round(totals.expense)}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              ₹{Math.round(totals.balance)}
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select onValueChange={setType} defaultValue="income">
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTransaction} className="flex gap-2">
              <PlusCircle size={18} /> Add
            </Button>
          </CardContent>
        </Card>

        {/* Chart + Transactions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transactions</CardTitle>
                <Tabs defaultValue="all" onValueChange={setFilter}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expense">Expense</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {filteredTransactions.length === 0 && (
                <p className="text-sm text-muted-foreground">No transactions yet.</p>
              )}
              {filteredTransactions.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-100"
                >
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {t.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        t.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹{Math.round(t.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
