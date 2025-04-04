import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Package, Mail, ShoppingCart } from 'lucide-react';
import './Analytics.css';
import { API_BASE_URL } from '../../../Config';

// Custom Card Components
const Card = ({ children, className }) => (
  <div className={`card ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`card-header ${className || ''}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`card-title ${className || ''}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={`card-content ${className || ''}`}>
    {children}
  </div>
);

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, valuePrefix }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${valuePrefix || ''}${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    users: 1,
    orders: 39,
    emails: 11,
    products: 41,
    totalOrders: 39,
    completedOrders: 35,
  });
  const [timeSeriesData, setTimeSeriesData] = useState([
    { name: 'Jan', users: 250, orders: 400 },
    { name: 'Feb', users: 300, orders: 500 },
    { name: 'Mar', users: 350, orders: 600 },
    { name: 'Apr', users: 400, orders: 750 },
    { name: 'May', users: 450, orders: 800 },
    { name: 'Jun', users: 500, orders: 900 },
  ]);
  const [orderStatusData, setOrderStatusData] = useState([
    { name: 'Completed', value: 35 },
    { name: 'Pending', value: 4 },
  ]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/analytics/adminAnalytics`);
        const result = await response.json();
        
        if (result) {
          setData({
            users: result.users || data.users,
            orders: result.orders || data.orders,
            emails: result.emails || data.emails,
            products: result.products || data.products,
            totalOrders: result.totalOrders || data.totalOrders,
            completedOrders: result.completedOrders || data.completedOrders,
          });
          
          if (result.timeSeriesData && result.timeSeriesData.length > 0) {
            setTimeSeriesData(result.timeSeriesData);
          }
          
          if (result.completedOrders !== undefined && result.totalOrders !== undefined) {
            setOrderStatusData([
              { name: 'Completed', value: result.completedOrders },
              { name: 'Pending', value: result.totalOrders - result.completedOrders },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh data every 5 seconds
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const metrics = [
    { title: 'Total Users', value: data.users, icon: Users, change: '+12% from last month', color: 'blue' },
    { title: 'Products', value: data.products, icon: Package, change: '+5% from last month', color: 'green' },
    { title: 'Emails Sent', value: data.emails, icon: Mail, change: '+18% from last month', color: 'purple' },
    { title: 'Orders', value: data.orders, icon: ShoppingCart, change: '+8% from last month', color: 'orange' },
  ];

  // Colors that match the screenshot
  const colors = ['#6366F1', '#10B981'];
  
  // Pie chart animation handlers
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <div className="dashboard-container">
      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="metric-card">
            <CardContent>
              <div className="metric-content">
                <div>
                  <p className="metric-title">{metric.title}</p>
                  <h3 className="metric-value">{metric.value}</h3>
                </div>
                <metric.icon className={`metric-icon ${metric.color}`} />
              </div>
              <div className="metric-change">
                <ArrowUpRight className="change-icon green" />
                <span className="change-text green">{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
  
      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }}
                    onMouseEnter={(e) => {
                      document.body.style.cursor = 'pointer';
                    }}
                    onMouseLeave={(e) => {
                      document.body.style.cursor = 'default';
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#6366F1" 
                    strokeWidth={2} 
                    dot={{ fill: '#6366F1', r: 5 }}
                    activeDot={{ r: 7, fill: '#4F46E5' }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={{ fill: '#10B981', r: 5 }}
                    activeDot={{ r: 7, fill: '#059669' }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
  
        {/* Order Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index]} 
                        opacity={activeIndex === index ? 1 : 0.85}
                        stroke={activeIndex === index ? "#fff" : "none"}
                        strokeWidth={activeIndex === index ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip valuePrefix="" />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }}
                    onMouseEnter={(e) => {
                      document.body.style.cursor = 'pointer';
                    }}
                    onMouseLeave={(e) => {
                      document.body.style.cursor = 'default';
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;