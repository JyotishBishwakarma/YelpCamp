const express =  require('express');
const router = express.Router({mergeParams: true});
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const {validateReview,isLoggedIn,isAuthor,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,  catchAsync(reviews.deleteReview));

module.exports = router;