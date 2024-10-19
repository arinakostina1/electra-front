// Working

// import React, { useEffect, useState } from 'react';
// import { fetchDataComponent } from './Fetch';

// const mockSalesData = [
//   { name: 'Jan', sales: 4500 },
//   { name: 'Feb', sales: 5200 },
//   { name: 'Mar', sales: 4800 },
//   { name: 'Apr', sales: 6300 },
//   { name: 'May', sales: 5600 },
//   { name: 'Jun', sales: 7100 },
//   { name: 'Jul', sales: 6800 },
//   { name: 'Aug', sales: 7400 },
//   { name: 'Sep', sales: 8200 },
//   { name: 'Oct', sales: 7900 },
//   { name: 'Nov', sales: 8700 },
//   { name: 'Dec', sales: 9400 }
// ];

// function Dashboard() {
//   const [breakdown, setBreakdown] = useState(null);
//   const [calculatedSalesData, setCalculatedSalesData] = useState([]);

//   useEffect(() => {
//     async function fetchBreakdown() {
//       const breakdownData = await fetchDataComponent();
//       setBreakdown(breakdownData);
//     }
//     fetchBreakdown();
//   }, []);

//   useEffect(() => {
//     if (breakdown) {
//       const updatedSalesData = mockSalesData.map((item, index, array) => {
//         // Calculate total revenue
//         const revenue = item.sales;

//         // Calculate revenue percentage change
//         const previousRevenue = index > 0 ? array[index - 1].sales * 0.25 : revenue;
//         const revenueChange = ((revenue - previousRevenue) / previousRevenue) * 100;

//         // Generate random but proportional category distributions
//         const total = item.sales;
//         const discount = Math.round(total * (0.25 + Math.random() * 0.1));
//         const regular = Math.round(total * (0.3 + Math.random() * 0.1));
//         const shop = Math.round(total * (0.2 + Math.random() * 0.1));
//         const photos = total - discount - regular - shop;

//         // Additional breakdown calculations using the fetched JSON values
//         const electricityGenerationCost = item.sales * breakdown.electricityGeneration;
//         const networkUsageCost = item.sales * breakdown.networkUsage;
//         const ancillaryServicesCost = item.sales * breakdown.ancillaryServices;
//         const fuelAdjustmentCost = item.sales * breakdown.fuelAdjustment;
//         const publicServiceObligationCost = item.sales * breakdown.publicServiceObligation;
//         const resEsFundCost = item.sales * breakdown.resEsFund;
//         const vatCost = item.sales * breakdown.vat;

//         return {
//           ...item,
//           revenue,
//           revenueChange: index === 0 ? 0 : revenueChange,
//           categoryBreakdown: [
//             { name: 'Fridge', value: discount, total },
//             { name: 'Air Conditioner', value: regular, total },
//             { name: 'Oven', value: shop, total },
//             { name: 'TV', value: photos, total }
//           ],
//           breakdownCosts: {
//             electricityGenerationCost,
//             networkUsageCost,
//             ancillaryServicesCost,
//             fuelAdjustmentCost,
//             publicServiceObligationCost,
//             resEsFundCost,
//             vatCost
//           }
//         };
//       });
//       setCalculatedSalesData(updatedSalesData);
//     }
//   }, [breakdown]);

//   if (!breakdown) {
//     return <div>Loading breakdown data...</div>;
//   }

//   return (
//     <div>
//       <h1>Sales Data with Breakdown Costs</h1>
//       <pre>{JSON.stringify(calculatedSalesData, null, 2)}</pre>
//     </div>
//   );
// }

// export default Dashboard;













import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { PieChart, Pie, Tooltip as PieTooltip, Legend } from 'recharts';
import { fetchDataComponent } from './Fetch';
import PowerBIReport from './powerbiReport.js';
import Pay from './pay.js';
import S3BucketContent from './backet.js'


