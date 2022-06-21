
module.exports = async function(next) {
    const Description = require("../Description");
    const Lang = require("../Lang");

    for (const key of this.description?.keys() ?? []) {
        if (!this.description.get(key)) {
            this.description.delete(key);
        } else if (key === "DEF") {
            for (const inner of this.description.get(key).keys() ?? []) {
                if (
                    !this.description.get(key).get(inner)
                    || !await Description.findById(inner)
                ) {
                    this.description.get(key).delete(inner);
                }
            }

            if (this.description.get(key).size === 0) {
                this.description.delete(key);
            }
        } else {
            await Lang.findById(key) ?? this.description.delete(key);
        }
    }

    if (!this.description?.size) {
        this.description = undefined;
    }

    next();
}
