import Field from './Field'

interface VNumberProps {
  field?: string | number
  value: number
  showEndComma?: boolean
}

export default function VNumber({ field, value, showEndComma = true }: VNumberProps) {
  return (
    <div className="flex">
      {field && (
        <>
          <Field field={field} />
          <p className="pr-1">:</p>
        </>
      )}
      <p style={{ color: 'var(--json-number)' }}>
        {value}{showEndComma && <span style={{ color: 'var(--json-punctuation)' }}>,</span>}
      </p>
    </div>
  )
}
