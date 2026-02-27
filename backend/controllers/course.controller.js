// Mock course data - In production, this could fetch from external APIs like Udemy, Coursera, etc.
const courses = [
  {
    id: 'course-1',
    title: 'Complete Web Development Bootcamp',
    provider: 'Udemy',
    rating: 4.8,
    students: 125000,
    price: '$49.99',
    duration: '40 hours',
    level: 'Beginner',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    description: 'Learn web development from scratch',
    url: 'https://www.udemy.com/course/example',
  },
  // Add more courses as needed
];

// @desc    Get course recommendations
// @route   GET /api/courses/recommendations
// @access  Public
export const getCourseRecommendations = async (req, res, next) => {
  try {
    const { skills, level = 'all' } = req.query;

    let filteredCourses = courses;

    // Filter by skills if provided
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
      filteredCourses = courses.filter(course =>
        course.skills.some(s => 
          skillArray.includes(s.toLowerCase())
        )
      );
    }

    // Filter by level if provided
    if (level !== 'all') {
      filteredCourses = filteredCourses.filter(
        course => course.level.toLowerCase() === level.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: filteredCourses.length,
      data: filteredCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = courses.find(c => c.id === req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search courses
// @route   GET /api/courses/search?q=keyword
// @access  Public
export const searchCourses = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const searchTerm = q.toLowerCase();
    const results = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.skills.some(s => s.toLowerCase().includes(searchTerm)) ||
      course.description.toLowerCase().includes(searchTerm)
    );

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
