import { useState, useEffect } from 'react'
import styles from './ImageCarousel.module.css'

interface ImageCarouselProps {
  images: string[]
  autoPlay?: boolean
  interval?: number
}

export default function ImageCarousel({
  images,
  autoPlay = true,
  interval = 5000
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  if (images.length === 0) return null

  const goToSlide = (index: number) => {
    setCurrent(index)
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.slides}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`${styles.slide} ${index === current ? styles.active : ''}`}
          />
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.prev}`}
        onClick={prevSlide}
        aria-label="Anterior"
      >
        ‹
      </button>

      <button
        className={`${styles.arrow} ${styles.next}`}
        onClick={nextSlide}
        aria-label="Próxima"
      >
        ›
      </button>

      <div className={styles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === current ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
