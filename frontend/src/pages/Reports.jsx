import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { getMonthlySummary, getSummary, resetReportState } from '../redux/reportSlice';
import { getTransactions } from '../redux/transactionSlice';
import { numberWithCommas } from '../utils/format';
import { DollarSign, Activity, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Tooltip, Legend, Title, Filler
);

// CSV export helper
const exportToCSV = (transactions) => {
  if (!transactions.length) return;
  const headers = ['Description', 'Amount', 'Type', 'Date'];
  const rows = transactions.map(t => [
    `"${t.text}"`,
    Math.abs(t.amount).toFixed(2),
    t.amount > 0 ? 'Income' : 'Expense',
    new Date(t.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finance_report_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#f0edf5', font: { family: 'Inter', size: 12 } } },
    title: { display: false },
    tooltip: {
      backgroundColor: 'rgba(13,11,20,0.95)',
      titleColor: '#f0edf5',
      bodyColor: '#9a94a8',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      callbacks: { label: (ctx) => ` ₹${numberWithCommas(ctx.parsed.y?.toFixed(2) ?? ctx.parsed.toFixed(2))}` },
    },
  },
  scales: {
    x: { ticks: { color: '#9a94a8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#9a94a8', callback: (v) => `₹${v}` }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

const Reports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { monthlySummary, summary, isLoading } = useSelector((state) => state.reports);
  const { transactions } = useSelector((state) => state.transactions);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(getMonthlySummary());
    dispatch(getSummary());
    dispatch(getTransactions());
    return () => { dispatch(resetReportState()); };
  }, [user, navigate, dispatch]);

  if (isLoading || !summary) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Generating your report...</p>
      </div>
    );
  }

  // Bar chart: Income vs Expense per month
  const barData = {
    labels: monthlySummary.map(m => m.month),
    datasets: [
      {
        label: 'Income',
        data: monthlySummary.map(m => m.income),
        backgroundColor: 'rgba(0, 245, 212, 0.6)',
        borderColor: 'rgba(0, 245, 212, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Expense',
        data: monthlySummary.map(m => m.expense),
        backgroundColor: 'rgba(241, 91, 181, 0.6)',
        borderColor: 'rgba(241, 91, 181, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Line chart: Net balance over time
  const lineData = {
    labels: monthlySummary.map(m => m.month),
    datasets: [
      {
        label: 'Net Balance',
        data: monthlySummary.map(m => m.net),
        borderColor: 'rgba(123, 44, 191, 1)',
        backgroundColor: 'rgba(123, 44, 191, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(123, 44, 191, 1)',
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Doughnut chart: top expenses
  const topExpenses = [...transactions]
    .filter(t => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 6);

  const doughnutData = {
    labels: topExpenses.map(t => t.text),
    datasets: [{
      data: topExpenses.map(t => Math.abs(t.amount)),
      backgroundColor: [
        'rgba(241,91,181,0.7)', 'rgba(123,44,191,0.7)', 'rgba(0,245,212,0.7)',
        'rgba(254,217,183,0.7)', 'rgba(0,187,249,0.7)', 'rgba(255,200,100,0.7)',
      ],
      borderColor: [
        '#f15bb5', '#7b2cbf', '#00f5d4', '#fed9b7', '#00bbf9', '#ffc864',
      ],
      borderWidth: 1,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { color: '#f0edf5', font: { size: 12 } } },
      tooltip: {
        callbacks: { label: (ctx) => ` ₹${numberWithCommas(ctx.parsed.toFixed(2))}` },
      },
    },
  };

  const statCards = [
    { label: 'Net Balance', value: summary.netBalance, color: summary.netBalance >= 0 ? 'var(--success-color)' : 'var(--danger-color)', icon: <DollarSign size={22} /> },
    { label: 'Total Transactions', value: summary.totalTransactions, color: '#7b2cbf', icon: <Activity size={22} />, noFormat: true },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Financial Reports</h1>
          <p>Your complete financial picture at a glance</p>
        </div>
        <button className="btn-export" onClick={() => exportToCSV(transactions)}>
          <Download size={16} /> Export CSV
        </button>
      </header>

      {/* Summary Stat Cards */}
      <div className="report-stat-cards">
        {statCards.map((s, i) => (
          <div className="report-stat-card card" key={i}>
            <div className="report-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div>
              <p className="report-stat-label">{s.label}</p>
              <h2 className="report-stat-value" style={{ color: s.color }}>
                {s.noFormat
                  ? s.value
                  : `${s.prefix || ''}₹${numberWithCommas(Math.abs(s.value).toFixed(2))}`}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      {(summary.largestIncome || summary.largestExpense) && (
        <div className="report-highlights">
          {summary.largestIncome && (
            <div className="card highlight-card">
              <ArrowUpRight size={20} color="var(--success-color)" />
              <div>
                <p className="report-stat-label">Largest Income</p>
                <p className="highlight-text">{summary.largestIncome.text}</p>
                <h3 style={{ color: 'var(--success-color)' }}>+₹{numberWithCommas(summary.largestIncome.amount.toFixed(2))}</h3>
              </div>
            </div>
          )}
          {summary.largestExpense && (
            <div className="card highlight-card">
              <ArrowDownRight size={20} color="var(--danger-color)" />
              <div>
                <p className="report-stat-label">Largest Expense</p>
                <p className="highlight-text">{summary.largestExpense.text}</p>
                <h3 style={{ color: 'var(--danger-color)' }}>-₹{numberWithCommas(Math.abs(summary.largestExpense.amount).toFixed(2))}</h3>
              </div>
            </div>
          )}
          <div className="card highlight-card">
            <Activity size={20} color="#7b2cbf" />
            <div>
              <p className="report-stat-label">Avg Transaction</p>
              <h3 style={{ color: summary.avgTransaction >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                ₹{numberWithCommas(Math.abs(summary.avgTransaction).toFixed(2))}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {monthlySummary.length > 0 ? (
        <>
          <div className="report-charts-grid">
            <div className="card chart-card">
              <h3>Monthly Income vs Expense</h3>
              <Bar data={barData} options={chartOptions} />
            </div>
            <div className="card chart-card">
              <h3>Net Balance Over Time</h3>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {topExpenses.length > 0 && (
            <div className="card chart-card chart-card--full">
              <h3>Top Expense Breakdown</h3>
              <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <Activity size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>No transaction data yet. Add some transactions on the Dashboard to generate reports!</p>
        </div>
      )}

      {/* Monthly Summary Table */}
      {monthlySummary.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Monthly Breakdown</h3>
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlySummary].reverse().map((m, i) => (
                  <tr key={i}>
                    <td>{m.month}</td>
                    <td style={{ color: 'var(--success-color)' }}>+₹{numberWithCommas(m.income.toFixed(2))}</td>
                    <td style={{ color: 'var(--danger-color)' }}>-₹{numberWithCommas(m.expense.toFixed(2))}</td>
                    <td style={{ color: m.net >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: '600' }}>
                      {m.net >= 0 ? '+' : '-'}₹{numberWithCommas(Math.abs(m.net).toFixed(2))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
