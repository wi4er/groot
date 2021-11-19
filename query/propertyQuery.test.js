const propertyQuery = require("./propertyQuery");

describe("Property query filter", function () {
    test("Should parse id filter", () => {
        const filter = propertyQuery.parseFilter("field_id-in-NAME");

        expect(filter).toEqual({_id: {$in: ["NAME"]}});
    });

    test("Should parse status filter", () => {
        const filter = propertyQuery.parseFilter("status-in-ACTIVE");

        expect(filter).toEqual({status: {$in: ["ACTIVE"]}});
    });

    test("Should parse multi status filter", () => {
        const filter = propertyQuery.parseFilter("status-in-ACTIVE;PASSIVE;CASUAL");

        expect(filter).toEqual({status: {$in: ["ACTIVE", "PASSIVE", "CASUAL"]}});
    });
});
