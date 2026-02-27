import { AcademicCapIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Button } from '../components/ui';

const Skills = () => {
  const skills = [
    { 
      id: 1, 
      name: 'React', 
      category: 'Frontend', 
      current: 75, 
      required: 90, 
      status: 'learning',
      lastUpdated: '2 days ago' 
    },
    { 
      id: 2, 
      name: 'TypeScript', 
      category: 'Language', 
      current: 60, 
      required: 85, 
      status: 'learning',
      lastUpdated: '5 days ago' 
    },
    { 
      id: 3, 
      name: 'Node.js', 
      category: 'Backend', 
      current: 70, 
      required: 80, 
      status: 'improving',
      lastUpdated: '1 week ago' 
    },
    { 
      id: 4, 
      name: 'Python', 
      category: 'Language', 
      current: 50, 
      required: 80, 
      status: 'beginner',
      lastUpdated: '3 days ago' 
    },
    { 
      id: 5, 
      name: 'AWS', 
      category: 'Cloud', 
      current: 40, 
      required: 75, 
      status: 'beginner',
      lastUpdated: '1 day ago' 
    },
    { 
      id: 6, 
      name: 'Docker', 
      category: 'DevOps', 
      current: 65, 
      required: 85, 
      status: 'learning',
      lastUpdated: '4 days ago' 
    },
  ];

  const getStatusVariant = (status) => {
    const variants = {
      learning: 'primary',
      improving: 'warning',
      beginner: 'danger',
      proficient: 'success',
    };
    return variants[status] || 'neutral';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-transparent p-6 rounded-2xl border border-slate-700/30">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Skills</h1>
          <p className="text-slate-400 text-lg">Track and manage your skill development</p>
        </div>
        <Button icon={PlusIcon} className="shadow-xl shadow-blue-500/20">Add New Skill</Button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id} hoverable className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="space-y-4 relative z-10">
              {/* Skill Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{skill.name}</h3>
                  <p className="text-sm text-slate-400">{skill.category}</p>
                </div>
                <Badge variant={getStatusVariant(skill.status)} size="sm" className="group-hover:scale-110 transition-transform">
                  {skill.status}
                </Badge>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Current Level</span>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{skill.current}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-600">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/50"
                      style={{ width: `${skill.current}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Required Level</span>
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">{skill.required}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-600">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-500/50"
                      style={{ width: `${skill.required}%` }}
                    />
                  </div>
                </div>

                {/* Gap Indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400 font-medium">Gap</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    skill.required - skill.current <= 10 ? 'text-green-400 bg-green-500/10' : 
                    skill.required - skill.current <= 25 ? 'text-amber-400 bg-amber-500/10' : 
                    'text-red-400 bg-red-500/10'
                  }`}>
                    {skill.required - skill.current}%
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">Updated {skill.lastUpdated}</span>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors flex items-center space-x-1 group">
                  <span>View Details</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Skills;
