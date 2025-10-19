
import { QuoteCard } from "./QuoteCard"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { useTranslation } from "react-i18next"

export function WeddingQuotes() {
  const { t } = useTranslation()
  
  // Obtener las citas traducidas
  const weddingQuotes = t('home.quote.quotes', { returnObjects: true })

  return (
    <div className="w-full">
      <InfiniteMovingCards speed="slow" visibleItems={3}>
        {weddingQuotes.map((item, idx) => (
          <QuoteCard key={idx} quote={item.text} author={item.author} />
        ))}
      </InfiniteMovingCards>
    </div>
  )
}

