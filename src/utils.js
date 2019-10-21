import moment from 'moment'

export function formSunlightRequest (zipcode) {
  return `https://congress.api.sunlightfoundation.com/legislators/locate?zip=${zipcode}`
}

export function genElectionName (year) {
  return year % 4 === 0 ? `${year} general election` : `${year} general election (midterm)`
}

export function isUpForElection (reps, year) {
  // a representative is considered up for re-election if their term end is
  // equal to the year of the election in question + 1, since terms typically
  // end in january after that election year
  return reps.filter(rep => moment(rep.term_end).year() === year + 1)
}
