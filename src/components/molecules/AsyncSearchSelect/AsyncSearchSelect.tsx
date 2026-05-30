import { useState, useEffect, useRef } from 'react'
import styles from './AsyncSearchSelect.module.css'

export interface AsyncSelectOption {
  id: string | number
  label: string
  [key: string]: any
}

interface AsyncSearchSelectProps {
  label: string
  placeholder?: string
  value: string | number | null
  onChange: (value: string | number | null, selectedItem?: AsyncSelectOption) => void
  onSearch: (query: string) => Promise<AsyncSelectOption[]>
  required?: boolean
  disabled?: boolean
  minChars?: number
  debounceMs?: number
  noResultsText?: string
  loadingText?: string
  initialOptions?: AsyncSelectOption[]
}

export default function AsyncSearchSelect({
  label,
  placeholder = 'Digite para buscar...',
  value,
  onChange,
  onSearch,
  required = false,
  disabled = false,
  minChars = 1,
  debounceMs = 300,
  noResultsText = 'Nenhum resultado encontrado',
  loadingText = 'Carregando...',
  initialOptions = [],
}: AsyncSearchSelectProps) {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<AsyncSelectOption[]>(initialOptions)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<AsyncSelectOption | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Update options when initialOptions changes
  useEffect(() => {
    if (initialOptions.length > 0) {
      setOptions(initialOptions)
    }
  }, [initialOptions])

  // Update selected option when value changes
  useEffect(() => {
    if (value && options.length > 0) {
      const selected = options.find(opt => opt.id === value)
      if (selected) {
        setSelectedOption(selected)
        setInputValue(selected.label)
      }
    }
  }, [value, options])

  // Load label for initial value
  useEffect(() => {
    if (value && !inputValue && options.length > 0) {
      const selected = options.find(opt => opt.id === value)
      if (selected) {
        setInputValue(selected.label)
        setSelectedOption(selected)
      }
    }
  }, [value])

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const trimmedInput = String(inputValue || '').trim()
    if (trimmedInput.length < minChars) {
      setOptions([])
      return
    }

    setIsLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await onSearch(trimmedInput)
        setOptions(results)
      } catch (err) {
        console.error('Erro ao buscar:', err)
        setOptions([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [inputValue, minChars, debounceMs, onSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsOpen(true)
  }

  function handleSelectOption(option: AsyncSelectOption) {
    setSelectedOption(option)
    setInputValue(option.label)
    setIsOpen(false)
    onChange(option.id, option)
  }

  function handleClear() {
    setInputValue('')
    setSelectedOption(null)
    setOptions([])
    setIsOpen(false)
    onChange(null)
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <label>
        {label}
        {required && ' *'}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue || ''}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          autoComplete="off"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearBtn}
            aria-label="Limpar"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {isLoading ? (
            <div className={styles.message}>{loadingText}</div>
          ) : options.length > 0 ? (
            <ul className={styles.optionsList}>
              {options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`${styles.option} ${
                      selectedOption?.id === option.id ? styles.selected : ''
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : String(inputValue || '').trim().length >= minChars ? (
            <div className={styles.message}>{noResultsText}</div>
          ) : (
            <div className={styles.message}>Digite pelo menos {minChars} caractere(s)</div>
          )}
        </div>
      )}
    </div>
  )
}
