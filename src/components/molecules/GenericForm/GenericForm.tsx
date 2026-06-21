import React from 'react'
import Input from '../../atoms/Input/Input'
import Select from '../../atoms/Select/Select'
import Textarea from '../../atoms/Textarea/Textarea'
import Checkbox from '../../atoms/Checkbox/Checkbox'
import InputEmail from '../../atoms/InputEmail/InputEmail'
import InputTelefone from '../../atoms/InputTelefone/InputTelefone'
import styles from './GenericForm.module.css'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'checkbox' | 'datetime-local' | 'date' | 'textarea'
  required?: boolean
  options?: Array<{ id: string | number; nome: string }>
}

interface GenericFormProps {
  title: string
  fields: FormField[]
  values: Record<string, any>
  onValueChange: (updates: Record<string, any>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  submitLabel?: string
  isEditing?: boolean
  showCancel?: boolean
}

export default function GenericForm({
  title,
  fields,
  values,
  onValueChange,
  onSubmit,
  onCancel,
  submitLabel,
  isEditing = false,
  showCancel = true,
}: GenericFormProps) {
  return (
    <div className={styles.formCard}>
      <h3>{title}</h3>
      <form onSubmit={onSubmit} className={styles.form}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            {field.type === 'checkbox' ? (
              <Checkbox
                checked={values[field.name] || false}
                onChange={(checked) => onValueChange({ [field.name]: checked })}
                label={field.label}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <>
                <label>
                  {field.label}
                  {field.required && ' *'}
                </label>
                <Select
                  value={values[field.name] || ''}
                  onChange={(e) => onValueChange({ [field.name]: e.target.value })}
                  required={field.required}
                >
                  <option value="">Selecione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nome}
                    </option>
                  ))}
                </Select>
              </>
            ) : field.type === 'textarea' ? (
              <>
                <label>
                  {field.label}
                  {field.required && ' *'}
                </label>
                <Textarea
                  value={values[field.name] || ''}
                  onChange={(e) => onValueChange({ [field.name]: e.target.value })}
                  required={field.required}
                />
              </>
            ) : field.type === 'email' ? (
              <>
                <label>
                  {field.label}
                  {field.required && ' *'}
                </label>
                <InputEmail
                  value={values[field.name] || ''}
                  onChange={(e) => onValueChange({ [field.name]: e.target.value })}
                  required={field.required}
                />
              </>
            ) : field.type === 'tel' ? (
              <>
                <label>
                  {field.label}
                  {field.required && ' *'}
                </label>
                <InputTelefone
                  value={values[field.name] || ''}
                  onChange={(value) => onValueChange({ [field.name]: value })}
                  required={field.required}
                />
              </>
            ) : (
              <>
                <label>
                  {field.label}
                  {field.required && ' *'}
                </label>
                <Input
                  type={field.type}
                  value={values[field.name] || ''}
                  onChange={(e) => onValueChange({ [field.name]: e.target.value })}
                  required={field.required}
                />
              </>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {submitLabel || (isEditing ? 'Atualizar' : 'Adicionar')}
          </button>
          {showCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
