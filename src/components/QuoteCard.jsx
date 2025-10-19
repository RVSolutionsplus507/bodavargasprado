
import { memo } from "react"
import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export const QuoteCard = memo(function QuoteCard({ quote, author }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <Card className="bg-wedding-background/50 dark:bg-wedding-background-dark/50 border-wedding-primary/20 dark:border-wedding-primary-dark/20 h-full">
        <CardContent className="pt-6 relative h-full flex flex-col">
          <Quote className="absolute top-2 left-2 w-6 h-6 text-wedding-primary-dark/20 dark:text-wedding-primary/20" />
          <blockquote className="text-sm md:text-base italic text-center px-4 py-2 flex-grow">"{quote}"</blockquote>
          {author && (
            <footer className="text-right text-xs mt-2 text-wedding-text dark:text-wedding-text-dark/80">
              — {author}
            </footer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

