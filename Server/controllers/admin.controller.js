import User from '../models/usermodel.js';
import Course from '../models/course.model.js';
import Project from '../models/project.model.js';
import TestResult from '../models/testResult.model.js';
import AppError from '../utils/error.util.js';

const getAggregatedUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password -forgotPasswordToken -forgotPasswordExpiry');
        const projects = await Project.find().populate('courseId', 'title');
        const testResults = await TestResult.find().populate('test', 'courseId');

        const aggregatedUsers = users.map(user => {
            const userProjects = projects.filter(p => p.userId.toString() === user._id.toString());
            const userTestResults = testResults.filter(tr => tr.user.toString() === user._id.toString());

            const courses = {};

            userProjects.forEach(p => {
                if (!courses[p.courseId._id]) {
                    courses[p.courseId._id] = { 
                        title: p.courseId.title,
                        project: {
                            link: p.projectLink,
                            file: p.projectFile,
                            submittedAt: p.submittedAt
                        }
                    };
                }
            });

            userTestResults.forEach(tr => {
                const courseId = tr.test.courseId.toString();
                if (!courses[courseId]) {
                    courses[courseId] = { title: '', project: {} }; // Placeholder if no project
                }
                if (!courses[courseId].testResults) {
                    courses[courseId].testResults = [];
                }
                courses[courseId].testResults.push({
                    score: tr.score,
                    totalMarks: tr.totalMarks,
                    submittedAt: tr.createdAt
                });
            });

            return {
                ...user.toObject(),
                courses: Object.values(courses)
            };
        });

        res.status(200).json({
            success: true,
            message: 'Aggregated user data',
            users: aggregatedUsers
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

export {
    getAggregatedUsers
};