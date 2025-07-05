import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { useLanguage, SUPPORTED_LANGUAGES } from '../contexts/LanguageContext.jsx';

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { language, setLanguage, currentLanguageData } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  // Compact button variant for header/navbar
  if (variant === 'button') {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLanguageData?.flag}</span>
          <span className="hidden sm:inline">{currentLanguageData?.nativeName}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <Card className="absolute right-0 top-full mt-2 z-50 min-w-48 border-0 shadow-xl">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                        language === lang.code ? 'bg-orange-50 text-orange-600' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-xs text-gray-500">{lang.name}</p>
                      </div>
                      {language === lang.code && (
                        <Check className="h-4 w-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // Full dropdown variant for settings pages
  if (variant === 'dropdown') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Language / Idioma / 言語</label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{currentLanguageData?.flag}</span>
              <div className="text-left">
                <p className="font-medium">{currentLanguageData?.nativeName}</p>
                <p className="text-sm text-gray-500">{currentLanguageData?.name}</p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 border-0 shadow-xl">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                          language === lang.code ? 'bg-orange-50 text-orange-600' : ''
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="flex-1">
                          <p className="font-medium">{lang.nativeName}</p>
                          <p className="text-sm text-gray-500">{lang.name}</p>
                        </div>
                        {language === lang.code && (
                          <Check className="h-4 w-4 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  // Inline variant for compact spaces
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1">
        {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              language === lang.code 
                ? 'bg-orange-500 text-white' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={lang.nativeName}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  // Grid variant for settings or onboarding
  if (variant === 'grid') {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium">Choose your language</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                language === lang.code 
                  ? 'border-orange-500 bg-orange-50 text-orange-600' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <p className="font-semibold">{lang.nativeName}</p>
                <p className="text-sm opacity-75">{lang.name}</p>
              </div>
              {language === lang.code && (
                <Check className="h-5 w-5 ml-auto text-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default LanguageSwitcher;

