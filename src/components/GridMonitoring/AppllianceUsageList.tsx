
import React from 'react';
import { Power, AlertCircle, Clock } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplianceUsageData } from '@/utils/worldEngine/types';

interface ApplianceUsageListProps {
  appliances: ApplianceUsageData[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export const ApplianceUsageList = ({ 
  appliances, 
  title = "High Usage Appliances",
  emptyMessage = "No high usage appliances detected",
  isLoading = false
}: ApplianceUsageListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Power className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (appliances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Power className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-4">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Power className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appliance</TableHead>
              <TableHead className="text-right">Power</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appliances.map((appliance) => (
              <TableRow key={`${appliance.derId}-${appliance.applianceId}`}>
                <TableCell className="font-medium">{appliance.applianceName}</TableCell>
                <TableCell className="text-right">
                  {(appliance.powerRating / 1000).toFixed(1)} kW
                </TableCell>
                <TableCell>{appliance.location.city}</TableCell>
                <TableCell>
                  {appliance.switched_on ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-200">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
