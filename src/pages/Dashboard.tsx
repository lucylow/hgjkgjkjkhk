import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  Factory, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Activity,
  Wifi,
  WifiOff,
  ArrowRight,
  Zap,
  BarChart3,
  Settings,
  Wrench,
  Clock,
  XCircle
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { EquipmentHealthCard } from "@/components/dashboard/EquipmentHealthCard";
import { PredictiveAlerts } from "@/components/dashboard/PredictiveAlerts";
import { MaintenanceSchedule } from "@/components/dashboard/MaintenanceSchedule";
import { HealthTrendChart } from "@/components/analytics/HealthTrendChart";
import { FailureProbabilityChart } from "@/components/analytics/FailureProbabilityChart";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { mockPredictions, calculateDashboardStats } from "@/data/mockData";
import { formatCurrency, formatPercentage, formatDate } from "@/utils/formatters";
import { PredictionStatus, EquipmentStatus } from "@/types/equipment";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { equipment, loading, refreshData } = useEquipmentData();
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const stats = calculateDashboardStats(equipment);

  const activePredictions = useMemo(() => 
    mockPredictions.filter(p => p.predictionStatus === PredictionStatus.ACTIVE),
    []
  );

  const criticalAlerts = useMemo(() => 
    activePredictions.filter(p => p.failureProbability >= 0.7),
    [activePredictions]
  );

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.05);
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Health distribution for pie chart
  const healthDistribution = [
    { name: "Healthy", value: stats.healthy, color: "hsl(142, 71%, 45%)" },
    { name: "Warning", value: stats.warning, color: "hsl(38, 92%, 50%)" },
    { name: "Critical", value: stats.critical, color: "hsl(0, 84%, 60%)" },
  ];

  // Equipment status for bar chart
  const statusData = [
    { status: "Operational", count: equipment.filter(e => e.status === EquipmentStatus.OPERATIONAL).length, fill: "hsl(142, 71%, 45%)" },
    { status: "Degraded", count: equipment.filter(e => e.status === EquipmentStatus.DEGRADED).length, fill: "hsl(38, 92%, 50%)" },
    { status: "Maintenance", count: equipment.filter(e => e.status === EquipmentStatus.MAINTENANCE).length, fill: "hsl(217, 91%, 60%)" },
  ];

  // Sensor throughput data
  const throughputData = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      sensors: 8000 + Math.random() * 4000,
      predictions: 50 + Math.random() * 30,
    })), []
  );

  const statCards = [
    {
      label: "Total Equipment",
      value: stats.total.toString(),
      icon: Factory,
      subtext: `Across 2 facilities`,
      gradient: "from-primary/20 to-primary/5",
      border: "border-primary/30",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Average Health",
      value: formatPercentage(stats.avgHealth),
      icon: TrendingUp,
      subtext: `${stats.healthy} healthy units`,
      gradient: "from-success/20 to-success/5",
      border: "border-success/30",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      trend: "+2.4%",
    },
    {
      label: "Active Alerts",
      value: activePredictions.length.toString(),
      icon: AlertTriangle,
      subtext: `${criticalAlerts.length} critical`,
      gradient: "from-warning/20 to-warning/5",
      border: "border-warning/30",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      label: "Est. Savings",
      value: formatCurrency(activePredictions.reduce((sum, p) => sum + (p.estimatedCost || 0), 0)),
      icon: DollarSign,
      subtext: "From predictive maintenance",
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/30",
      iconBg: "bg-accent/10",
      iconColor: "text-accent-foreground",
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">IoT Maintenance Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time equipment monitoring & predictive analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className={cn(
                "gap-1.5 px-3 py-1",
                isConnected && "bg-success/10 text-success border-success/20 hover:bg-success/20"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-success animate-pulse" : "bg-destructive"
              )} />
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Updated {formatDate(lastUpdate, "time")}
            </span>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards with Gradients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className={cn("bg-gradient-to-br border", stat.gradient, stat.border)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                      {stat.trend && (
                        <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-xl", stat.iconBg)}>
                    <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Status Banner */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-sm font-medium text-muted-foreground">System Status:</span>
              {[
                { label: "IoT Sensors", status: true },
                { label: "ML Models", status: true },
                { label: "Data Pipeline", status: true },
                { label: "Tableau", status: true },
              ].map((system) => (
                <div key={system.label} className="flex items-center gap-2">
                  {system.status ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm">{system.label}</span>
                </div>
              ))}
              <div className="ml-auto">
                <Badge variant="outline" className="gap-1.5">
                  <Zap className="w-3 h-3 text-warning" />
                  10,245 sensors/sec
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Trend - Large */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4 h-[350px]">
              <HealthTrendChart equipmentIds={equipment.slice(0, 3).map(e => e.id)} />
            </CardContent>
          </Card>

          {/* Health Distribution Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-primary" />
                Health Distribution
              </CardTitle>
              <CardDescription>Equipment by health status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {healthDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Equipment & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment Grid */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-primary" />
                    Equipment Health Overview
                  </CardTitle>
                  <Link to="/equipment">
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {equipment
                    .sort((a, b) => a.currentHealthScore - b.currentHealthScore)
                    .map((eq) => (
                      <EquipmentHealthCard key={eq.id} equipment={eq} />
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Equipment by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis dataKey="status" type="category" width={85} tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={25}>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Failure Probability */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Top Failure Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <FailureProbabilityChart limit={5} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts & Schedule */}
          <div className="space-y-6">
            <PredictiveAlerts maxAlerts={5} />
            <MaintenanceSchedule daysAhead={7} />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
              <div className="flex flex-wrap gap-2">
                <Link to="/analytics">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/maintenance">
                  <Button variant="outline" size="sm">
                    <Wrench className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Alerts
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alert Banner */}
        {stats.critical > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-destructive">
                    {stats.critical} equipment in critical condition!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Immediate maintenance required to prevent failures.
                  </p>
                </div>
              </div>
              <Link to="/alerts">
                <Button variant="destructive">View All Alerts</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
