import Footer from "@/components/footer"
import Navbar from "@/components/landing-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CalendarDays, ChevronRight, Search } from "lucide-react"
import Image from "next/image"

// Mock blog post data
const featuredPost = {
  id: "1",
  title: "Understanding DeFi: The Future of Finance on the Blockchain",
  excerpt:
    "Explore how Decentralized Finance is revolutionizing traditional financial systems and what it means for investors and traders.",
  image: "/placeholder.svg?height=400&width=600",
  date: "May 15, 2023",
  category: "DeFi",
  author: {
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
}

const blogPosts = [
  {
    id: "2",
    title: "Top 10 Emerging Tokens to Watch in 2023",
    excerpt: "Our analysts have compiled a list of promising new tokens with strong fundamentals and growth potential.",
    image: "/placeholder.svg?height=240&width=360",
    date: "May 10, 2023",
    category: "Analysis",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    title: "How to Perform Fundamental Analysis on Cryptocurrency Projects",
    excerpt:
      "Learn the essential frameworks and metrics to evaluate cryptocurrency projects for long-term investment potential.",
    image: "/placeholder.svg?height=240&width=360",
    date: "May 8, 2023",
    category: "Education",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "4",
    title: "The Rise of Layer 2 Solutions: Scaling Blockchain for Mass Adoption",
    excerpt:
      "Discover how Layer 2 scaling solutions are addressing blockchain's scalability challenges and enabling new use cases.",
    image: "/placeholder.svg?height=240&width=360",
    date: "May 5, 2023",
    category: "Technology",
    author: {
      name: "David Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "5",
    title: "NFTs Beyond Art: Exploring New Use Cases in Gaming and Real Estate",
    excerpt:
      "Non-fungible tokens are expanding beyond digital art into gaming, real estate, and other sectors. Here's what you need to know.",
    image: "/placeholder.svg?height=240&width=360",
    date: "May 3, 2023",
    category: "NFTs",
    author: {
      name: "Emily Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "6",
    title: "Crypto Market Cycles: Historical Patterns and Future Predictions",
    excerpt:
      "Analyzing past crypto market cycles to identify patterns and make educated predictions about future market movements.",
    image: "/placeholder.svg?height=240&width=360",
    date: "April 28, 2023",
    category: "Markets",
    author: {
      name: "Robert Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "7",
    title: "Securing Your Crypto: Best Practices for Wallet Management",
    excerpt:
      "Essential security practices every crypto holder should follow to protect their digital assets from theft and loss.",
    image: "/placeholder.svg?height=240&width=360",
    date: "April 25, 2023",
    category: "Security",
    author: {
      name: "Jessica Parker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

const categories = ["All", "DeFi", "NFTs", "Analysis", "Technology", "Markets", "Education", "Security"]

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Token Radar Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Insights, analyses, and guides for cryptocurrency traders and enthusiasts
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="Search articles..." className="pl-10 h-12 bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div className="flex overflow-x-auto py-2 mb-8 scrollbar-hide">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`px-4 py-2 text-sm rounded-full cursor-pointer whitespace-nowrap ${
                    category === "All"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="lg:order-2">
                    <div className="relative h-64 lg:h-full">
                      <Image
                        src={featuredPost.image || "/placeholder.svg"}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="bg-indigo-600 text-white px-2 py-1 text-xs font-semibold rounded">
                          {featuredPost.category}
                        </span>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <CalendarDays size={14} className="mr-1" />
                          {featuredPost.date}
                        </div>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold">{featuredPost.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{featuredPost.excerpt}</p>
                      <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden">
                            <Image
                              src={featuredPost.author.avatar || "/placeholder.svg"}
                              alt={featuredPost.author.name}
                              width={32}
                              height={32}
                            />
                          </div>
                          <span className="text-sm font-medium">{featuredPost.author.name}</span>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Read More <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs font-semibold rounded">
                      {post.category}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <CalendarDays size={14} className="mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="text-sm">{post.author.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
