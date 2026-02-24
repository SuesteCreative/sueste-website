import ptTranslations from '../i18n/pt.json';
import enTranslations from '../i18n/en.json';

export const languages = {
    pt: 'Português',
    en: 'English',
};

export const defaultLang = 'pt';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) return lang as keyof typeof languages;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof languages) {
    return function t(key: string): string {
        const translations = lang === 'en' ? enTranslations : ptTranslations;
        // Simple dot notation accessor
        return (key.split('.').reduce((obj, i) => (obj as any)?.[i], translations) as unknown as string) || key;
    }
}
