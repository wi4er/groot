const Directory = require("./Directory");
const Status = require("./Flag");
const WrongRefError = require("../exception/WrongRefError");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Directory", function () {
    describe("Directory fields", () => {
        test("Should create", async () => {
            const inst = await new Directory({
                _id: "DIRECTORY"
            }).save();

            expect(inst._id).toBe("DIRECTORY");
            expect(inst.timestamp).not.toBeUndefined();
            expect(inst.created).not.toBeUndefined();
        });

        test("Should update", async () => {
            const inst = await new Directory({
                _id: "DIRECTORY"
            }).save();

            const {timestamp, created} = inst;
            await inst.save();

            expect(inst.timestamp).not.toBe(timestamp);
            expect(inst.created).toBe(created);
        });
    });

    describe("Directory with flag", () => {
        test("Should create with status", async () => {
            await new Status({_id: "ACTIVE"}).save();

            const inst = await new Directory({
                _id: "DIRECTORY",
                flag: "ACTIVE",
            }).save();

            expect(inst.flag).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create with wrong status", async () => {
            const item = await new Directory({
                _id: "DIRECTORY",
                flag: "PASSIVE",
            }).save();

            expect(item.flag).toBeUndefined();
        });

        test("Should populate with status", async () => {
            await new Status({_id: "ACTIVE"}).save();

            const inst = await new Directory({
                _id: "DIRECTORY",
                flag: "ACTIVE",
            }).save();

            const result = await Directory.findById(inst._id)
                .populate( "flag")
                .exec();

            expect(result.flag).toHaveLength(1);
            expect(result.flag[0]._id).toBe("ACTIVE");
        });
    });
});
