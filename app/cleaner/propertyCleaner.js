module.exports = async function (next) {
    const Property = require("../model/Property");
    const Lang = require("../model/Lang");

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

    next();
}
