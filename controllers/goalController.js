const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel');
const User = require('../models/userModel')

// @desc GET goals
// @route GET /api/goals
// @access Private
const getGoal = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })
    res.status(200).json(goals);
})

// @desc Set goals
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    // console.log(req.body);
    if (!req.body.text) {
        res.status(400).json({ message: 'Please add a text field' });
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal);
})

// @desc Update goals
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

if (!req.user) {
    res.status(401)
    throw new Error('user not found')
}
// make sure the logged in user matches the goal user
if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
}

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,
        { new: true }
    )
    res.status(200).json(updatedGoal);

})
// @desc delete goals
// @route DELETE /api/goals
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error('user not found')
    }
    // make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
   
    await Goal.findByIdAndDelete(req.params.id,()=>{
        console.log('goal deleted')
    });
    res.status(200).json({
        id: req.params.id,
        message: 'goal deleted successfully'
    });
})
module.exports = {
    getGoal,
    setGoal,
    updateGoal,
    deleteGoal
}