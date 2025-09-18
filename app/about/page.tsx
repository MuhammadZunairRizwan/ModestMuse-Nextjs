import { Search, User, ShoppingCart, Heart, Users, Award, Globe, Target, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


const timelineEvents = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "ModestMuse was founded in New York City with a simple mission: to create beautiful modest fashion for modern Muslim women.",
    side: "right",
  },
  {
    year: "2021",
    title: "First Collection",
    description:
      "Launched our debut hijab collection, featuring premium fabrics and contemporary designs that quickly gained a loyal following.",
    side: "left",
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Expanded shipping to 25 countries, bringing ModestMuse to Muslim women around the world.",
    side: "right",
  },
  {
    year: "2023",
    title: "Complete Wardrobe",
    description: "Introduced abayas, accessories, and a full range of modest fashion essentials.",
    side: "left",
  },
  {
    year: "2024",
    title: "Community Impact",
    description: "Reached 10,000+ happy customers and launched our mentorship program for young Muslim entrepreneurs.",
    side: "right",
  },
  {
    year: "2025",
    title: "Future Forward",
    description: "Continuing to innovate with sustainable practices and expanding our size-inclusive collections.",
    side: "left",
  },
]

const teamMembers = [
  {
    name: "Amira Hassan",
    role: "Founder & CEO",
    initial: "A",
    bio: "A passionate advocate for modest fashion, Amira founded ModestMuse to bridge the gap between faith and contemporary style. With over 10 years in fashion design, she brings both expertise and personal understanding to every piece.",
  },
  {
    name: "Fatima Al-Zahra",
    role: "Head of Design",
    initial: "F",
    bio: "Fatima's innovative designs have been featured in major fashion publications. She specializes in creating elegant, functional pieces that honor both tradition and modern aesthetics.",
  },
  {
    name: "Zara Ahmed",
    role: "Community Manager",
    initial: "Z",
    bio: "Zara connects with our global community of customers, ensuring every voice is heard and every need is met. She's passionate about building inclusive spaces for Muslim women worldwide.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    description:
      "We create designs that honor both personal style and religious values, ensuring every piece feels true to who you are.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description:
      "Our designs celebrate women of all backgrounds, sizes, and styles, creating fashion that truly serves everyone.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "We use only premium materials and ethical manufacturing processes to create pieces that last and feel luxurious.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "We're committed to responsible fashion that respects both our customers and our planet for future generations.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
    <Header />


      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About ModestMuse</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Born from a passion for modest fashion and a deep understanding of the modern Muslim woman's needs,
            ModestMuse is more than a brand—it's a movement toward inclusive, elegant, and authentic style.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
          <p className="text-gray-600 text-center mb-8">
            ModestMuse began with a simple observation: modest fashion shouldn't mean compromising on style, quality, or
            self-expression.
          </p>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              In 2020, our founder Amira Hassan was preparing for a job interview at a prestigious consulting firm in
              Manhattan. As she searched for the perfect outfit—something that would convey professionalism while
              honoring her choice to wear hijab—she found herself frustrated by the limited options available. The few
              modest pieces she could find were either too casual, poorly made, or simply didn't reflect her personal
              style.
            </p>

            <p>
              That evening, as she sat in her Brooklyn apartment surrounded by online shopping tabs and a growing sense
              of disappointment, Amira had an epiphany. If she, a fashion-conscious professional with years of design
              experience, was struggling to find appropriate modest wear, how many other women were facing the same
              challenge?
            </p>

            <p>
              The answer, as she would soon discover, was thousands. Through conversations with friends, social media
              polls, and community forums, Amira learned that Muslim women across the Western world were making daily
              compromises between their faith, their professional aspirations, and their personal style. They were
              altering clothes, layering pieces in creative but often uncomfortable ways, or simply settling for options
              that didn't truly represent who they were.
            </p>

            <p>
              Determined to change this narrative, Amira began sketching designs in her small Brooklyn apartment and
              later a small studio in the Garment District. Amira began designing pieces that she wished existed—hijabs
              that draped beautifully and stayed in place during long workdays, abayas that were elegant enough for
              special occasions yet comfortable enough for daily wear, and accessories that added the perfect finishing
              touch to any outfit.
            </p>

            <p>
              Today, ModestMuse serves thousands of women across 50+ countries, but our core mission remains unchanged:
              to create beautiful, high-quality modest fashion that empowers women to be their authentic selves in every
              aspect of their lives.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-teal-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To empower hijab-wearing women with stylish, well-crafted modest clothing that seamlessly blends faith,
                fashion, and freedom. We believe every woman deserves to feel confident, beautiful, and authentically
                herself, regardless of where she is in the world or what she's pursuing in life.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To normalize and celebrate modest dressing in Western mainstream fashion, creating a world where modest
                fashion is not just accepted but admired for its elegance, sophistication, and timeless appeal. We
                envision a future where every Muslim woman can express her style with confidence and pride.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600">
              These principles guide everything we do, from design to customer service to community building.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600">
              From a small apartment in Brooklyn to serving customers worldwide, here's how we've grown.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-teal-200"></div>

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`flex items-center ${event.side === "left" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-1/2 ${event.side === "left" ? "pr-8 text-right" : "pl-8"}`}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="text-teal-600 font-bold text-lg mb-2">{event.year}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="w-4 h-4 bg-teal-600 rounded-full border-4 border-white shadow-sm z-10"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600">
              The passionate individuals who bring creativity, innovation, and expertise to our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-200 to-green-300 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-teal-700">{member.initial}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="bg-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the ModestMuse Community</h2>
          <p className="text-teal-100 text-lg mb-8">
            Be part of a movement that celebrates modest fashion and empowers women to express their authentic selves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3">Shop Our Collection</Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 bg-transparent"
            >
              Join Our Newsletter
            </Button>
          </div>
        </div>
      </section>

    <Footer />

    </div>
  )
}
