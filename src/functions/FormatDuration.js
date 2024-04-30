// Simple function to format duration of a workout activity
export function FormatDuration({ duration }) {
    const Hours = Math.floor(duration / 60);
    const Minutes = duration % 60;
    let durationString;
    if (Hours === 0) {
      durationString = Minutes + ' mins';
    } else {
      durationString = Hours + 'h ' + Minutes + 'm';
    }
    return durationString;
}