import React, { useEffect, useState } from "react"
import "../styles/TypingTitle.css"
import '@fontsource/dm-serif-display';


const TypingTitle = () => {
  const [text, setText] = useState("")
  const fullText = "Prodify"
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const typingSpeed = deleting ? 80 : 150
    const pauseBeforeDelete = 1000
    const pauseBeforeRetype = 500

    const timeout = setTimeout(() => {
      if (!deleting && index < fullText.length) {
        // Typing forward
        setText(fullText.slice(0, index + 1))
        setIndex(index + 1)
      } else if (deleting && index > 0) {
        // Deleting
        setText(fullText.slice(0, index - 1))
        setIndex(index - 1)
      } else if (!deleting && index === fullText.length) {
        // Pause before deleting
        setTimeout(() => setDeleting(true), pauseBeforeDelete)
      } else if (deleting && index === 0) {
        // Pause before retyping
        setTimeout(() => setDeleting(false), pauseBeforeRetype)
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [index, deleting])

  return (
    <h1 className="typing-title">
      {text}
      <span className="cursor">|</span>
      <p className="typing-subtitle">
        Streamlining productivity with all-in-one AI note taking, calendar and to-do list
      </p>
    </h1>
  )
}

export default TypingTitle
