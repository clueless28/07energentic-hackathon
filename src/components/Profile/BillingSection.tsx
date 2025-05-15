
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { billingHistory } from "@/lib/profileMockData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BillingSection = () => {
  // Mock data for charts
  const yearlyBillingData = [
    { month: 'Jan', amount: 124.52, savings: 10.30 },
    { month: 'Feb', amount: 118.63, savings: 12.40 },
    { month: 'Mar', amount: 102.57, savings: 15.20 },
    { month: 'Apr', amount: 94.32, savings: 18.75 },
    { month: 'May', amount: 0, savings: 0 }, // Current month, not billed yet
    { month: 'Jun', amount: 0, savings: 0 },
    { month: 'Jul', amount: 0, savings: 0 },
    { month: 'Aug', amount: 0, savings: 0 },
    { month: 'Sep', amount: 0, savings: 0 },
    { month: 'Oct', amount: 0, savings: 0 },
    { month: 'Nov', amount: 0, savings: 0 },
    { month: 'Dec', amount: 0, savings: 0 },
  ];

  const usageData = [
    { month: 'Jan', baseline: 12.8, peak: 18.2, actual: 16.5 },
    { month: 'Feb', baseline: 10.5, peak: 16.2, actual: 14.8 },
    { month: 'Mar', baseline: 9.1, peak: 14.8, actual: 12.2 },
    { month: 'Apr', baseline: 8.2, peak: 12.4, actual: 9.7 },
    { month: 'May', baseline: 7.4, peak: 10.8, actual: 8.6 },
    { month: 'Jun', baseline: 0, peak: 0, actual: 0 },
    { month: 'Jul', baseline: 0, peak: 0, actual: 0 },
    { month: 'Aug', baseline: 0, peak: 0, actual: 0 },
    { month: 'Sep', baseline: 0, peak: 0, actual: 0 },
    { month: 'Oct', baseline: 0, peak: 0, actual: 0 },
    { month: 'Nov', baseline: 0, peak: 0, actual: 0 },
    { month: 'Dec', baseline: 0, peak: 0, actual: 0 },
  ];
  
  // Simulate data for the next bill
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentBill = {
    estimatedAmount: "$87.50",
    projectedSavings: "$22.30",
    dueDate: new Date(2025, 5, 15).toLocaleDateString(),
    currentUsage: "8.6 kWh",
    baselineProjection: "11.2 kWh",
    savingsPercentage: "23%"
  };

  return (
    <div className="space-y-8">
      {/* Current Billing Period Card */}
      <Card className="glass-card shadow-lg">
        <CardHeader>
          <CardTitle>Current Billing Period - {currentMonth} 2025</CardTitle>
          <CardDescription>Estimated charges and projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-lg bg-background/50 flex flex-col items-center">
              <span className="text-muted-foreground text-sm">Estimated Amount</span>
              <span className="text-3xl font-bold text-primary mt-2">{currentBill.estimatedAmount}</span>
              <span className="text-xs text-muted-foreground mt-1">Due {currentBill.dueDate}</span>
            </div>
            <div className="p-4 rounded-lg bg-background/50 flex flex-col items-center">
              <span className="text-muted-foreground text-sm">Projected Savings</span>
              <span className="text-3xl font-bold text-green-500 mt-2">{currentBill.projectedSavings}</span>
              <span className="text-xs text-green-500 mt-1">{currentBill.savingsPercentage} below baseline</span>
            </div>
            <div className="p-4 rounded-lg bg-background/50 flex flex-col items-center">
              <span className="text-muted-foreground text-sm">Current Usage</span>
              <span className="text-3xl font-bold text-primary mt-2">{currentBill.currentUsage}</span>
              <span className="text-xs text-muted-foreground mt-1">Baseline: {currentBill.baselineProjection}</span>
            </div>
          </div>
          
          <div className="bg-background/50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Usage Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usageData.filter(d => d.actual > 0)}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    unit=" kWh"
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip formatter={(value) => [`${value} kWh`, '']} />
                  <Area type="monotone" dataKey="peak" name="Peak" stroke="#ef4444" fill="#ef444430" />
                  <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#6366f1" fill="#6366f130" />
                  <Area type="monotone" dataKey="actual" name="Your Usage" stroke="#10b981" fill="#10b98130" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Yearly Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>2025 Billing Overview</CardTitle>
          <CardDescription>Year-to-date charges and savings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="charges">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="charges">Charges</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>
            <TabsContent value="charges">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={yearlyBillingData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip formatter={(value) => {
                      // Check if value is a number before using toFixed
                      const formattedValue = typeof value === 'number' ? `$${value.toFixed(2)}` : `$${value}`;
                      return [formattedValue, ''];
                    }} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      name="Monthly Bill" 
                      stroke="#0ea5e9" 
                      fill="#0ea5e930" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="savings">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={yearlyBillingData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip formatter={(value) => {
                      // Check if value is a number before using toFixed
                      const formattedValue = typeof value === 'number' ? `$${value.toFixed(2)}` : `$${value}`;
                      return [formattedValue, ''];
                    }} />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      name="DR Savings" 
                      stroke="#10b981" 
                      fill="#10b98130" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">Year-to-date Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Total Billed</p>
                <p className="text-xl font-bold text-primary">$440.04</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Total Savings</p>
                <p className="text-xl font-bold text-green-500">$56.65</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Avg. Monthly</p>
                <p className="text-xl font-bold text-primary">$110.01</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Billing History Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent bills and payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>DR Savings</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.period}</TableCell>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell className="text-green-500">{bill.savingsFromDR}</TableCell>
                  <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={bill.status === "Paid" ? "outline" : "default"}
                      className={bill.status === "Paid" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}
                    >
                      {bill.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">{currentMonth} 2025</TableCell>
                <TableCell>{currentBill.estimatedAmount} (est.)</TableCell>
                <TableCell className="text-green-500">{currentBill.projectedSavings} (est.)</TableCell>
                <TableCell>{currentBill.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Upcoming</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="mt-4 p-4 bg-background/50 rounded-md">
            <h3 className="font-medium mb-2">Bill Breakdown for April 2025</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Energy Charges:</span>
                <span>$78.45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charges:</span>
                <span>$24.80</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regulatory Charges:</span>
                <span>$9.82</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak Demand Charge:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DR Participation Credit:</span>
                <span className="text-green-500">-$18.75</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>$94.32</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
