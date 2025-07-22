"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  PiggyBank,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock financial data - replace with real data from your store
  const financialStats = {
    eltiw: {
      total: 15420.50,
      thisMonth: 2845.75,
      categories: [
        { name: "Living Expenses", amount: 1200, percentage: 42 },
        { name: "Transportation", amount: 450, percentage: 16 },
        { name: "Food & Dining", amount: 380, percentage: 13 },
        { name: "Entertainment", amount: 250, percentage: 9 },
        { name: "Utilities", amount: 200, percentage: 7 },
        { name: "Other", amount: 365.75, percentage: 13 }
      ]
    },
    loans: {
      totalDebt: 45600.00,
      monthlyPayments: 1850.00,
      loans: [
        { 
          name: "Student Loan", 
          balance: 28500.00, 
          monthlyPayment: 420.00, 
          interestRate: 4.5,
          nextPayment: "2025-02-01"
        },
        { 
          name: "Car Loan", 
          balance: 17100.00, 
          monthlyPayment: 430.00, 
          interestRate: 6.2,
          nextPayment: "2025-01-28"
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ELTIW + Loan Tracker</h1>
          <p className="text-muted-foreground">
            Track your expenses and manage loan payments
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ELTIW Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialStats.eltiw.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${financialStats.eltiw.thisMonth.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${financialStats.loans.totalDebt.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {financialStats.loans.loans.length} loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialStats.loans.monthlyPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Due monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -${(financialStats.eltiw.thisMonth + financialStats.loans.monthlyPayments).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly outflow
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eltiw">ELTIW Tracker</TabsTrigger>
          <TabsTrigger value="loans">Loan Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ELTIW Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  ELTIW Summary
                </CardTitle>
                <CardDescription>Expense tracking and categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {financialStats.eltiw.categories.slice(0, 3).map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">${category.amount}</span>
                        <Badge variant="secondary">{category.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/finance/eltiw">
                  <Button className="w-full">View Full ELTIW Tracker</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Loans Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Loans
                </CardTitle>
                <CardDescription>Payment schedules and balances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {financialStats.loans.loans.map((loan) => (
                    <div key={loan.name} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{loan.name}</span>
                        <p className="text-xs text-muted-foreground">{loan.interestRate}% APR</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">${loan.balance.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground">${loan.monthlyPayment}/mo</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/finance/loans">
                  <Button className="w-full">View Loan Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="eltiw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ELTIW Tracker</CardTitle>
              <CardDescription>
                Track your expenses, living costs, and financial outflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">ELTIW Tracker Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed expense tracking and categorization will be available here.
                </p>
                <Link href="/finance/eltiw">
                  <Button>Setup ELTIW Tracking</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Management</CardTitle>
              <CardDescription>
                Track loan balances, payments, and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Loan Tracker Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your loans, payment schedules, and track payoff progress.
                </p>
                <Link href="/finance/loans">
                  <Button>Setup Loan Tracking</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
