// GET Homepage
exports.homepage = async (req, res) => {
    const locals = {
        title: "Movie Tracker",
        description: "Movie Journal-Planner App"
    }
    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });
}

// GET About
exports.about = async (req, res) => {
    const locals = {
        title: "About - Movie Tracker",
        description: "Movie Journal-Planner App"
    }
    res.render('about', locals);
}

