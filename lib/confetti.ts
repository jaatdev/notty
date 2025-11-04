import confetti from 'canvas-confetti'

// Basic confetti celebration
export function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}

// Mega celebration for major achievements
export function megaCelebrate() {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
}

// Quiz completion confetti
export function quizComplete(score: number) {
  const count = score >= 80 ? 150 : score >= 60 ? 100 : 50
  const colors = score >= 80 
    ? ['#10b981', '#059669', '#34d399'] 
    : score >= 60 
    ? ['#3b82f6', '#2563eb', '#60a5fa']
    : ['#f59e0b', '#d97706', '#fbbf24']

  confetti({
    particleCount: count,
    spread: 100,
    origin: { y: 0.6 },
    colors: colors
  })
}

// Flashcard mastery celebration
export function flashcardMastery() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#10b981', '#059669', '#34d399', '#6ee7b7']
  })
}

// Achievement unlock celebration
export function achievementUnlock() {
  const scalar = 2
  const star = confetti.shapeFromText({ text: '⭐', scalar })
  const trophy = confetti.shapeFromText({ text: '🏆', scalar })

  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.96,
    startVelocity: 20,
    shapes: [star, trophy],
    scalar
  }

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30
    })

    confetti({
      ...defaults,
      particleCount: 5,
      flat: true
    })
  }

  setTimeout(shoot, 0)
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}

// Fireworks effect
export function fireworks() {
  const duration = 5000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) }
    })
  }, 300)
}
