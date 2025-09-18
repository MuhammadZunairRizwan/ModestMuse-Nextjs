import { Button } from "@/components/ui/button"

export function CollectionsGrid() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Everyday Hijabs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-64 bg-black"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Everyday Hijabs</h3>
              <p className="text-gray-600 mb-4">
                Soft, breathable, 100% viscose & jersey hijabs perfect for daily wear. Comfortable and stylish for every
                occasion.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Premium Fabrics</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">All-Day Comfort</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Versatile Styles</span>
              </div>

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

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Elegant Designs</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Premium Materials</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Prayer-Ready</span>
              </div>

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

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Quality Crafted</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Thoughtful Design</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">Perfect Finishing</span>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full">Shop Collection</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
