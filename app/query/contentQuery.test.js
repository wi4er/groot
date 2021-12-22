const contentQuery = require("./contentQuery");

describe("Content query filter", function () {
    test("Should parse id filter", () => {
        const filter = contentQuery.parseFilter("field-id-in-NAME");

        expect(filter).toEqual({_id: {$in: ["NAME"]}});
    });

    test("Should parse slug filter", () => {
        const filter = contentQuery.parseFilter("field-slug-in-SOMETHING");

        expect(filter).toEqual({slug: {$in: ["SOMETHING"]}});
    });

    test("Should parse multi slug filter", () => {
        const filter = contentQuery.parseFilter("field-slug-in-A;B;C");

        expect(filter).toEqual({slug: {$in: ["A", "B", "C"]}});
    });
    test("Should parse status filter", () => {
        const filter = contentQuery.parseFilter("status-in-ACTIVE");

        expect(filter).toEqual({status: {$in: ["ACTIVE"]}});
    });

    test("Should parse multi status filter", () => {
        const filter = contentQuery.parseFilter("status-in-ACTIVE;PASSIVE;CASUAL");

        expect(filter).toEqual({status: {$in: ["ACTIVE", "PASSIVE", "CASUAL"]}});
    });
});
