import { Search, X } from "lucide-react";
import InputField from "@/components/ui/input-field";

// Search field used at the top of the filter dropdown panels.
const DropdownSearch = ({ value, onChange, onClear, placeholder }) => (
  <div className="p-2">
    <div className="flex items-center gap-2 rounded-full border border-border_grey bg-custom_gray px-3 transition-colors focus-within:border-background_green focus-within:bg-white">
      <Search
        className="h-4 w-4 shrink-0 text-text_grey_darker"
        aria-hidden="true"
      />
      {/* type="text" rather than "search" so the native clear button does not
          sit next to ours */}
      <InputField
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        inputType="searchType"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Șterge căutarea"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-text_grey_darker transition-colors hover:bg-border_grey hover:text-text_grey"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  </div>
);

export { DropdownSearch };
export default DropdownSearch;
