import { Heart, Leaf, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OurStory() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Story text */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                Born in NYC, ModestMuse was founded by hijab-wearing women passionate about blending faith, fashion, and
                freedom. We understand the unique challenges of finding stylish, well-crafted modest clothing in Western
                markets.
              </p>
              <p>
                Our mission is to empower hijab-wearing women with elegant, contemporary pieces that honor both personal
                style and religious values. Every design is thoughtfully created to help you feel confident and
                beautiful in any setting.
              </p>
              <p>
                From boardrooms to coffee shops, from university campuses to family gatherings, ModestMuse is here to
                support your journey with clothing that celebrates who you are.
              </p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full">
              Learn More About Us
            </Button>
          </div>

          {/* Right side - Feature grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Designed by Hijabis</h3>
              <p className="text-sm text-gray-600">Created by hijab-wearing women who understand your needs</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sustainable & Ethical</h3>
              <p className="text-sm text-gray-600">Responsibly made with respect for faith and environment</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Inclusive Sizing</h3>
              <p className="text-sm text-gray-600">Beautiful modest fashion for every body type (XS-3XL)</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Factory-direct pricing without compromising on quality</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