// Generate mock sales data
const mockSalesData = [
  { name: 'Jan', sales: 4500 },
  { name: 'Feb', sales: 5200 },
  { name: 'Mar', sales: 4800 },
  { name: 'Apr', sales: 6300 },
  { name: 'May', sales: 5600 },
  { name: 'Jun', sales: 7100 },
  { name: 'Jul', sales: 6800 },
  { name: 'Aug', sales: 7400 },
  { name: 'Sep', sales: 8200 },
  { name: 'Oct', sales: 7900 },
  { name: 'Nov', sales: 8700 },
  { name: 'Dec', sales: 9400 },
].map((item, index, array) => {
  // Calculate revenue as 25% of sales
  const revenue = item.sales * 0.25;

  // Calculate revenue percentage change
  const previousRevenue = index > 0 ? array[index - 1].sales * 0.25 : revenue;
  const revenueChange = ((revenue - previousRevenue) / previousRevenue) * 100;

  // Generate random but proportional category distributions
  const total = item.sales;
  const discount = Math.round(total * (0.25 + Math.random() * 0.1));
  const regular = Math.round(total * (0.3 + Math.random() * 0.1));
  const shop = Math.round(total * (0.2 + Math.random() * 0.1));
  const photos = total - discount - regular - shop;

  return {
    ...item,
    revenue,
    revenueChange: index === 0 ? 0 : revenueChange,
    categoryBreakdown: [
      { name: 'Fridge', value: discount, total },
      { name: 'Air Conditioner', value: regular, total },
      { name: 'Oven', value: shop, total },
      { name: 'TV', value: photos, total }
    ]
  };
});

const COLORS = ['#0d6efd', '#0dcaf0', '#198754', '#ffc107'];

