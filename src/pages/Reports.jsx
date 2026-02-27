import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Button } from '../components/ui';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Monthly Skill Progress Report',
      period: 'January 2026',
      generatedDate: 'Feb 1, 2026',
      type: 'Progress',
      status: 'Ready',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Quarterly Gap Analysis',
      period: 'Q4 2025',
      generatedDate: 'Jan 5, 2026',
      type: 'Analysis',
      status: 'Ready',
      size: '3.1 MB',
    },
    {
      id: 3,
      title: 'Skills Assessment Report',
      period: 'December 2025',
      generatedDate: 'Dec 31, 2025',
      type: 'Assessment',
      status: 'Ready',
      size: '1.8 MB',
    },
    {
      id: 4,
      title: 'Learning Path Recommendations',
      period: 'February 2026',
      generatedDate: 'Feb 15, 2026',
      type: 'Recommendations',
      status: 'Processing',
      size: '-',
    },
  ];

  const insights = [
    {
      title: 'Most Improved Skill',
      value: 'React',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Fastest Learning',
      value: 'Docker',
      change: '12 days',
      trend: 'up',
    },
    {
      title: 'Courses Completed',
      value: '8',
      change: 'This month',
      trend: 'neutral',
    },
    {
      title: 'Total Study Time',
      value: '42h',
      change: '+8h vs last month',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-slate-400">Download and analyze your progress reports</p>
        </div>
        <Button icon={DocumentTextIcon}>Generate New Report</Button>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index}>
            <p className="text-slate-400 text-sm mb-1">{insight.title}</p>
            <h3 className="text-2xl font-bold text-white mb-2">{insight.value}</h3>
            <p className="text-sm text-slate-500">{insight.change}</p>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card title="Available Reports" subtitle="Download your skill reports">
        <div className="space-y-4 mt-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-all border border-slate-700 hover:border-slate-600"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">{report.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>{report.period}</span>
                    <span>•</span>
                    <span>Generated: {report.generatedDate}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="primary" size="sm">{report.type}</Badge>
                    <Badge 
                      variant={report.status === 'Ready' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {report.status === 'Ready' && (
                <Button variant="secondary" size="sm" icon={ArrowDownTrayIcon}>
                  Download
                </Button>
              )}
              {report.status === 'Processing' && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-amber-400">Processing</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Report Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Progress Reports" hoverable>
          <p className="text-slate-400 text-sm mt-2">
            Track your skill development over time with detailed charts and metrics.
          </p>
        </Card>
        <Card title="Gap Analysis" hoverable>
          <p className="text-slate-400 text-sm mt-2">
            Identify areas for improvement and get personalized recommendations.
          </p>
        </Card>
        <Card title="Assessments" hoverable>
          <p className="text-slate-400 text-sm mt-2">
            View results from skill tests and certification attempts.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
