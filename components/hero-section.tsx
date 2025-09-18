"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

const slides = [
  {
    title: "Welcome to ModestMuse",
    subtitle: "Where Modesty Meets Elegance",
    description:
      "Discover our premium collection of hijabs, abayas, and accessories designed for the modern Muslim woman.",
    buttonText: "Shop the Collection",
  },
  {
    title: "Empowering Women",
    subtitle: "Faith, Fashion & Freedom",
    description: "Join thousands of confident women who choose ModestMuse for their modest fashion needs.",
    buttonText: "Join Our Community",
  },
  {
    title: "Everyday Elegance",
    subtitle: "Comfort Meets Style",
    description: "From office meetings to coffee dates, find the perfect modest outfit for every occasion.",
    buttonText: "Explore Styles",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="bg-black text-white py-24 px-4 relative overflow-hidden">
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-black" />
      </button>

      <div className="max-w-4xl mx-auto text-center">
        <div className="transition-all duration-500 ease-in-out">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{slides[currentSlide].title}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">{slides[currentSlide].subtitle}</p>
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">{slides[currentSlide].description}</p>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-full">
            {slides[currentSlide].buttonText}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/30"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
