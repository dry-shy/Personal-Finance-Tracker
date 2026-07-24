import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EmptyChart = () => (
  <div className="empty-chart-container" >
    {/* Animated ghost pie chart */}
    <div className="empty-chart-visual">
      <svg viewBox="0 0 120 120" className="ghost-donut" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring segments (ghost slices) */}
        <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="22" />
        <circle
          cx="30" cy="30" r="15"
          fill="none"
          stroke="rgba(123,44,191,0.25)"
          strokeWidth="22"
          strokeDasharray="85 197"
          strokeDashoffset="0"
          strokeLinecap="round"
        />
        <circle
          cx="30" cy="30" r="15"
          fill="none"
          stroke="rgba(241,91,181,0.2)"
          strokeWidth="22"
          strokeDasharray="55 197"
          strokeDashoffset="-85"
          strokeLinecap="round"
        />
        <circle
          cx="30" cy="30" r="15"
          fill="none"
          stroke="rgba(0,245,212,0.15)"
          strokeWidth="22"
          strokeDasharray="40 197"
          strokeDashoffset="-140"
          strokeLinecap="round"
        />
        {/* Center hole */}
        <circle cx="30" cy="30" r="14" fill="#0d0b14" />
        {/* Center icon */}
        <text x="30" y="30" textAnchor="middle" fontSize="20" fill="rgba(255,255,255,0.15)">₹</text>
      </svg>

      {/* Floating dots animation */}
      <div className="float-dot dot-1" />
      <div className="float-dot dot-2" />
      <div className="float-dot dot-3" />
    </div>

    <div className="empty-chart-text">
      <h3>Nothing to visualize yet</h3>
      <p>Add your first expense transaction on the<br />Dashboard to see your spending breakdown here.</p>

      <div className="empty-chart-tips">
        <div className="tip-item">
          <span className="tip-dot" style={{ background: 'rgba(241,91,181,0.8)' }} />
          <span>Groceries</span>
        </div>
        <div className="tip-item">
          <span className="tip-dot" style={{ background: 'rgba(123,44,191,0.8)' }} />
          <span>Rent</span>
        </div>
        <div className="tip-item">
          <span className="tip-dot" style={{ background: 'rgba(0,245,212,0.8)' }} />
          <span>Utilities</span>
        </div>
      </div>
    </div>
  </div>
);

const Charts = ({ transactions }) => {
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  const data = {
    labels: expenseTransactions.map(t => t.text),
    datasets: [
      {
        label: 'Expenses',
        data: expenseTransactions.map(t => Math.abs(t.amount)),
        backgroundColor: [
          'rgba(241, 91, 181, 0.7)',
          'rgba(123, 44, 191, 0.7)',
          'rgba(0, 245, 212, 0.7)',
          'rgba(254, 217, 183, 0.7)',
          'rgba(0, 187, 249, 0.7)',
          'rgba(255, 200, 100, 0.7)',
        ],
        borderColor: [
          'rgba(241, 91, 181, 1)',
          'rgba(123, 44, 191, 1)',
          'rgba(0, 245, 212, 1)',
          'rgba(254, 217, 183, 1)',
          'rgba(0, 187, 249, 1)',
          'rgba(255, 200, 100, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f0edf5',
          padding: 10,
          font: { family: 'Inter', size: 9 },
          usePointStyle: true,
          pointStyleWidth: 10,
        }
      },
      title: {
        display: true,
        text: 'Expense Breakdown',
        color: '#9a94a8',
        font: { size: 14, family: 'Inter', weight: '100' },
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: 'rgba(13,11,20,0.95)',
        titleColor: '#f0edf5',
        bodyColor: '#9a94a8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toFixed(2)}`,
        },
      },
    },
  };

  if (expenseTransactions.length === 0) {
    return <EmptyChart />;
  }

  return (
    <div className="charts-container">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default Charts;
