import VNull from './VNull'
import VObject from './VObject'
import VArray from './VArray'
import VString from './VString'
import VNumber from './VNumber'
import VBoolean from './VBoolean'

interface VNodeProps {
  field?: string | number
  node: any
  showEndComma?: boolean
  className?: string
}

export default function VNode({ field, node, showEndComma = true, className = '' }: VNodeProps) {
  const renderNode = () => {
    if (node == null) {
      return <VNull field={field} value={node} showEndComma={showEndComma} />
    } else if (typeof node === 'object' && !Array.isArray(node)) {
      return <VObject field={field} object={node} showEndComma={showEndComma} />
    } else if (Array.isArray(node)) {
      return <VArray field={field} array={node} showEndComma={showEndComma} />
    } else if (typeof node === 'string') {
      return <VString field={field} value={node} showEndComma={showEndComma} />
    } else if (typeof node === 'number') {
      return <VNumber field={field} value={node} showEndComma={showEndComma} />
    } else if (typeof node === 'boolean') {
      return <VBoolean field={field} value={node} showEndComma={showEndComma} />
    }
    return null
  }

  return (
    <div className={`flex py-0.5 ${className}`}>
      <div className="w-full">{renderNode()}</div>
    </div>
  )
}
