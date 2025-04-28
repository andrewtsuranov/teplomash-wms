export const useReverseTransliterate = (text) => {
    const reverseMap = {
        "a": "а",
        "b": "б",
        "v": "в",
        "g": "г",
        "d": "д",
        "e": ["е", "э"],
        "yo": "ё",
        "zh": "ж",
        "z": "з",
        "i": "и",
        "y": ["й", "ы"],
        "k": "к",
        "l": "л",
        "m": "м",
        "n": "н",
        "o": "о",
        "p": "п",
        "r": "р",
        "s": "с",
        "t": "т",
        "u": "у",
        "f": "ф",
        "h": "х",
        "ts": "ц",
        "ch": "ч",
        "sh": "ш",
        "sch": "щ",
        "yu": "ю",
        "ya": "я",
    };

    let result = "";
    let i = 0;

    while (i < text.length) {
        let found = false;

        // Check for multi-character mappings first (longest to shortest)
        for (let len = 3; len >= 1; len--) {
            const substr = text.slice(i, i + len);
            if (reverseMap[substr]) {
                const mapped = reverseMap[substr];
                result += Array.isArray(mapped) ? mapped[0] : mapped;
                i += len;
                found = true;
                break;
            }
        }

        // If no multi-character mapping found, use single character
        if (!found) {
            const char = text[i];
            const mapped = reverseMap[char];
            result += Array.isArray(mapped) ? mapped[0] : (mapped || char);
            i++;
        }
    }

    return result;
};