exports.getIntropage = (req, res) => {
    res.sendFile('intro.html', { root: 'views' });
}
exports.getMainpage = (req, res) => {
    res.sendFile('main.html', { root: 'views' });
}