import React, { useState } from 'react';
import { adminService } from '../../services/api/adminService';
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
  const [format, setFormat] = useState('pdf');
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
      await adminService.generateReport({
        type: selectedReport,
        dateRange,
        format,
        filters
      });
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      await adminService.exportReport('pdf', { reportId });
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to download report');
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
                    checked={format === 'pdf'}
                    onChange={() => setFormat('pdf')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <File className="h-4 w-4" />
                  <span>PDF</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={format === 'excel'}
                    onChange={() => setFormat('excel')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={format === 'csv'}
                    onChange={() => setFormat('csv')}
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