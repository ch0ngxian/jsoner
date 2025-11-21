import Field from './Field'

interface VStringProps {
  field?: string | number
  value: string
  showEndComma?: boolean
}

export default function VString({ field, value, showEndComma = true }: VStringProps) {
  return (
    <div className="flex">
      {field && (
        <>
          <Field field={field} />
          <p className="pr-1">:</p>
        </>
      )}
      <p style={{ color: 'var(--json-string)', maxWidth: '40vw' }} className="break-words">
        &quot;{value}&quot;{showEndComma && <span style={{ color: 'var(--json-punctuation)' }}>,</span>}
      </p>
    </div>
  )
}
