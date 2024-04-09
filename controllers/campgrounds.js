const Campground = require('../models/campground');

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds} );
}

module.exports.newCampgroundForm = (req,res)=>{
    res.render('campgrounds/new' );
}

module.exports.newCampground = async (req,res,next) => {  
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f=>({url:f.path, filename:f.filename}));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req,res)=>{
    const {id} =req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log('image urls',campground.images[1].url);
    res.render('campgrounds/show', {campground} );
}

module.exports.editCampgroundForm = async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{ campground });
}

module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground!')
    res.redirect('/campgrounds');
}