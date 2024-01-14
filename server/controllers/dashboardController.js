const Movie = require('../models/Movies.js');
const mongoose = require('mongoose');

// GET Dashboard
exports.dashboard = async (req, res) => {  
    let perPage = 12;
    let page = req.query.page || 1;
    const locals = {
        title: "Dashboard",
        description: "Movie Journal-Planner App"
    };

    try {
        const movies = await Movie.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) }},
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] }
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage);

        const count = await Movie.countDocuments({ user: new mongoose.Types.ObjectId(req.user.id) });

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            movies,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// View specific movie
exports.dashboardViewMovie = async (req, res) => {
    try {
        const movie = await Movie.findOne({ _id: req.params.id, user: req.user.id }).lean();

        if (movie) {
            res.render('dashboard/view-movie', {
                movieID: req.params.id,
                movie,
                layout: '../views/layouts/dashboard'
            });
        } else {
            res.status(404).send("Movie not found.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// Update movie notes
exports.dashboardUpdateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title: req.body.title, body: req.body.body },
            { new: true, runValidators: true } // Returns the updated document and runs validators
        );

        if (!updatedMovie) {
            return res.status(404).send('Movie not found');
        }

        // Redirect to the dashboard or send a JSON response based on your use case
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete movie notes
exports.dashboardDeleteMovie = async (req, res) => {
    try {
        await Movie.deleteOne({_id: req.params.id}).where({user: req.user.id});
        res.redirect('/dashboard');
        
    } catch (error) {
        console.log(error);
    }
}

// Add movie get
exports.dashboardAddMovie = async (req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    });
};

// Add movie submit post
exports.dashboardAddMovieSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Movie.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

// Search get
exports.dashboardSearch = async (req, res) => {
    try {
        res.render('/dashboard/search', {
            searchResults: '',
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        
    }
}

// Search post submit
exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Movie.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, 'i')}},
                { body: { $regex: new RegExp(searchNoSpecialChars, 'i')}}
            ]
        }).where({ user: req.user.id});

        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layouts/dashboard'
        })



    } catch (error) {
        console.log(error);
    }
}