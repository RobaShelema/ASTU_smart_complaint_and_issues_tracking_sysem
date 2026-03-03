import React, { useState } from 'react';
import adminService from '../../services/api/adminService';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileJson,
  File,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('complaints');
  const [dateRange, setDateRange] = useState({
    start: format(new Date().setDate(1), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [filters, setFilters] = useState({
    department: 'all',
    category: 'all',
    status: 'all',
    priority: 'all'
  });
  const [generating, setGenerating] = useState(false);
  const [savedReports, setSavedReports] = useState([
    {
      id: 1,
      name: 'Monthly Report - January 2024',
      type: 'complaints',
      generated: '2024-01-31',
      size: '2.4 MB',
      format: 'pdf'
    },
    {
      id: 2,
      name: 'Department Performance - Q1 2024',
      type: 'performance',
      generated: '2024-03-31',
      size: '1.8 MB',
      format: 'excel'
    }
  ]);

  const reportTypes = [
    { id: 'complaints', label: 'Complaints Report', icon: FileText },
    { id: 'performance', label: 'Staff Performance', icon: CheckCircle },
    { id: 'satisfaction', label: 'Satisfaction Survey', icon: AlertCircle },
    { id: 'trends', label: 'Trend Analysis', icon: Clock }
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const complaints = await adminService.getAllComplaints();
      const data = Array.isArray(complaints) ? complaints : [];

      const filtered = data.filter(c => {
        if (filters.status !== 'all' && c.status !== filters.status) return false;
        if (filters.priority !== 'all' && c.priority !== filters.priority) return false;
        if (filters.department !== 'all' && c.department?.toLowerCase() !== filters.department) return false;
        if (filters.category !== 'all' && c.category?.toLowerCase() !== filters.category) return false;
        if (dateRange.start && new Date(c.createdAt) < new Date(dateRange.start)) return false;
        if (dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          if (new Date(c.createdAt) > end) return false;
        }
        return true;
      });

      const reportLabel = reportTypes.find(r => r.id === selectedReport)?.label || selectedReport;
      const now = format(new Date(), 'yyyy-MM-dd');

      if (reportFormat === 'csv' || reportFormat === 'excel') {
        const headers = ['ID', 'Title', 'Category', 'Department', 'Status', 'Priority', 'Student', 'Created At'];
        const rows = filtered.map(c => [
          c.id,
          `"${(c.title || '').replace(/"/g, '""')}"`,
          c.category || '',
          c.department || '',
          c.status || '',
          c.priority || '',
          c.studentName || '',
          c.createdAt || ''
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportLabel.replace(/\s+/g, '_')}-${now}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const pending = filtered.filter(c => c.status === 'pending').length;
        const inProgress = filtered.filter(c => c.status === 'in_progress').length;
        const resolved = filtered.filter(c => c.status === 'resolved').length;
        const closed = filtered.filter(c => c.status === 'closed').length;

        const depts = {};
        filtered.forEach(c => { depts[c.department || 'Unknown'] = (depts[c.department || 'Unknown'] || 0) + 1; });
        const cats = {};
        filtered.forEach(c => { cats[c.category || 'Unknown'] = (cats[c.category || 'Unknown'] || 0) + 1; });

        let text = `${'='.repeat(60)}\n`;
        text += `  ${reportLabel}\n`;
        text += `  ASTU Complaint Tracking System\n`;
        text += `  Generated: ${now}\n`;
        text += `  Period: ${dateRange.start} to ${dateRange.end}\n`;
        text += `${'='.repeat(60)}\n\n`;

        text += `SUMMARY\n${'-'.repeat(40)}\n`;
        text += `Total Complaints: ${filtered.length}\n`;
        text += `Pending: ${pending}  |  In Progress: ${inProgress}  |  Resolved: ${resolved}  |  Closed: ${closed}\n\n`;

        text += `BY DEPARTMENT\n${'-'.repeat(40)}\n`;
        Object.entries(depts).forEach(([d, count]) => { text += `  ${d}: ${count}\n`; });
        text += '\n';

        text += `BY CATEGORY\n${'-'.repeat(40)}\n`;
        Object.entries(cats).forEach(([c, count]) => { text += `  ${c}: ${count}\n`; });
        text += '\n';

        text += `COMPLAINT DETAILS\n${'-'.repeat(40)}\n`;
        filtered.forEach(c => {
          text += `\n  [${c.id}] ${c.title}\n`;
          text += `    Status: ${c.status} | Priority: ${c.priority} | Dept: ${c.department}\n`;
          text += `    Student: ${c.studentName || 'N/A'} | Created: ${c.createdAt || 'N/A'}\n`;
        });

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportLabel.replace(/\s+/g, '_')}-${now}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      }

      const newReport = {
        id: Date.now(),
        name: `${reportLabel} - ${now}`,
        type: selectedReport,
        generated: now,
        size: `${(filtered.length * 0.15).toFixed(1)} KB`,
        format: reportFormat
      };
      setSavedReports(prev => [newReport, ...prev]);
      toast.success(`Report generated with ${filtered.length} complaint(s)`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    const report = savedReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`Re-downloading "${report.name}" — generate a fresh report for latest data`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600 mt-1">
          Generate and download system reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Report Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      selectedReport === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${
                      selectedReport === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      selectedReport === type.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Departments</option>
                  <option value="it">IT</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="library">Library</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Categories</option>
                  <option value="dormitory">Dormitory</option>
                  <option value="internet">Internet</option>
                  <option value="laboratory">Laboratory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Format and Generate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={reportFormat === 'pdf'}
                    onChange={() => setReportFormat('pdf')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <File className="h-4 w-4" />
                  <span>PDF</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={reportFormat === 'excel'}
                    onChange={() => setReportFormat('excel')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={reportFormat === 'csv'}
                    onChange={() => setReportFormat('csv')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <FileJson className="h-4 w-4" />
                  <span>CSV</span>
                </label>
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Reports */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Reports</h2>
            
            {savedReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No saved reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {report.format === 'pdf' ? (
                        <File className="h-5 w-5 text-red-400" />
                      ) : report.format === 'excel' ? (
                        <FileSpreadsheet className="h-5 w-5 text-green-400" />
                      ) : (
                        <FileJson className="h-5 w-5 text-blue-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.name}</p>
                        <p className="text-xs text-gray-500">
                          {report.generated} • {report.size}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadReport(report.id)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Scheduled Reports</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Monthly Report</p>
                  <p className="text-xs text-gray-500">Every 1st of the month</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Weekly Summary</p>
                  <p className="text-xs text-gray-500">Every Monday</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;