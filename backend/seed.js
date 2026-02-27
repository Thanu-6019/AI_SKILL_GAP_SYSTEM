import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobRole from './models/JobRole.model.js';
import connectDB from './config/database.js';

dotenv.config();

const jobRoles = [
  {
    title: 'Frontend Developer',
    category: 'Web Development',
    description: 'Build user interfaces and client-side applications using modern frameworks',
    requiredSkills: [
      { name: 'React', level: 85, importance: 'Critical' },
      { name: 'JavaScript', level: 90, importance: 'Critical' },
      { name: 'HTML', level: 85, importance: 'Critical' },
      { name: 'CSS', level: 85, importance: 'Critical' },
      { name: 'TypeScript', level: 75, importance: 'Important' },
      { name: 'Redux', level: 70, importance: 'Important' },
      { name: 'Webpack', level: 60, importance: 'Nice to Have' },
    ],
    salaryRange: { min: 70000, max: 110000, currency: 'USD' },
    experienceRequired: { min: 2, max: 5 },
    demandLevel: 'Very High',
    growthRate: 22,
    averageCompanies: 450,
    relatedRoles: ['Full Stack Developer', 'UI Developer', 'React Developer'],
  },
  {
    title: 'Full Stack Developer',
    category: 'Web Development',
    description: 'Develop both frontend and backend components of web applications',
    requiredSkills: [
      { name: 'React', level: 80, importance: 'Critical' },
      { name: 'Node.js', level: 85, importance: 'Critical' },
      { name: 'JavaScript', level: 90, importance: 'Critical' },
      { name: 'MongoDB', level: 75, importance: 'Important' },
      { name: 'Express', level: 80, importance: 'Important' },
      { name: 'REST APIs', level: 85, importance: 'Critical' },
      { name: 'Git', level: 75, importance: 'Important' },
      { name: 'Docker', level: 65, importance: 'Nice to Have' },
    ],
    salaryRange: { min: 85000, max: 130000, currency: 'USD' },
    experienceRequired: { min: 3, max: 6 },
    demandLevel: 'Very High',
    growthRate: 28,
    averageCompanies: 520,
    relatedRoles: ['Backend Developer', 'Frontend Developer', 'Software Engineer'],
  },
  {
    title: 'Backend Developer',
    category: 'Web Development',
    description: 'Build server-side logic, APIs, and database management',
    requiredSkills: [
      { name: 'Node.js', level: 85, importance: 'Critical' },
      { name: 'Python', level: 80, importance: 'Important' },
      { name: 'MongoDB', level: 80, importance: 'Critical' },
      { name: 'PostgreSQL', level: 75, importance: 'Important' },
      { name: 'REST APIs', level: 90, importance: 'Critical' },
      { name: 'GraphQL', level: 70, importance: 'Nice to Have' },
      { name: 'Docker', level: 70, importance: 'Important' },
      { name: 'AWS', level: 65, importance: 'Important' },
    ],
    salaryRange: { min: 80000, max: 125000, currency: 'USD' },
    experienceRequired: { min: 2, max: 5 },
    demandLevel: 'Very High',
    growthRate: 25,
    averageCompanies: 480,
    relatedRoles: ['Full Stack Developer', 'DevOps Engineer', 'Software Engineer'],
  },
  {
    title: 'DevOps Engineer',
    category: 'Infrastructure',
    description: 'Manage deployment pipelines, infrastructure, and automation',
    requiredSkills: [
      { name: 'Docker', level: 85, importance: 'Critical' },
      { name: 'Kubernetes', level: 80, importance: 'Critical' },
      { name: 'Jenkins', level: 75, importance: 'Important' },
      { name: 'AWS', level: 85, importance: 'Critical' },
      { name: 'Linux', level: 80, importance: 'Critical' },
      { name: 'Terraform', level: 70, importance: 'Important' },
      { name: 'Git', level: 80, importance: 'Important' },
      { name: 'Python', level: 70, importance: 'Nice to Have' },
    ],
    salaryRange: { min: 90000, max: 140000, currency: 'USD' },
    experienceRequired: { min: 3, max: 7 },
    demandLevel: 'Very High',
    growthRate: 32,
    averageCompanies: 410,
    relatedRoles: ['Cloud Engineer', 'Site Reliability Engineer', 'Backend Developer'],
  },
  {
    title: 'Data Scientist',
    category: 'Data Science',
    description: 'Analyze data, build ML models, and derive insights',
    requiredSkills: [
      { name: 'Python', level: 90, importance: 'Critical' },
      { name: 'Machine Learning', level: 85, importance: 'Critical' },
      { name: 'Statistics', level: 85, importance: 'Critical' },
      { name: 'SQL', level: 80, importance: 'Important' },
      { name: 'TensorFlow', level: 75, importance: 'Important' },
      { name: 'Pandas', level: 85, importance: 'Important' },
      { name: 'Data Visualization', level: 75, importance: 'Important' },
    ],
    salaryRange: { min: 95000, max: 145000, currency: 'USD' },
    experienceRequired: { min: 2, max: 6 },
    demandLevel: 'Very High',
    growthRate: 35,
    averageCompanies: 380,
    relatedRoles: ['ML Engineer', 'Data Analyst', 'AI Engineer'],
  },
  {
    title: 'Mobile Developer',
    category: 'Mobile Development',
    description: 'Build native or cross-platform mobile applications',
    requiredSkills: [
      { name: 'React Native', level: 80, importance: 'Critical' },
      { name: 'JavaScript', level: 85, importance: 'Critical' },
      { name: 'iOS Development', level: 75, importance: 'Important' },
      { name: 'Android Development', level: 75, importance: 'Important' },
      { name: 'Redux', level: 70, importance: 'Important' },
      { name: 'Git', level: 75, importance: 'Important' },
    ],
    salaryRange: { min: 80000, max: 125000, currency: 'USD' },
    experienceRequired: { min: 2, max: 5 },
    demandLevel: 'High',
    growthRate: 20,
    averageCompanies: 350,
    relatedRoles: ['Frontend Developer', 'Full Stack Developer', 'iOS Developer'],
  },
  {
    title: 'UI/UX Designer',
    category: 'Design',
    description: 'Design user interfaces and user experiences',
    requiredSkills: [
      { name: 'Figma', level: 85, importance: 'Critical' },
      { name: 'Adobe XD', level: 75, importance: 'Important' },
      { name: 'User Research', level: 80, importance: 'Critical' },
      { name: 'Prototyping', level: 80, importance: 'Critical' },
      { name: 'HTML', level: 60, importance: 'Nice to Have' },
      { name: 'CSS', level: 60, importance: 'Nice to Have' },
      { name: 'Design Systems', level: 75, importance: 'Important' },
    ],
    salaryRange: { min: 70000, max: 115000, currency: 'USD' },
    experienceRequired: { min: 2, max: 5 },
    demandLevel: 'High',
    growthRate: 18,
    averageCompanies: 420,
    relatedRoles: ['Product Designer', 'Visual Designer', 'Frontend Developer'],
  },
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();

    // Clear existing roles
    await JobRole.deleteMany({});
    console.log('✅ Cleared existing job roles');

    // Insert new roles
    await JobRole.insertMany(jobRoles);
    console.log(`✅ Inserted ${jobRoles.length} job roles`);

    console.log('\n🎉 Database seeded successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
