import { Star } from "lucide-react"

export function CustomerTestimonials() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of confident women who trust ModestMuse for their modest fashion needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">
              "I love how ModestMuse feels at work—stylish and comfortable. The hijabs are so soft and the colors are
              perfect for professional settings."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Amira Hassan</p>
              <p className="text-sm text-gray-500">New York, NY</p>
              <p className="text-sm text-teal-600 mt-1">Everyday Hijab Collection</p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">
              "Finally found a brand that understands modest fashion! The abayas are elegant and the quality is
              exceptional. I get compliments everywhere I go."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Fatima Al-Zahra</p>
              <p className="text-sm text-gray-500">London, UK</p>
              <p className="text-sm text-teal-600 mt-1">Premium Abaya</p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">
              "ModestMuse has transformed my wardrobe. The pieces are versatile, high-quality, and make me feel
              confident in any setting."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Zara Ahmed</p>
              <p className="text-sm text-gray-500">Toronto, CA</p>
              <p className="text-sm text-teal-600 mt-1">Complete Collection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
