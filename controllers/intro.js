exports.getIntropage = (req, res, nex) => {
    res.sendFile('intro.html', { root: 'views' });
}
exports.getMainpage = (req, res, nex) => {
    res.sendFile('main.html', { root: 'views' });
}