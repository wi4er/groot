module.exports = async function (next) {
    const Property = require("../model/Property");
    const Lang = require("../model/Lang");

    for (const key of this.property?.keys() ?? []) {
        if (!this.property.get(key)) {
            this.property.delete(key);
        } else if (key === "DEF") {
            for (const inner of this.property.get(key).keys() ?? []) {
                if (
                    !this.property.get(key).get(inner)
                    || !await Property.findById(inner)
                ) {
                    this.property.get(key).delete(inner);
                }
            }

            if (this.property.get(key).size === 0) {
                this.property.delete(key);
            }
        } else {
            await Lang.findById(key) ?? this.property.delete(key);
        }
    }

    next();
}
