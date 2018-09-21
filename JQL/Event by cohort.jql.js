function main() {
    var activeUUIDs = [
        "000-000-000-000",
    ];
    var activeEmails = [
        "tim@kidfund.us",
    ];
    
    var queryEventNames = [
        "Invite Sent",
        "Tell Friend Sent",
        // "Invite Opened",
        // "Tell Friend Opened",
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
            var firstQueryEvent = tuples.find(function (tuple) {
                var eventName = tuple.event.name;
                return eventName &&
                    queryEventNames.includes(eventName);
            });
            return firstQueryEvent !== undefined;
        })
        .groupBy(["value"], mixpanel.reducer.count());
}
