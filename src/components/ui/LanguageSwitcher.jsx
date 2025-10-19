import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import panamaFlag from '@/assets/panama.webp'
import usaFlag from '@/assets/usa.webp'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  const currentFlag = i18n.language === 'es' ? panamaFlag : usaFlag
  const currentLangName = i18n.language === 'es' ? 'Español' : 'English'

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleLanguage}
      className="relative hover:bg-wedding-primary/10 dark:hover:bg-wedding-primary-dark/10 hover:scale-110 transition-all duration-300 p-2"
      title={`Change language / Cambiar idioma (${currentLangName})`}
    >
      <img 
        src={currentFlag} 
        alt={currentLangName} 
        className="w-6 h-6 rounded-sm object-cover shadow-md hover:shadow-lg transition-shadow"
      />
      <span className="sr-only">Change language to {i18n.language === 'es' ? 'English' : 'Español'}</span>
    </Button>
  )
}
