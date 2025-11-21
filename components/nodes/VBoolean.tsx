import Field from './Field'

interface VBooleanProps {
  field?: string | number
  value: boolean
  showEndComma?: boolean
}

export default function VBoolean({ field, value, showEndComma = true }: VBooleanProps) {
  return (
    <div className="flex">
      {field && (
        <>
          <Field field={field} />
          <p className="pr-1">:</p>
        </>
      )}
      <p style={{ color: 'var(--json-boolean)' }}>
        {String(value)}{showEndComma && <span style={{ color: 'var(--json-punctuation)' }}>,</span>}
      </p>
    </div>
  )
}
