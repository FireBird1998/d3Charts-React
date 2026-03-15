interface ControlPanelProps<T extends string> {
  items: { label: string; value: T }[]
  selected: T
  onChange: (value: T) => void
}

export function ControlPanel<T extends string>({
  items,
  selected,
  onChange,
}: ControlPanelProps<T>) {
  return (
    <div
      role="group"
      aria-label="Chart options"
      className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-0.5"
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          aria-pressed={selected === item.value}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            selected === item.value
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
