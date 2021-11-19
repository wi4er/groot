let content = db.getSiblingDB("content");

content.createUser(
    {
        user: "content",
        pwd: "example",
        roles: [
            {
                role: "readWrite",
                db: "content"
            }
        ]
    }
);
