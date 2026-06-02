import { useState } from "react";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export function DateInput({ label, value, onChange, required, className = "", placeholder = "DD/MM/AAAA" }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Formata DD/MM/AAAA para YYYY-MM-DD
  const formatToISO = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 10) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  // Formata YYYY-MM-DD para DD/MM/AAAA
  const formatToDisplay = (isoDate: string): string => {
    if (!isoDate || isoDate.length !== 10) return "";
    const parts = isoDate.split("-");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  // Aplica máscara DD/MM/AAAA
  const applyMask = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    let masked = "";
    
    if (numbers.length > 0) {
      masked += numbers.substring(0, 2);
    }
    if (numbers.length > 2) {
      masked += "/" + numbers.substring(2, 4);
    }
    if (numbers.length > 4) {
      masked += "/" + numbers.substring(4, 8);
    }
    
    return masked;
  };

  // Valida se a data é real
  const isValidDate = (dateStr: string): boolean => {
    if (!dateStr || dateStr.length !== 10) return false;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return false;
    
    const [day, month, year] = parts.map(Number);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > 2100) return false;
    
    const date = new Date(year, month - 1, day);
    const today = new Date();
    
    // Verifica se a data é válida (ex: 31/02 não existe)
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return false;
    }
    
    // Bloqueia datas futuras
    if (date > today) return false;
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const masked = applyMask(rawValue);
    setDisplayValue(masked);
    
    if (masked.length === 10 && isValidDate(masked)) {
      onChange(formatToISO(masked));
    } else {
      onChange("");
    }
  };

  const handleBlur = () => {
    if (displayValue.length === 10 && !isValidDate(displayValue)) {
      setDisplayValue("");
      onChange("");
    }
  };

  // Inicializa displayValue quando value muda externamente
  if (value && !displayValue) {
    setDisplayValue(formatToDisplay(value));
  }

  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={10}
        className="w-full bg-surface border-2 border-navy/10 px-4 py-3 rounded-xl font-medium focus:border-action outline-none transition-colors"
      />
    </label>
  );
}
