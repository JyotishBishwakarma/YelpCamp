const express =  require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const multer=require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage})

router.get('/',catchAsync(campgrounds.index))

router.get('/new',isLoggedIn, campgrounds.newCampgroundForm);

router.post('/', isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.newCampground))
// router.post('/',upload.array('image'),(req,res)=>{
//     console.log('uploading image');
//     console.log(req.body, req.files);
//     res.send('IT worked!')
// })

router.get('/:id',catchAsync(campgrounds.showCampground))

router.get('/:id/edit',isLoggedIn, isAuthor , catchAsync(campgrounds.editCampgroundForm))

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id',isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;
