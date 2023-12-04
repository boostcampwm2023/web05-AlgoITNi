import { EDITOR_LANGUAGE_TYPES } from '@/constants/editor';

interface LanguageTypeDropDownProps {
  languageName: string;
  setLanguageName: React.Dispatch<React.SetStateAction<string>>;
}

export default function LanguageTypeDropDown({ languageName, setLanguageName }: LanguageTypeDropDownProps) {
  return (
    <select
      name="language"
      onChange={(e) => setLanguageName(e.target.value)}
      value={languageName}
      className="p-2 bg-primary focus:outline-none"
    >
      {Object.values(EDITOR_LANGUAGE_TYPES).map((languageData, index) => (
        <option className="bg-white " key={index + languageData.name} value={languageData.name}>
          {languageData.optionText}
        </option>
      ))}
    </select>
  );
}
