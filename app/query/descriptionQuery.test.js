const descriptionQuery = require("./descriptionQuery");

describe("Description query filter", function () {
    test("Should parse id filter", () => {
        const filter = descriptionQuery.parseFilter("field_id-in-NAME");

        expect(filter).toEqual({_id: ["NAME"]});
    });

    test("Should parse id filter", () => {
        const filter = descriptionQuery.parseFilter("status-in-ACTIVE");

        expect(filter).toEqual({status: {$in: ["ACTIVE"]}});
    });

    test("Should parse id filter", () => {
        const filter = descriptionQuery.parseFilter("status-in-ACTIVE;PASSIVE;CASUAL");

        expect(filter).toEqual({status: {$in: ["ACTIVE", "PASSIVE", "CASUAL"]}});
    });
});
