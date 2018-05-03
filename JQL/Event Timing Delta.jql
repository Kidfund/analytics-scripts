// Very much WIP
// Replace occurances of TKTK with what you need
// Given 2 events and a date range, find the first occurance of the first event, the last occurance of the second event, and then average the time between them accross all users who did both events

var params = {
  firstEventToEvaluate: 'TKTK',
  lastEventToEvaluate: 'TKTK',
  unit: 'hours' // unit to give the results in; can be seconds, hours, days; defaults to seconds
};

function main() {
  return Events({
    from_date: '2018-03-01',
    to_date:   '2018-04-01',
    // get all candidates for this user
    event_selectors:[{event: params.firstEventToEvaluate}, {event: params.lastEventToEvaluate, selector: 'TKTK'}]
  })
  .groupByUser(function(state, events){
    state = {
      firstEvent: 0, 
      lastEvent: 0, 
      delta: 0, 
      firstEventName: 0,
      firstEventTime: 0,
      lastEventName: 0,
      lastEventTime: 0,
    };
    var nEvents = events.length;
  
    // init for comparison
    if(state.firstEvent === 0 && nEvents > 0){
      state.firstEvent = events[0];
      state.lastEvent = events[0];
    }
    
    for(var i = 0; i < nEvents; i++){
      // find the first firstEvent
      if (events[i].time < state.firstEvent.time && events[i].name == params.firstEventToEvaluate) {
        state.firstEvent = events[i];
      }
      
      // find the last lastEvent
      // the time calculation is a little fuzzy if there are multiple lastEvents
      else if (events[i].time >= state.lastEvent.time && events[i].name == params.lastEventToEvaluate) {
        state.lastEvent = events[i];
      }
    }
    
    // get the difference in time between the events
    if (state.lastEvent.time - state.firstEvent.time > 0) {
      state.delta = state.lastEvent.time - state.firstEvent.time;
    }
    
    // doing this check here, instead of in a filter was much faster
    if (state.firstEvent.name == state.lastEvent.name) {
      state.delta = 0;
    }
    
    state.firstEventName = state.firstEvent.name;
    state.firstEventTime = state.firstEvent.time;
    state.lastEventName = state.lastEvent.name;
    state.lastEventTime = state.lastEvent.time;
    
    return state;
  })
  .filter(function(u){ return u.value.delta > 0 })
  .map(function(u){ return {value: getUnit(u.value.delta)}; })
  .reduce(mixpanel.reducer.avg('value'));
  // look at the spread. I think -99 is really "< 0"
  //.groupBy(
  //    [mixpanel.numeric_bucket('value', {bucket_size: 100, offset:1})],
  //    mixpanel.reducer.count());
}

function getUnit(value){
  switch(params.unit){
    case 'seconds':
      return value / 1000;
    case 'hours':
      return value / (1000*3600);
    case 'days':
      return value / (1000*3600*24);
    default:
      return value / 1000;
  }
  return value;
}