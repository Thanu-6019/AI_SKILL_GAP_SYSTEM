import { 
  UserCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge } from '../components/ui';

const Settings = () => {
  const settingsCategories = [
    {
      title: 'Profile Settings',
      icon: UserCircleIcon,
      description: 'Manage your personal information',
      items: [
        { label: 'Full Name', value: 'John Doe' },
        { label: 'Email', value: 'john.doe@example.com' },
        { label: 'Job Title', value: 'Software Engineer' },
        { label: 'Department', value: 'Engineering' },
      ],
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      description: 'Configure notification preferences',
      items: [
        { label: 'Email Notifications', value: 'Enabled', status: 'success' },
        { label: 'Push Notifications', value: 'Enabled', status: 'success' },
        { label: 'Weekly Reports', value: 'Enabled', status: 'success' },
        { label: 'Skill Reminders', value: 'Disabled', status: 'neutral' },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      description: 'Manage your account security',
      items: [
        { label: 'Two-Factor Auth', value: 'Enabled', status: 'success' },
        { label: 'Password', value: 'Last changed 30 days ago' },
        { label: 'Active Sessions', value: '3 devices' },
        { label: 'Data Export', value: 'Request available' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and settings</p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-6">
        {settingsCategories.map((category, index) => (
          <Card 
            key={index}
            title={category.title}
            subtitle={category.description}
            icon={category.icon}
          >
            <div className="space-y-4 mt-4">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <div>
                    <p className="text-slate-200 font-medium">{item.label}</p>
                    <p className="text-sm text-slate-500 mt-1">{item.value}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {item.status && (
                      <Badge variant={item.status} size="sm">
                        {item.value}
                      </Badge>
                    )}
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Appearance" icon={PaintBrushIcon}>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
              <div>
                <p className="text-slate-200 font-medium">Theme</p>
                <p className="text-sm text-slate-500 mt-1">Dark mode enabled</p>
              </div>
              <Badge variant="primary" size="sm">Dark</Badge>
            </div>
          </div>
        </Card>

        <Card title="Language & Region" icon={GlobeAltIcon}>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
              <div>
                <p className="text-slate-200 font-medium">Language</p>
                <p className="text-sm text-slate-500 mt-1">English (US)</p>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Change
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card title="Danger Zone" className="border-red-500/20">
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div>
              <p className="text-red-400 font-medium">Delete Account</p>
              <p className="text-sm text-slate-500 mt-1">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm">Delete</Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