function Dashboard() {
  const [selectedBar, setSelectedBar] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedRevenue, setSelectedRevenue] = useState({
    value: mockSalesData[mockSalesData.length - 1].revenue,
    change: mockSalesData[mockSalesData.length - 1].revenueChange
  });
  const [breakdown, setBreakdown] = useState(null);
  const [totalAmount, settotalAmount] = useState(null);

  const [calculatedSalesData, setCalculatedSalesData] = useState([]);

  useEffect(() => {
    async function fetchBreakdown() {
      const breakdownData = await fetchDataComponent();
      setBreakdown(breakdownData[0]);
      settotalAmount(breakdownData[1])
    }
    fetchBreakdown();
  }, []);

  const [lastTotalAmountCost, setLastTotalAmountCost] = useState(null);

  useEffect(() => {
    if (breakdown) {
      const updatedSalesData = mockSalesData.map((item, index, array) => {
        // Calculate total revenue
        const revenue = item.sales;

        // Calculate revenue percentage change
        const previousRevenue = index > 0 ? array[index - 1].sales * 0.25 : revenue;
        const revenueChange = ((revenue - previousRevenue) / previousRevenue) * 100;

        // Generate random but proportional category distributions
        const total = item.sales;
        const discount = Math.round(total * (0.25 + Math.random() * 0.1));
        const regular = Math.round(total * (0.3 + Math.random() * 0.1));
        const shop = Math.round(total * (0.2 + Math.random() * 0.1));
        const photos = total - discount - regular - shop;

        // Calculate breakdown costs using fetched JSON values
        const totalAmountCost = item.sales*totalAmount
        const electricityGenerationCost = item.sales * breakdown.electricityGeneration;
        const networkUsageCost = item.sales * breakdown.networkUsage;
        const ancillaryServicesCost = item.sales * breakdown.ancillaryServices;
        const fuelAdjustmentCost = item.sales * breakdown.fuelAdjustment;
        const publicServiceObligationCost = item.sales * breakdown.publicServiceObligation;
        const resEsFundCost = item.sales * breakdown.resEsFund;
        const vatCost = item.sales * breakdown.vat;

        return {
          ...item,
          revenue,
          revenueChange: index === 0 ? 0 : revenueChange,
          categoryBreakdown: [
            { name: 'Fridge', value: discount, total },
            { name: 'Air Conditioner', value: regular, total },
            { name: 'Oven', value: shop, total },
            { name: 'TV', value: photos, total }
          ],
          breakdownCosts: {
            totalAmountCost,
            electricityGenerationCost,
            networkUsageCost,
            ancillaryServicesCost,
            fuelAdjustmentCost,
            publicServiceObligationCost,
            resEsFundCost,
            vatCost
          }
        };
      });
      setCalculatedSalesData(updatedSalesData);
      const lastCost = updatedSalesData[updatedSalesData.length - 1]?.breakdownCosts.totalAmountCost;
      setLastTotalAmountCost(lastCost);
    }
  }, [breakdown]);

  const handleBarClick = (data, index) => {
    setSelectedBar(index);
    setSelectedMonth(data.name);
    setSelectedCategories(data.categoryBreakdown);
    setSelectedRevenue({
      value: data.revenue,
      change: data.revenueChange
    });
  };

  // Custom Tooltip Component for Bar Chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="mb-0"><strong>{payload[0].payload.name}</strong></p>
          <p className="mb-0">Total Consumption: {payload[0].value.toLocaleString()} kWh</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip Component for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = (payload[0].value / payload[0].payload.total) * 100;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="mb-0"><strong>{payload[0].name}</strong></p>
          <p className="mb-0">{payload[0].value.toLocaleString()} kWh</p>
          <p className="mb-0">{percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  if (!breakdown) {
    return <div>Loading breakdown data...</div>;
  }

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div className="d-flex">
      {/* <Sidebar /> */}
      {/* Sidebar */}
      <div className="bg-primary" style={{ width: '164px', height: '100vh', position: 'fixed' }}>
  <div className="d-flex flex-column align-items-center py-4 gap-3">
    <div className="bg-white bg-opacity-75 rounded d-flex justify-content-center align-items-center text-pretty" style={{ width: '112px', height: '40px', padding: '8px' }}></div>
    <div className="bg-white bg-opacity-25 rounded d-flex justify-content-center align-items-center text-pretty" style={{ width: '112px', height: '40px', padding: '8px' }}></div>
    <div className="bg-white bg-opacity-25 rounded d-flex justify-content-center align-items-center text-pretty" style={{ width: '112px', height: '40px', padding: '8px' }}></div>
    <div className="bg-white bg-opacity-25 rounded d-flex justify-content-center align-items-center text-pretty" style={{ width: '112px', height: '40px', padding: '8px' }}></div>
  </div>
</div>



      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '204px' }}>
        {/* Header */}
        <header className="bg-white shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">Energy Consumption Overview</h1>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Apr 15, 2024 - Apr 21, 2024</span>
              <div className="bg-secondary rounded-circle" style={{ width: '32px', height: '32px' }}></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 bg-light">
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-4 d-flex align-items-center justify-content-between">
              <div className="card">
                <div className="card-body d-flex align-items-center">
                  {/* <OrdersCard orders={1758} change={-2.35} /> */}
                  <h5 className="card-title mb-0">Pending Payment: ${lastTotalAmountCost.toFixed(2)}</h5> 
                </div>
              </div>

              <div className="col-md-3 d-flex justify-content-center align-items-center">
                <Pay />
              </div>
            </div>
          </div>


          {/* Charts */}
          <div className="row g-4">
            {/* Bar Chart */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">Report</h5>
                    {selectedMonth && (
                      <div className="badge bg-white text-dark">
                        {/* <h6 className="card-title mb-0">
                          {selectedMonth} Total Amount: ${selectedRevenue.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </h6> */}
                      </div>
                    )}
                  </div>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calculatedSalesData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar
                          dataKey="sales"
                          onClick={(data, index) => handleBarClick(data, index)}
                          cursor="pointer"
                        >
                          {calculatedSalesData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === selectedBar ? '#3d10e0' : '#94a9ff'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {selectedMonth ? `${selectedMonth} Categories` : '-'}
                  </h5>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <PieTooltip content={<CustomPieTooltip />} />
                        <Legend />
                        <Pie
                          animationBegin={0}
                          animationDuration={200}
                          data={selectedCategories || mockSalesData[0].categoryBreakdown}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(selectedCategories || mockSalesData[0].categoryBreakdown).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                </div>
    
              </div>

            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                  Breakdown Costs
                  </h5>
                  {/* Display breakdown costs */}
                  {selectedMonth && selectedCategories && (
                    <div className="mt-3">
                      <h6>Breakdown Costs:</h6>
                      <small>
                        <ul>
                          {Object.entries(calculatedSalesData[selectedBar].breakdownCosts).map(([key, value]) => (
                            <li key={key}>{capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1'))}: ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</li>
                          ))}
                        </ul>
                      </small>
                      
                    </div>
                  )}


                </div>
              </div>
            </div>

          </div>

        </main>

        <PowerBIReport />

        <S3BucketContent />

      </div>

      {/* <GoToPowerBIButton /> */}

    </div>
  );
}

export default Dashboard;













// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
// import { PieChart, Pie, Tooltip as PieTooltip, Legend } from 'recharts';
// import { OrdersCard } from './OrdersCard.jsx'


// // Generate more detailed mock data with category breakdowns
// const mockSalesData = [
//   { name: 'Jan', sales: 4500 },
//   { name: 'Feb', sales: 5200 },
//   { name: 'Mar', sales: 4800 },
//   { name: 'Apr', sales: 6300 },
//   { name: 'May', sales: 5600 },
//   { name: 'Jun', sales: 7100 },
//   { name: 'Jul', sales: 6800 },
//   { name: 'Aug', sales: 7400 },
//   { name: 'Sep', sales: 8200 },
//   { name: 'Oct', sales: 7900 },
//   { name: 'Nov', sales: 8700 },
//   { name: 'Dec', sales: 9400 },
// ].map((item, index, array) => {
//   // Calculate revenue as 25% of sales
//   const revenue = item.sales * 0.25;
  
//   // Calculate revenue percentage change
//   const previousRevenue = index > 0 ? array[index - 1].sales * 0.25 : revenue;
//   const revenueChange = ((revenue - previousRevenue) / previousRevenue) * 100;

//   // Generate random but proportional category distributions
//   const total = item.sales;
//   const discount = Math.round(total * (0.25 + Math.random() * 0.1));
//   const regular = Math.round(total * (0.3 + Math.random() * 0.1));
//   const shop = Math.round(total * (0.2 + Math.random() * 0.1));
//   const photos = total - discount - regular - shop;

//   return {
//     ...item,
//     revenue,
//     revenueChange: index === 0 ? 0 : revenueChange,
//     categoryBreakdown: [
//       { name: 'Fridge', value: discount, total },
//       { name: 'Air Conditioner', value: regular, total },
//       { name: 'Oven', value: shop, total },
//       { name: 'TV', value: photos, total }
//     ]
//   };
// });

// const COLORS = ['#0d6efd', '#0dcaf0', '#198754', '#ffc107'];

// function Dashboard() {
//   const [selectedBar, setSelectedBar] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedCategories, setSelectedCategories] = useState(null);
//   const [selectedRevenue, setSelectedRevenue] = useState({
//     value: mockSalesData[mockSalesData.length - 1].revenue,
//     change: mockSalesData[mockSalesData.length - 1].revenueChange
//   });

//   const handleBarClick = (data, index) => {
//     setSelectedBar(index);
//     setSelectedMonth(data.name);
//     setSelectedCategories(data.categoryBreakdown);
//     setSelectedRevenue({
//       value: data.revenue,
//       change: data.revenueChange
//     });
//   };

//   // Custom Tooltip Component for Bar Chart
//   const CustomBarTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-2 border rounded shadow">
//           <p className="mb-0"><strong>{payload[0].payload.name}</strong></p>
//           <p className="mb-0">Total Consumption: {payload[0].value.toLocaleString()} kWh</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Custom Tooltip Component for Pie Chart
//   const CustomPieTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const percentage = (payload[0].value / payload[0].payload.total) * 100;
//       return (
//         <div className="bg-white p-2 border rounded shadow">
//           <p className="mb-0"><strong>{payload[0].name}</strong></p>
//           <p className="mb-0">{payload[0].value.toLocaleString()} kWh</p>
//           <p className="mb-0">{percentage.toFixed(1)}%</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="d-flex">
//       {/* Sidebar */}
//       <div className="bg-primary" style={{ width: '64px', height: '100vh', position: 'fixed' }}>
//         <div className="d-flex flex-column align-items-center py-4 gap-3">
//           <div className="bg-white rounded-circle" style={{ width: '32px', height: '32px' }}></div>
//           <div className="bg-white bg-opacity-25 rounded" style={{ width: '32px', height: '32px' }}></div>
//           <div className="bg-white bg-opacity-25 rounded" style={{ width: '32px', height: '32px' }}></div>
//           <div className="bg-white bg-opacity-25 rounded" style={{ width: '32px', height: '32px' }}></div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1" style={{ marginLeft: '64px' }}>
//         {/* Header */}
//         <header className="bg-white shadow-sm p-3">
//           <div className="d-flex justify-content-between align-items-center">
//             <h1 className="h4 mb-0">Energy Consumption Overview</h1>
//             <div className="d-flex align-items-center gap-3">
//               <span className="text-muted">Apr 15, 2024 - Apr 21, 2024</span>
//               <div className="bg-secondary rounded-circle" style={{ width: '32px', height: '32px' }}></div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="p-4 bg-light">
//           {/* Stats Cards */}
//           <div className="row g-4 mb-4">
//             <div className="col-md-4">
//               <OrdersCard orders={1758} change={-2.35} />
//             </div>
//           </div>

//           {/* Charts */}
//           <div className="row g-4">
//             {/* Bar Chart */}
//             <div className="col-md-8">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h5 className="card-title mb-0">Report</h5>
//                     {selectedMonth && (
//                       <div className="badge bg-white text-dark">
//                         <h6 className="card-title mb-0">
//                         {selectedMonth} Total Amount: ${selectedRevenue.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
//                         </h6>
//                       </div>
//                     )}
//                   </div>
//                   <div style={{ height: '300px' }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={mockSalesData}>
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip content={<CustomBarTooltip />} />
//                         <Bar 
//                           dataKey="sales" 
//                           onClick={(data, index) => handleBarClick(data, index)}
//                           cursor="pointer"
//                         >
//                           {mockSalesData.map((entry, index) => (
//                             <Cell
//                               key={`cell-${index}`}
//                               fill={index === selectedBar ? '#3d10e0' : '#94a9ff'}
//                             />
//                           ))}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Pie Chart */}
//             <div className="col-md-4">
//               <div className="card">
//                 <div className="card-body">
//                   <h5 className="card-title">
//                     {selectedMonth ? `${selectedMonth} Categories` : 'Select a month to view categories'}
//                   </h5>
//                   <div style={{ height: '300px' }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <PieTooltip content={<CustomPieTooltip />} />
//                         <Legend />
//                         <Pie
//                           animationBegin={0}
//                           animationDuration={200}
//                           data={selectedCategories || mockSalesData[0].categoryBreakdown}
//                           innerRadius={60}
//                           outerRadius={80}
//                           paddingAngle={5}
//                           dataKey="value"
//                         >
//                           {(selectedCategories || mockSalesData[0].categoryBreakdown).map((entry, index) => (
//                             <Cell 
//                               key={`cell-${index}`} 
//                               fill={COLORS[index % COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;









// Working

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
// import { PieChart, Pie, Tooltip as PieTooltip, Legend } from 'recharts';
// import { OrdersCard } from './OrdersCard.jsx'


// // Generate more detailed mock data with category breakdowns
// const mockSalesData = [
//   { name: 'Jan', sales: 4500 },
//   { name: 'Feb', sales: 5200 },
//   { name: 'Mar', sales: 4800 },
//   { name: 'Apr', sales: 6300 },
//   { name: 'May', sales: 5600 },
//   { name: 'Jun', sales: 7100 },
//   { name: 'Jul', sales: 6800 },
//   { name: 'Aug', sales: 7400 },
//   { name: 'Sep', sales: 8200 },
//   { name: 'Oct', sales: 7900 },
//   { name: 'Nov', sales: 8700 },
//   { name: 'Dec', sales: 9400 },
// ].map((item, index, array) => {
//   // Calculate revenue as 25% of sales
//   const revenue = item.sales * 0.25;
  
//   // Calculate revenue percentage change
//   const previousRevenue = index > 0 ? array[index - 1].sales * 0.25 : revenue;
//   const revenueChange = ((revenue - previousRevenue) / previousRevenue) * 100;

//   // Generate random but proportional category distributions
//   const total = item.sales;
//   const discount = Math.round(total * (0.25 + Math.random() * 0.1));
//   const regular = Math.round(total * (0.3 + Math.random() * 0.1));
//   const shop = Math.round(total * (0.2 + Math.random() * 0.1));
//   const photos = total - discount - regular - shop;

//   return {
//     ...item,
//     revenue,
//     revenueChange: index === 0 ? 0 : revenueChange,
//     categoryBreakdown: [
//       { name: 'Fridge', value: discount, total },
//       { name: 'Air Conditioner', value: regular, total },
//       { name: 'Oven', value: shop, total },
//       { name: 'TV', value: photos, total }
//     ]
//   };
// });

// const COLORS = ['#0d6efd', '#0dcaf0', '#198754', '#ffc107'];

// function Dashboard() {
//   const [selectedBar, setSelectedBar] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedCategories, setSelectedCategories] = useState(null);
//   const [selectedRevenue, setSelectedRevenue] = useState({
//     value: mockSalesData[mockSalesData.length - 1].revenue,
//     change: mockSalesData[mockSalesData.length - 1].revenueChange
//   });

//   const handleBarClick = (data, index) => {
//     setSelectedBar(index);
//     setSelectedMonth(data.name);
//     setSelectedCategories(data.categoryBreakdown);
//     setSelectedRevenue({
//       value: data.revenue,
//       change: data.revenueChange
//     });
//   };

//   // Custom Tooltip Component for Bar Chart
//   const CustomBarTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-2 border rounded shadow">
//           <p className="mb-0"><strong>{payload[0].payload.name}</strong></p>
//           <p className="mb-0">Total Consumption: {payload[0].value.toLocaleString()} kWh</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Custom Tooltip Component for Pie Chart
//   const CustomPieTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const percentage = (payload[0].value / payload[0].payload.total) * 100;
//       return (
//         <div className="bg-white p-2 border rounded shadow">
//           <p className="mb-0"><strong>{payload[0].name}</strong></p>
//           <p className="mb-0">{payload[0].value.toLocaleString()} kWh</p>
//           <p className="mb-0">{percentage.toFixed(1)}%</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="d-flex">
//       {/* Sidebar */}
//       <div className="bg-primary" style={{ width: '64px', height: '100vh', position: 'fixed' }}>
//         <div className="d-flex flex-column align-items-center py-4 gap-3">
//           <div className="bg-white rounded-circle" style={{ width: '32px', height: '32px' }}></div>
//           <div className="bg-white bg-opacity-25 rounded" style={{ width: '32px', height: '32px' }}></div>
//           <div className="bg-white bg-opacity-25 rounded" style={{ width: '32px', height: '32px' }}></div>
//           <div className="bg-white bg-opacity-25 rounded" style={{ width: '32px', height: '32px' }}></div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1" style={{ marginLeft: '64px' }}>
//         {/* Header */}
//         <header className="bg-white shadow-sm p-3">
//           <div className="d-flex justify-content-between align-items-center">
//             <h1 className="h4 mb-0">Energy Consumption Overview</h1>
//             <div className="d-flex align-items-center gap-3">
//               <span className="text-muted">Apr 15, 2024 - Apr 21, 2024</span>
//               <div className="bg-secondary rounded-circle" style={{ width: '32px', height: '32px' }}></div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="p-4 bg-light">
//           {/* Stats Cards */}
//           <div className="row g-4 mb-4">
//             {/* <div className="col-md-4">
//               <div className="card">
//                 <div className="card-body">
//                   <h6 className="card-subtitle mb-2 text-muted">Total Amount</h6>
//                   <h2 className="card-title mb-0">
//                     ${selectedRevenue.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
//                   </h2>
//                   <small className={selectedRevenue.change >= 0 ? "text-success" : "text-danger"}>
//                     {selectedRevenue.change >= 0 ? "+" : ""}{selectedRevenue.change.toFixed(2)}%
//                   </small>
//                 </div>
//               </div>
//             </div> */}
            
//             {/* ... rest of the component remains the same ... */}
//             {/* <div className="col-md-4">
//               <div className="card">
//                 <div className="card-body">
//                   <h6 className="card-subtitle mb-2 text-muted">Orders</h6>
//                   <h2 className="card-title mb-0">1,758</h2>
//                   <small className="text-danger">-2.35%</small>
//                 </div>
//               </div>
//             </div> */}

//             <div className="col-md-4">
//               <OrdersCard orders={1758} change={-2.35} />
//             </div>

//             {/* <div className="col-md-4">
//               <div className="card">
//                 <div className="card-body">
//                   <h6 className="card-subtitle mb-2 text-muted">Purchases</h6>
//                   <h2 className="card-title mb-0">$7,249.31</h2>
//                   <small className="text-success">+5.25%</small>
//                 </div>
//               </div>
//             </div> */}
//           </div>

//           {/* Charts */}
//           <div className="row g-4">
//             {/* Bar Chart */}
//             <div className="col-md-8">
//               <div className="card">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h5 className="card-title mb-0">Report</h5>
//                     {selectedMonth && (
//                       <div className="badge bg-white text-dark">
//                         <h6 className="card-title mb-0">
//                         {selectedMonth} Total Amount: ${selectedRevenue.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
//                         </h6>

                        
//                         {/* ${selectedRevenue.value.toLocaleString(undefined, {maximumFractionDigits: 2})}

//                         <h7 className={selectedRevenue.change >= 0 ? "text-success" : "text-danger"}>
//                         {selectedRevenue.change >= 0 ? "+" : ""}{selectedRevenue.change.toFixed(2)}%
//                         </h7> */}
//                       </div>

//                       // <h2 className="card-title mb-0">
//                       // ${selectedRevenue.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
//                       // </h2>
//                       // <small className={selectedRevenue.change >= 0 ? "text-success" : "text-danger"}>
//                       // {selectedRevenue.change >= 0 ? "+" : ""}{selectedRevenue.change.toFixed(2)}%
//                       // </small>

//                     )}
//                   </div>
//                   <div style={{ height: '300px' }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={mockSalesData}>
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip content={<CustomBarTooltip />} />
//                         <Bar 
//                           dataKey="sales" 
//                           onClick={(data, index) => handleBarClick(data, index)}
//                           cursor="pointer"
//                         >
//                           {mockSalesData.map((entry, index) => (
//                             <Cell
//                               key={`cell-${index}`}
//                               fill={index === selectedBar ? '#3d10e0' : '#94a9ff'}
//                             />
//                           ))}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Pie Chart */}
//             <div className="col-md-4">
//               <div className="card">
//                 <div className="card-body">
//                   <h5 className="card-title">
//                     {selectedMonth ? `${selectedMonth} Categories` : 'Select a month to view categories'}
//                   </h5>
//                   <div style={{ height: '300px' }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <PieTooltip content={<CustomPieTooltip />} />
//                         <Legend />
//                         <Pie
//                           animationBegin={0}
//                           animationDuration={200}
//                           data={selectedCategories || mockSalesData[0].categoryBreakdown}
//                           innerRadius={60}
//                           outerRadius={80}
//                           paddingAngle={5}
//                           dataKey="value"
//                         >
//                           {(selectedCategories || mockSalesData[0].categoryBreakdown).map((entry, index) => (
//                             <Cell 
//                               key={`cell-${index}`} 
//                               fill={COLORS[index % COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

