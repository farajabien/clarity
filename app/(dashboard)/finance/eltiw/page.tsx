import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Target,
  DollarSign,
  TrendingUp, 
  Calendar,
  Gift,
  Heart,
  Star,
  Users,
  PlusCircle,
  Clock,
  AlertCircle
} from "lucide-react";

// Mock data for ELTIW (Every Lil Thing I Want) - Goals and Loans
const mockGoals = [
  {
    id: '1',
    title: 'New MacBook Pro',
    targetAmount: 2500.00,
    currentAmount: 1200.00,
    category: 'Electronics',
    deadline: '2025-06-01',
    priority: 'high',
    description: 'For development work and content creation'
  },
  {
    id: '2',
    title: 'Vacation to Japan',
    targetAmount: 5000.00,
    currentAmount: 800.00,
    category: 'Travel',
    deadline: '2025-12-01',
    priority: 'medium',
    description: 'Dream trip to explore Japanese culture'
  },
  {
    id: '3',
    title: 'Emergency Fund',
    targetAmount: 10000.00,
    currentAmount: 3500.00,
    category: 'Savings',
    deadline: '2025-12-31',
    priority: 'high',
    description: '6 months of living expenses'
  },
  {
    id: '4',
    title: 'New Camera',
    targetAmount: 800.00,
    currentAmount: 150.00,
    category: 'Electronics',
    deadline: '2025-04-15',
    priority: 'low',
    description: 'Photography hobby upgrade'
  }
];

const mockLoans = [
  {
    id: '1',
    borrowerName: 'Alex Johnson',
    amount: 500.00,
    paidAmount: 200.00,
    loanDate: '2024-12-15',
    dueDate: '2025-02-15',
    followUpDate: '2025-01-30',
    notes: 'For car repair emergency',
    status: 'partial' as const
  },
  {
    id: '2',
    borrowerName: 'Sarah Chen',
    amount: 150.00,
    paidAmount: 0.00,
    loanDate: '2025-01-10',
    dueDate: '2025-02-10',
    followUpDate: '2025-02-05',
    notes: 'Lunch money for the week',
    status: 'pending' as const
  },
  {
    id: '3',
    borrowerName: 'Mike Rodriguez',
    amount: 300.00,
    paidAmount: 300.00,
    loanDate: '2024-11-20',
    dueDate: '2025-01-20',
    followUpDate: null,
    notes: 'Concert ticket loan',
    status: 'paid' as const
  }
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Electronics': Star,
  'Travel': Heart,
  'Savings': DollarSign,
  'Other': Gift
};

export default function EltiwPage() {
  const totalGoalTarget = mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalProgress = mockGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalProgressPercentage = totalGoalTarget > 0 ? (totalGoalProgress / totalGoalTarget) * 100 : 0;

  const totalLoaned = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaidBack = mockLoans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  const totalOutstanding = totalLoaned - totalPaidBack;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'pending': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ELTIW - Every Lil Thing I Want</h1>
          <p className="text-muted-foreground">
            Track your goals, dreams, and loans with revolutionary Slug Store technology
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Goals & Loans Tracker</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalProgressPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalGoalProgress)} of {formatCurrency(totalGoalTarget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Dreams being tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Loans</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              Money lent to friends
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loaned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLoaned)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalPaidBack)} paid back
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                My Goals & Dreams
              </CardTitle>
              <CardDescription>
                Track every lil thing you want and watch your progress grow
              </CardDescription>
            </div>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockGoals.map((goal) => {
              const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
              const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
              const IconComponent = categoryIcons[goal.category] || Gift;
              
              return (
                <Card key={goal.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-blue-500" />
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      <Badge variant={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span>{formatCurrency(goal.targetAmount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${daysUntilDeadline <= 30 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{daysUntilDeadline} days left</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Loans Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Money I&apos;ve Lent
              </CardTitle>
              <CardDescription>
                Track money you&apos;ve lent to friends and family
              </CardDescription>
            </div>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Record Loan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid Back</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLoans.map((loan) => {
                const daysUntilDue = getDaysUntilDeadline(loan.dueDate);
                const isOverdue = daysUntilDue < 0;
                
                return (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(loan.paidAmount)}</span>
                        {loan.amount > loan.paidAmount && (
                          <Badge variant="outline" className="text-xs">
                            {formatCurrency(loan.amount - loan.paidAmount)} left
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(loan.dueDate).toLocaleDateString()}</span>
                        {isOverdue && <AlertCircle className="w-4 h-4" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {loan.notes}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slug Store Technology Info */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Powered by Slug Store Technology
          </CardTitle>
          <CardDescription>
            Revolutionary data compression - your entire financial data fits in a shareable URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">70%</div>
              <p className="text-sm text-muted-foreground">Data Compression</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <p className="text-sm text-muted-foreground">Database Required</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <p className="text-sm text-muted-foreground">Instant Sharing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
