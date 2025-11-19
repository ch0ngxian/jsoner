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
      <p style={{ color: '#369eda' }}>
        {String(value)}{showEndComma && <span style={{ color: '#d4d4d4' }}>,</span>}
      </p>
    </div>
  )
}
