function divmod(one, two) {
  return [Math.floor(one/two), one % two];
}

function precisionRound(number, precision) {
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function secondsToString(seconds) {
  let secondsInMin  = 60;
  let secondsInHour = secondsInMin  * 60;
  let secondsInDay  = secondsInHour * 24;
  let secondsInWeek = secondsInDay  * 7;
  let secondsInYear = secondsInWeek * 52;
  let years, weeks, days, hours, mins = 0;
  [years, seconds] = divmod(seconds, secondsInYear);
  [weeks, seconds] = divmod(seconds, secondsInWeek);
  [days,  seconds] = divmod(seconds, secondsInDay);
  [hours, seconds] = divmod(seconds, secondsInHour);
  [mins,  seconds] = divmod(seconds, secondsInMin);
  let out = [];
  if (years   > 0) out.push(`${years} years`);
  if (weeks   > 0) out.push(`${weeks} weeks`);
  if (days    > 0) out.push(`${days} days`);
  if (hours   > 0) out.push(`${hours} hours`);
  if (mins    > 0) out.push(`${mins} minutes`);
  
  if (seconds > 0.005) {
    out.push(`${precisionRound(seconds, 2)} seconds`);
  } else {
    out.push(`${precisionRound(seconds, 10)} seconds`);
  }
  return out.join(', ');
}

function scorePassword(password, opsPerSec = 4000000000) {
  password = password || '';

  let messageSpace = 0;

  // These are the typical levels of entropy tried by brute forcing
  // Only alphabetic, alphanumeric, etc.
  let spaces = [
    { regex: /[a-z]/,                    value: 26 }, // lower
    { regex: /[A-Z]/,                    value: 26 }, // upper
    { regex: /\s/,                       value: 1  }, // space
    { regex: /\d/,                       value: 10 }, // digit
    { regex: /[\,\!\@\#\$\%\^\&\*\(\)]/, value: 11 }, // puncuation
  ];

  // Add the entropy of the matching space to the total space
  spaces.forEach(function(space) {
    if (space.regex.test(password)) messageSpace += space.value;
  });

  // if (messageSpace < 26) messageSpace = 26;
  let combinations = Math.pow(messageSpace, password.length);
  let timeToCrack = combinations / opsPerSec;

  return {
    messageSpace: messageSpace,
    passwordLength: password.length,
    combinations: combinations,
    timeToCrack: timeToCrack,
    string: secondsToString(timeToCrack)
  }
}

// console.log(JSON.stringify(scorePassword('test'), null, 2));
