function main() {
    var activeUUIDs = [
        "000-000-000-000",
    ];
    var activeEmails = [
        "tim@kidfund.us",
    ];

    return join(
        Events({
            from_date: "2017-01-01",
            to_date: "2018-09-20"
        }),
        People())
        .filter(function (tuple) {
            return tuple.event
                && tuple.event.name
                && tuple.user
                &&
                (
                    (tuple.user.properties.uuid
                        && activeUUIDs.includes(tuple.user.properties.uuid)
                    )
                    ||
                    (tuple.user.properties.email
                        && activeEmails.includes(tuple.user.properties.email)
                    )
                );
        })
        .groupByUser(function (state, tuples) {
            var inviteEvent = tuples.find(function (tuple) {
                var event = tuple.event;
                return (
                    event.name == "Invite Sent"
                    || event.name == "Tell Friend Sent"
                    //|| event.name == "Invite Opened"
                    //|| event.name == "Tell Friend Opened"
                );
            });
            return inviteEvent !== undefined;
        })
        .groupBy(["value"], mixpanel.reducer.count());
}
