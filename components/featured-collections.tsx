import { Button } from "@/components/ui/button"

export function FeaturedCollections() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated collections designed for the modern Muslim woman who values both style and
            modesty.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Everyday Hijabs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-64 bg-black"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Everyday Hijabs</h3>
              <p className="text-gray-600 mb-4">
                Soft, breathable, 100% viscose & jersey hijabs perfect for daily wear. Comfortable and stylish for every
                occasion.
              </p>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full">Shop Collection</Button>
            </div>
          </div>

          {/* Occasion Abayas */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-64 bg-black"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Occasion Abayas</h3>
              <p className="text-gray-600 mb-4">
                Premium crepe and satin fabrics, minimal cuts, prayer-ready. Elegant designs for special moments.
              </p>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full">Shop Collection</Button>
            </div>
          </div>

          {/* Modest Accessories */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-64 bg-black"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Modest Accessories</h3>
              <p className="text-gray-600 mb-4">
                Modest pins, underscarves, breathable caps. Complete your look with our curated accessories.
              </p>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full">Shop Collection</Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-full bg-transparent"
          >
            View All Collections
          </Button>
        </div>
      </div>
    </section>
  )
}
