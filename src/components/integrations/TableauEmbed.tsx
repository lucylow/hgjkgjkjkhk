import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  RefreshCw, 
  Maximize2, 
  Download, 
  Settings, 
  Filter, 
  LayoutGrid,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardType = 'health' | 'predictions' | 'schedule' | 'analytics';

interface TableauEmbedProps {
  dashboardType: DashboardType;
  equipmentId?: string;
  height?: number;
  showControls?: boolean;
}

const dashboardConfigs: Record<DashboardType, { title: string; description: string; requiredFilters: string[] }> = {
  health: {
    title: 'Equipment Health Dashboard',
    description: 'Real-time health monitoring and trend analysis',
    requiredFilters: ['factory_id', 'equipment_type'],
  },
  predictions: {
    title: 'Failure Predictions Analytics',
    description: 'ML prediction results and confidence analysis',
    requiredFilters: ['prediction_horizon'],
  },
  schedule: {
    title: 'Maintenance Schedule Optimization',
    description: 'Optimized maintenance planning and resource allocation',
    requiredFilters: ['timeframe'],
  },
  analytics: {
    title: 'Predictive Analytics Dashboard',
    description: 'Comprehensive analytics and ROI calculations',
    requiredFilters: [],
  },
};

export const TableauEmbed = ({
  dashboardType,
  equipmentId,
  height = 500,
  showControls = true,
}: TableauEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'interactive' | 'static'>('interactive');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const config = dashboardConfigs[dashboardType];

  // Simulate dashboard loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [dashboardType, equipmentId]);

  const applyFilter = useCallback((field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refreshDashboard = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const enterFullscreen = useCallback(() => {
    containerRef.current?.requestFullscreen?.();
  }, []);

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </div>
        
        {showControls && (
          <TooltipProvider>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={refreshDashboard}>
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh Data</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={enterFullscreen}>
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fullscreen</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        {showControls && (
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="outline" className="gap-1">
              <Filter className="w-3 h-3" />
              Filters
            </Badge>
            
            <Select value={viewType} onValueChange={(v) => setViewType(v as 'interactive' | 'static')}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interactive">Interactive</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
            
            {dashboardType === 'health' && (
              <>
                <Select value={filters.factory_id || ''} onValueChange={(v) => applyFilter('factory_id', v)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Factory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="factory-1">Factory 1</SelectItem>
                    <SelectItem value="factory-2">Factory 2</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.equipment_type || ''} onValueChange={(v) => applyFilter('equipment_type', v)}>
                  <SelectTrigger className="w-36 h-8">
                    <SelectValue placeholder="Equipment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pump">Pumps</SelectItem>
                    <SelectItem value="motor">Motors</SelectItem>
                    <SelectItem value="compressor">Compressors</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            
            {dashboardType === 'predictions' && (
              <Select value={filters.prediction_horizon || '7'} onValueChange={(v) => applyFilter('prediction_horizon', v)}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue placeholder="Horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center" style={{ height }}>
            <Progress value={66} className="w-1/2 mb-3" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <Alert variant="destructive" style={{ height }}>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Dashboard Container */}
        {!loading && !error && (
          <div
            ref={containerRef}
            className="border rounded-lg bg-secondary/20 flex items-center justify-center"
            style={{ height }}
          >
            <div className="text-center text-muted-foreground">
              <LayoutGrid className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tableau Dashboard Placeholder</p>
              <p className="text-xs">Connect Tableau Server to view live data</p>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-muted-foreground">
            Data updates every 5 minutes
          </p>
          <Badge variant="outline" className="gap-1 text-xs">
            <LayoutGrid className="w-3 h-3" />
            Tableau Embedded
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableauEmbed;
