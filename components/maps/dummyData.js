const holidays = [
  {
    title: "Berlin",
    locationData: { longitude: 13.4317618, latitude: 52.4827483 },
    startDate: "2021-01-03T02:00:00.000Z",
    info: "My Trip to Berlin.",
    id: "001",
  },
  {
    title: "Liverpool:",
    locationData: { longitude: -2.983333, latitude: 53.400002 },
    startDate: "2022-04-05T06:00:00.000Z",
    info: "My amazing trip to Liverpool!",
    id: "002",
  },
];

const memories = [
  {
    title: "Park",
    locationData: { longitude: 13.353087951539997, latitude: 52.51339022910384 },
    date: "2021-01-03T23:59:01.000Z",
    note: "Had a lovely walk in this beautiful park.",
    id: "001",
    holidayReference: "001"
  },
  {
    title: "Wall",
    locationData: { longitude: 13.44111, latitude: 52.50444 },
    date: "2021-01-06T23:01:01.000Z",
    note: "It's lovely!",
    id: "002",
    holidayReference: "001"
  },
  {
    title: "Boating Lake",
    locationData: { longitude: -2.9364495277404785, latitude: 53.38420486450195 },
    date: "2022-04-06T23:01:01.000Z",
    note: "A relaxing walk around the lake.",
    id: "003",
    holidayReference: "002"
  },
  {
    title: "Museum",
    locationData: { longitude: -2.9955708980560303, latitude: 53.402976989746094 },
    date: "2022-04-07T23:01:01.000Z",
    note: "It's lovely!",
    id: "004",
    holidayReference: "002"
  },
];

export default { holidays, memories };
