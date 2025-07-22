"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calculator,
  Plus,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingDown,
  CheckCircle
} from "lucide-react";

interface Loan {
  id: string;
  name: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  remainingMonths: number;
  totalInterest: number;
}

interface Payment {
  id: string;
  loanId: string;
  date: string;
  amount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      name: 'Student Loan',
      originalAmount: 35000,
      currentBalance: 28500,
      interestRate: 4.5,
      monthlyPayment: 420,
      nextPaymentDate: '2025-02-01',
      remainingMonths: 72,
      totalInterest: 8250
    },
    {
      id: '2',
      name: 'Car Loan',
      originalAmount: 22000,
      currentBalance: 17100,
      interestRate: 6.2,
      monthlyPayment: 430,
      nextPaymentDate: '2025-01-28',
      remainingMonths: 48,
      totalInterest: 3850
    }
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: '1',
      loanId: '1',
      date: '2025-01-01',
      amount: 420,
      principal: 325.50,
      interest: 94.50,
      remainingBalance: 28500
    },
    {
      id: '2',
      loanId: '2',
      date: '2025-01-01',
      amount: 430,
      principal: 341.25,
      interest: 88.75,
      remainingBalance: 17100
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLoan, setNewLoan] = useState({
    name: '',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    monthlyPayment: ''
  });

  const totalDebt = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const totalOriginalDebt = loans.reduce((sum, loan) => sum + loan.originalAmount, 0);
  const totalPaidOff = totalOriginalDebt - totalDebt;
  const progressPercentage = totalOriginalDebt > 0 ? (totalPaidOff / totalOriginalDebt) * 100 : 0;

  const handleAddLoan = () => {
    if (!newLoan.name || !newLoan.originalAmount || !newLoan.currentBalance || !newLoan.interestRate || !newLoan.monthlyPayment) return;

    const loan: Loan = {
      id: Date.now().toString(),
      name: newLoan.name,
      originalAmount: parseFloat(newLoan.originalAmount),
      currentBalance: parseFloat(newLoan.currentBalance),
      interestRate: parseFloat(newLoan.interestRate),
      monthlyPayment: parseFloat(newLoan.monthlyPayment),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      remainingMonths: Math.ceil(parseFloat(newLoan.currentBalance) / parseFloat(newLoan.monthlyPayment)),
      totalInterest: 0 // Would calculate based on payment schedule
    };

    setLoans([...loans, loan]);
    setNewLoan({
      name: '',
      originalAmount: '',
      currentBalance: '',
      interestRate: '',
      monthlyPayment: ''
    });
    setShowAddForm(false);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getDaysUntilPayment = (date: string) => {
    const paymentDate = new Date(date);
    const today = new Date();
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Tracker</h1>
          <p className="text-muted-foreground">
            Manage your loans, payment schedules, and track payoff progress
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Loan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">
              Across {loans.length} loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthlyPayments)}</div>
            <p className="text-xs text-muted-foreground">
              Due monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Off</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaidOff)}</div>
            <p className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Original Debt</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOriginalDebt)}</div>
            <p className="text-xs text-muted-foreground">
              Starting amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Debt Payoff Progress</CardTitle>
          <CardDescription>
            Overall progress towards becoming debt-free
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}% paid off</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(totalPaidOff)} paid</span>
              <span>{formatCurrency(totalDebt)} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Loan Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loan-name">Loan Name</Label>
                <Input
                  id="loan-name"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({...newLoan, name: e.target.value})}
                  placeholder="e.g., Student Loan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original-amount">Original Amount</Label>
                <Input
                  id="original-amount"
                  type="number"
                  step="0.01"
                  value={newLoan.originalAmount}
                  onChange={(e) => setNewLoan({...newLoan, originalAmount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-balance">Current Balance</Label>
                <Input
                  id="current-balance"
                  type="number"
                  step="0.01"
                  value={newLoan.currentBalance}
                  onChange={(e) => setNewLoan({...newLoan, currentBalance: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.01"
                  value={newLoan.interestRate}
                  onChange={(e) => setNewLoan({...newLoan, interestRate: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-payment">Monthly Payment</Label>
                <Input
                  id="monthly-payment"
                  type="number"
                  step="0.01"
                  value={newLoan.monthlyPayment}
                  onChange={(e) => setNewLoan({...newLoan, monthlyPayment: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddLoan}>Add Loan</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>Your current loan details and payment schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => {
                const progressPct = loan.originalAmount > 0 ? ((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100 : 0;
                const daysUntilPayment = getDaysUntilPayment(loan.nextPaymentDate);
                
                return (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.name}</TableCell>
                    <TableCell>{formatCurrency(loan.currentBalance)}</TableCell>
                    <TableCell>{loan.interestRate}%</TableCell>
                    <TableCell>{formatCurrency(loan.monthlyPayment)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(loan.nextPaymentDate).toLocaleDateString()}</span>
                        {daysUntilPayment <= 7 && (
                          <Badge variant={daysUntilPayment <= 3 ? "destructive" : "secondary"}>
                            {daysUntilPayment} days
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={progressPct} className="h-2" />
                        <span className="text-xs text-muted-foreground">{progressPct.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Your latest loan payments and their breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Loan</TableHead>
                <TableHead>Total Payment</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const loan = loans.find(l => l.id === payment.loanId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{loan?.name}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(payment.principal)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(payment.interest)}</TableCell>
                    <TableCell>{formatCurrency(payment.remainingBalance)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
