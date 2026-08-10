import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { buttonVariants } from './ui/button'
import { cn } from '../lib/utils'

type ThemePreference = 'light' | 'dark' | 'system'

interface Props {
  label: string
  lightLabel: string
  darkLabel: string
  systemLabel: string
}

function getPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem('plate')
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

function resolvedTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'system') return preference
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function ThemeToggle({
  label,
  lightLabel,
  darkLabel,
  systemLabel,
}: Props) {
  const [open, setOpen] = useState(false)
  const [preference, setPreference] = useState<ThemePreference>('system')
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const update = () => {
      const nextPreference = getPreference()
      setPreference(nextPreference)
      setActiveTheme(resolvedTheme(nextPreference))
    }

    update()
    const media = window.matchMedia('(prefers-color-scheme: light)')
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  function setTheme(next: ThemePreference) {
    setPreference(next)
    setActiveTheme(resolvedTheme(next))
    if (next === 'system') {
      document.documentElement.removeAttribute('data-theme')
      localStorage.removeItem('plate')
    } else {
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('plate', next)
    }
    setOpen(false)
  }

  function toggleTheme() {
    setTheme(activeTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            data-plate-toggle
            aria-label={label}
            title={label}
            aria-haspopup="menu"
            aria-expanded={open}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'hover:bg-transparent hover:text-accent-ink')}
          >
            <Sun size={16} className="icon-sun size-4 shrink-0" />
            <Moon size={16} className="icon-moon size-4 shrink-0" />
          </button>
        }
        onPointerDown={(event) => {
          if (event.button === 0) event.preventDefault()
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggleTheme()
        }}
        onContextMenu={(event) => {
          event.preventDefault()
          setOpen(true)
        }}
        onKeyDown={(event) => {
          // Enter and Space flip the plate, matching a click. The three-way
          // choice — including the return to System — opens on the arrow keys,
          // which is the only route a keyboard has to the right-click menu.
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      />
      <DropdownMenuContent align="end" sideOffset={8} className="p-0">
        <DropdownMenuRadioGroup value={preference} onValueChange={(value) => setTheme(value as ThemePreference)}>
          <DropdownMenuRadioItem value="light" className="items-center gap-3 leading-none">
            <Sun className="size-4 shrink-0" />
            {lightLabel}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="items-center gap-3 leading-none">
            <Moon className="size-4 shrink-0" />
            {darkLabel}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="items-center gap-3 leading-none">
            <Monitor className="size-4 shrink-0" />
            {systemLabel}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
