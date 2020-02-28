import { useCallback, useState, useEffect } from 'react';
import Axios from "axios";
import AsyncSelect from 'react-select/async';
import { API_ENDPOINT } from "../utils/requests";

interface DefinitionLookaheadProps {
  path: string;
  onChange: (selection: { label: string; value: number }) => void;
  placeholder?: string;
  value?: { label: string; value: number } | null;
  defaultId?: number;
  defaultLabel?: string;
}

export const DefinitionLookahead: React.FC<DefinitionLookaheadProps> = ({ path, onChange, placeholder, value, defaultId, defaultLabel }) => {
  const [internalValue, setInternalValue] = useState(() => value ?? (defaultId !== undefined && defaultLabel !== undefined ? ({
    value: defaultId,
    label: defaultLabel,
  }) : null));

  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  
  const handleChange = useCallback(newValue => {
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const handleLoadOptions = useCallback((value: string) => new Promise(resolve => {
    Axios.get(`${API_ENDPOINT}${path}?query=${value}`).then(response => resolve(response.data));
  }), [path]);

  return (
    <AsyncSelect
      classNamePrefix='selector'
      loadOptions={handleLoadOptions}
      placeholder={placeholder}
      onChange={handleChange}
      value={internalValue}
    />
  );
};