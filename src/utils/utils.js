export const calculateOdds = (value) => {
  if (Math.sign(value) === 1) {
    return `+${value}`;
  }

  return value;
};

export const getDate = (date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const value = new Date(date);
  return `${value.getUTCDate()}-${
    months[value.getUTCMonth()]
  }-${value.getFullYear()}`;
};

// func to clean up editing of teams from Manchester United = manchester_united to get images in Constant.js
// .split(/\s+/) splits the input according to one or more space characters
export const filterTeam = (team) => {
  return team.toLowerCase().trim().split(/\s+/).join("_");
};
