import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

export const LanguageProvider = ({ children }) => {
    // Initialize with saved language or default to 'aze'
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedLanguage') || 'aze'
        }
        return 'aze'
    })
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

    const languageOptions = [
        { code: 'aze', name: 'Aze', flag: '/assets/azerbaijan.svg' },
        { code: 'en', name: 'Eng', flag: '/assets/english.svg' },
        { code: 'ru', name: 'Rus', flag: '/assets/russian.svg' }
    ]


    // Save language to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('selectedLanguage', selectedLanguage)
    }, [selectedLanguage])

    const handleLanguageSelect = (languageCode) => {
        if (languageCode !== selectedLanguage) {
            setSelectedLanguage(languageCode)
        }
        setIsLanguageDropdownOpen(false)
    }

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
    }

    const getCurrentLanguage = () => {
        return languageOptions.find(lang => lang.code === selectedLanguage) || languageOptions[0]
    }

    const value = {
        selectedLanguage,
        setSelectedLanguage,
        isLanguageDropdownOpen,
        setIsLanguageDropdownOpen,
        languageOptions,
        handleLanguageSelect,
        toggleLanguageDropdown,
        getCurrentLanguage
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}
