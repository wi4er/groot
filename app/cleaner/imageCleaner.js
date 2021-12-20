const Image = require("../model/Image");

module.exports = async function(next) {
    for (const key of this.image?.keys() ?? []) {
        await Image.findById(key) ?? this.image.delete(key);
    }

    next();
}
