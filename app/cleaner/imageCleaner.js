module.exports = async function(next) {
    const Image = require("../model/Image");

    for (const key in this.image) {
        const res = await Image.findById(this.image[key].image);

        if (!res) {
            delete this.image[key];
        }
    }

    this.image = this.image.filter(item => item);

    next();
}
