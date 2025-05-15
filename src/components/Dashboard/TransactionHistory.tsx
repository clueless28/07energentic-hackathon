
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { historicalTransactions } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const TransactionHistory = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-medium">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historicalTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="rounded-full h-8 w-8 bg-green-100 text-green-600 flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.event}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-muted-foreground text-right">Energy Saved</p>
                  <p className="text-sm font-medium">{tx.energySaved}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground text-right">Earnings</p>
                  <p className="text-sm font-medium text-green-600">{tx.earnings}</p>
                </div>
                <div className="min-w-20 text-right">
                  <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-200">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
