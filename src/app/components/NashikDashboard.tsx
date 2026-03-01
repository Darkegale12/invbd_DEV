import { Activity, AlertCircle, Calendar, CheckCircle, DollarSign, MapPin, Target, TrendingDown, TrendingUp, Users, Zap } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { nashikCasesTrend, nashikFoggingInstances, nashikResourceAllocation, nashikZonePerformance } from '../data/nashik-dashboard-data';
import { nashikHotspots } from '../data/nashik-hotspots';

export function NashikDashboard() {
    const totalCases = nashikZonePerformance.reduce((sum, z) => sum + z.cases, 0);
    const totalFogging = nashikFoggingInstances.filter(f => f.status === 'completed').length;
    const avgResponseTime = (nashikZonePerformance.reduce((sum, z) => sum + z.responseTime, 0) / nashikZonePerformance.length).toFixed(1);
    const totalBreedingSitesEliminated = nashikZonePerformance.reduce((sum, z) => sum + z.breedingSitesEliminated, 0);
    const highRiskZones = nashikZonePerformance.filter(z => z.riskLevel === 'high').length;
    const highRiskHotspots = nashikHotspots.filter(h => h.riskLevel === 'high').length;

    const latestWeekCases = nashikCasesTrend[nashikCasesTrend.length - 1]?.cases || 0;
    const previousWeekCases = nashikCasesTrend[nashikCasesTrend.length - 2]?.cases || 0;
    const casesChange = ((latestWeekCases - previousWeekCases) / previousWeekCases * 100).toFixed(1);
    const casesTrendDirection = latestWeekCases < previousWeekCases ? 'down' : 'up';

    const foggingByZone = nashikZonePerformance.map(z => ({
        name: z.zoneName.split(' ')[0],
        count: z.foggingCount,
        effectiveness: z.foggingCount > 0
            ? nashikFoggingInstances.filter(f => f.zoneId === z.zoneId && f.status === 'completed').reduce((sum, f) => sum + f.effectiveness, 0) / z.foggingCount
            : 0,
    }));

    const budgetUtilization = [
        { name: 'Spent', value: nashikResourceAllocation.spent },
        { name: 'Remaining', value: nashikResourceAllocation.totalBudget - nashikResourceAllocation.spent },
    ];

    const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

    return (
        <div className="h-full overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Nashik Prevention Analytics</h1>
                        <p className="text-sm text-gray-600">Real-time monitoring &amp; performance metrics – Nashik Municipal Corporation</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Last 3 Months</span>
                    </div>
                </div>

                {/* KPI Row 1 */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Cases</p>
                                <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {casesTrendDirection === 'down' ? <TrendingDown className="w-4 h-4 text-green-600" /> : <TrendingUp className="w-4 h-4 text-red-600" />}
                                    <span className={`text-xs ${casesTrendDirection === 'down' ? 'text-green-600' : 'text-red-600'}`}>{casesChange}% vs last week</span>
                                </div>
                            </div>
                            <Activity className="w-10 h-10 text-red-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Fogging Operations</p>
                                <p className="text-2xl font-bold text-gray-900">{totalFogging}</p>
                                <p className="text-xs text-gray-500 mt-1">Completed this quarter</p>
                            </div>
                            <Zap className="w-10 h-10 text-blue-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Response Time</p>
                                <p className="text-2xl font-bold text-gray-900">{avgResponseTime}h</p>
                                <p className="text-xs text-gray-500 mt-1">From alert to action</p>
                            </div>
                            <Target className="w-10 h-10 text-orange-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Sites Eliminated</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBreedingSitesEliminated}</p>
                                <p className="text-xs text-gray-500 mt-1">Breeding sites cleared</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* KPI Row 2 */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-red-100">High Risk Zones</p><p className="text-3xl font-bold">{highRiskZones}</p></div>
                            <AlertCircle className="w-10 h-10 text-white opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-purple-100">High Risk Hotspots</p><p className="text-3xl font-bold">{highRiskHotspots}</p></div>
                            <MapPin className="w-10 h-10 text-white opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-blue-100">Active Teams</p><p className="text-3xl font-bold">{nashikResourceAllocation.teams}</p></div>
                            <Users className="w-10 h-10 text-white opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-green-100">Budget Utilized</p><p className="text-3xl font-bold">{((nashikResourceAllocation.spent / nashikResourceAllocation.totalBudget) * 100).toFixed(0)}%</p></div>
                            <DollarSign className="w-10 h-10 text-white opacity-30" />
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases Trend (Weekly)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={nashikCasesTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="cases" stackId="1" stroke="#ef4444" fill="#ef4444" name="New Cases" />
                                <Area type="monotone" dataKey="recovered" stackId="2" stroke="#22c55e" fill="#22c55e" name="Recovered" />
                                <Area type="monotone" dataKey="deaths" stackId="3" stroke="#6b7280" fill="#6b7280" name="Deaths" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fogging Operations by Zone</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={foggingByZone}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Operations Count" />
                                <Bar yAxisId="right" dataKey="effectiveness" fill="#22c55e" name="Avg Effectiveness %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Zone Performance Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Zone Performance Matrix</h3>
                        <p className="text-sm text-gray-600">Comprehensive metrics for all Nashik monitored zones</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Zone', 'Risk Level', 'Cases', 'Fogging Ops', 'Trap Efficiency', 'Response Time', 'Sites Eliminated'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {nashikZonePerformance.map(zone => (
                                    <tr key={zone.zoneId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.zoneName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${zone.riskLevel === 'high' ? 'bg-red-100 text-red-800' : zone.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {zone.riskLevel.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.cases}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.foggingCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${zone.trapEfficiency}%` }} />
                                                </div>
                                                <span className="text-sm text-gray-900">{zone.trapEfficiency}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.responseTime}h</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.breedingSitesEliminated}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases Distribution by Zone</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={nashikZonePerformance}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ zoneName, percent }) => `${zoneName?.split(' ')[0] || ''}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="cases"
                                    nameKey="zoneName"
                                >
                                    {nashikZonePerformance.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={budgetUtilization}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ₹${(value / 1000000).toFixed(1)}M`}
                                    outerRadius={70}
                                    dataKey="value"
                                >
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#22c55e" />
                                </Pie>
                                <Tooltip formatter={(value: number) => `₹${(value / 1000000).toFixed(2)}M`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Total Budget:</span><span className="font-semibold">₹{(nashikResourceAllocation.totalBudget / 1000000).toFixed(1)}M</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Spent:</span><span className="font-semibold text-red-600">₹{(nashikResourceAllocation.spent / 1000000).toFixed(1)}M</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Remaining:</span><span className="font-semibold text-green-600">₹{((nashikResourceAllocation.totalBudget - nashikResourceAllocation.spent) / 1000000).toFixed(1)}M</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
