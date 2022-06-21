module.exports = async function (next) {
    const Property = require("../Property");
    const Lang = require("../Lang");

    for (const langKey of this.property?.keys() || []) {
        if (!this.property.get(langKey)) {
            this.property.delete(langKey);
        } else if (langKey === "DEF") {
            for (const inner of this.property.get(langKey).keys()) {
                if (
                    !this.property.get(langKey).get(inner)
                    || !await Property.findById(inner)
                ) {
                    this.property.get(langKey).delete(inner);
                }
            }

            if (this.property.get(langKey).size === 0) {
                this.property.delete(langKey);
            }
        } else {
            await Lang.findById(langKey) ?? this.property.delete(langKey);
        }
    }

    if (!this.property?.size) {
        this.property = undefined;
    }

    next();
}
