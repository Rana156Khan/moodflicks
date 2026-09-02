// Each answer adds points to one or more genres.
// Highest total wins; GENRES order is the tie-breaker.

export const GENRES = ['Comedy', 'Thriller', 'Drama', 'Sci-Fi', 'Romance', 'Horror']

export const GENRE_INFO = {
  Comedy: {
    mood: 'You need a lift tonight',
    blurb: 'Something light that lets your shoulders drop. No homework, just laughs.',
    picks: ['Paddington 2', 'Game Night', 'The Grand Budapest Hotel'],
  },
  Thriller: {
    mood: 'You want your pulse up',
    blurb: 'You have energy to burn and want a film that grips you by the collar.',
    picks: ['Prisoners', 'Gone Girl', 'Sicario'],
  },
  Drama: {
    mood: 'You are in a reflective mood',
    blurb: 'You want something that sits with you after the credits roll.',
    picks: ['The Pursuit of Happyness', 'Manchester by the Sea', 'Whiplash'],
  },
  'Sci-Fi': {
    mood: 'Your mind wants to wander far',
    blurb: 'Big ideas, other worlds — you want to think about something enormous.',
    picks: ['Arrival', 'Interstellar', 'Ex Machina'],
  },
  Romance: {
    mood: 'Your heart wants the warm stuff',
    blurb: 'Connection, longing, a good ache. Bring the blanket.',
    picks: ['About Time', 'Pride & Prejudice', 'La La Land'],
  },
  Horror: {
    mood: 'You want a safe scare',
    blurb: 'Controlled fear is a strange kind of fun, and tonight you are up for it.',
    picks: ['A Quiet Place', 'Get Out', 'The Conjuring'],
  },
}

export const QUESTIONS = [
  {
    q: 'How did today treat you?',
    options: [
      { text: 'Wrung me out — I am done', weights: { Comedy: 2, Romance: 1 } },
      { text: 'Boring. I need a jolt', weights: { Thriller: 2, Horror: 1 } },
      { text: 'A lot happened; still processing', weights: { Drama: 2 } },
      { text: 'Fine, but my brain is restless', weights: { 'Sci-Fi': 2, Thriller: 1 } },
    ],
  },
  {
    q: 'What pace sounds right for tonight?',
    options: [
      { text: 'Breezy — keep it moving and fun', weights: { Comedy: 2 } },
      { text: 'Relentless — do not let me look away', weights: { Thriller: 2, Horror: 1 } },
      { text: 'Slow burn — let it build', weights: { Drama: 2, Romance: 1 } },
      { text: 'Layered — I want to piece things together', weights: { 'Sci-Fi': 2 } },
    ],
  },
  {
    q: 'Who is on the couch with you?',
    options: [
      { text: 'Friends who talk over the movie', weights: { Comedy: 2, Horror: 1 } },
      { text: 'Just me, lights off', weights: { Thriller: 1, Horror: 2 } },
      { text: 'Someone I want to sit close to', weights: { Romance: 2 } },
      { text: 'Just me, and I want to feel something real', weights: { Drama: 2 } },
    ],
  },
  {
    q: 'Pick the setting that pulls you in right now.',
    options: [
      { text: 'A sunny seaside town', weights: { Comedy: 1, Romance: 2 } },
      { text: 'A rain-slicked city at 2 a.m.', weights: { Thriller: 2 } },
      { text: 'A creaking old house', weights: { Horror: 2 } },
      { text: 'A ship drifting past Saturn', weights: { 'Sci-Fi': 2 } },
    ],
  },
  {
    q: 'How much thinking do you want to do?',
    options: [
      { text: 'None. Entertain me', weights: { Comedy: 2, Horror: 1 } },
      { text: 'Keep me guessing till the end', weights: { Thriller: 2 } },
      { text: 'Make me feel more than think', weights: { Drama: 1, Romance: 2 } },
      { text: 'Melt my brain a little', weights: { 'Sci-Fi': 2, Drama: 1 } },
    ],
  },
  {
    q: 'When the credits roll, you want to feel…',
    options: [
      { text: 'Lighter than when I sat down', weights: { Comedy: 2, Romance: 1 } },
      { text: 'Like I just got off a rollercoaster', weights: { Thriller: 2, Horror: 2 } },
      { text: 'Moved, maybe a little teary', weights: { Drama: 2, Romance: 1 } },
      { text: 'Full of questions about the universe', weights: { 'Sci-Fi': 2 } },
    ],
  },
]

export function scoreAnswers(answerIndices) {
  const totals = Object.fromEntries(GENRES.map((g) => [g, 0]))
  answerIndices.forEach((optionIndex, questionIndex) => {
    const weights = QUESTIONS[questionIndex].options[optionIndex].weights
    for (const [genre, pts] of Object.entries(weights)) {
      totals[genre] += pts
    }
  })
  let winner = GENRES[0]
  for (const g of GENRES) {
    if (totals[g] > totals[winner]) winner = g
  }
  return winner
}
