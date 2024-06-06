exports.getIntroPage = (req, res) => {
    res.sendFile('intro.html', { root: 'views' });
}
exports.getMainPage = (req, res) => {
    res.sendFile('main.html', { root: 'views' });
}