class IndexController {
  viewHome = (req, res) => {
        res.render("index");
  };
}

module.exports = new IndexController();
