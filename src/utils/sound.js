const correctAudio = new Audio('/sound/correct.mp3')
const wrongAudio = new Audio('/sound/wrong.mp3')

export function playSound(type) {
  const audio = type === 'correct' ? correctAudio : wrongAudio
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
