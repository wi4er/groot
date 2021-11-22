const contentQuery = require("./contentQuery");

describe("Content query filter", function () {
    test("Should parse id filter", () => {
        const filter = contentQuery.parseFilter("field_id-in-NAME");

        expect(filter).toEqual({_id: ["NAME"]});
    });

    test("Should parse id filter", () => {
        const filter = contentQuery.parseFilter("status-in-ACTIVE");

        expect(filter).toEqual({status: {$in: ["ACTIVE"]}});
    });

    test("Should parse id filter", () => {
        const filter = contentQuery.parseFilter("status-in-ACTIVE;PASSIVE;CASUAL");

        expect(filter).toEqual({status: {$in: ["ACTIVE", "PASSIVE", "CASUAL"]}});
    });
});
