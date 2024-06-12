const { readBySettingKey } = require('@/middlewares/settings');

const getLable = (lang, key) => {
    try {
        const lowerCaseKey = key
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/ /g, '_');

        if (lang[lowerCaseKey]) return lang[lowerCaseKey];
        else {
            const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');

            const conversionOfAllFirstCharacterOfEachWord = remove_underscore_fromKey.map(
                (word) => word[0].toUpperCase() + word.substring(1)
            );

            const lable = conversionOfAllFirstCharacterOfEachWord.join(' ');

            return lable;
        }
    } catch (error) {
        return 'No translate found';
    }
};

const useSelector = () => {
    const defaultFilePath = './translation/en_us';

    const langFile = require(defaultFilePath);
    return langFile;
};

const useLanguage = ({ selectedLang }) => {
    const lang = useSelector();
    const translate = (value) => {
        const text = getLable(lang, value);
        return text;
    }
    return translate;
};

module.exports = useLanguage;
