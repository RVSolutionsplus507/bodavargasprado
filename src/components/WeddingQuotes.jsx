
import { QuoteCard } from "./QuoteCard"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const weddingQuotes = [
  {
    quote: "El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección.",
    author: "Antoine de Saint-Exupéry",
  },
  {
    quote: "Un matrimonio exitoso requiere enamorarse muchas veces, siempre de la misma persona.",
    author: "Mignon McLaughlin",
  },
  {
    quote: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.",
    author: "1 Corintios 13:4",
  },
  {
    quote: "En ti he encontrado lo que mi alma buscaba, lo que mi corazón anhelaba y lo que mis sueños imaginaban.",
    author: "Anónimo",
  },
  {
    quote: "El matrimonio es la unión de dos buenos perdonadores.",
    author: "Ruth Bell Graham",
  },
  {
    quote: "Donde hay amor, hay vida.",
    author: "Mahatma Gandhi",
  },
  {
    quote: "El amor verdadero no tiene final feliz, porque el amor verdadero nunca termina.",
    author: "Anónimo",
  },
  {
    quote: "Crecer en el amor es crecer juntos, apoyándose mutuamente en cada paso del camino.",
    author: "Anónimo",
  },
]

export function WeddingQuotes() {
  return (
    <div className="w-full">
      <InfiniteMovingCards speed="slow" visibleItems={3}>
        {weddingQuotes.map((item, idx) => (
          <QuoteCard key={idx} quote={item.quote} author={item.author} />
        ))}
      </InfiniteMovingCards>
    </div>
  )
}

