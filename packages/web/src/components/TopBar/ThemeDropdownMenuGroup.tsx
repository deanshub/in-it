'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '../basic/dropdown-menu';

export function ThemeDropdownMenuGroup() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const setTheme = useCallback((theme: 'dark' | 'light') => {
    const body = document.querySelector('body');
    if (theme === 'light') {
      body?.classList.remove('dark');
      setThemeState('light');
    } else {
      body?.classList.add('dark');
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body?.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  return (
    <DropdownMenuRadioGroup
      value={theme}
      onValueChange={(value) => setTheme(value as 'light' | 'dark')}
    >
      <DropdownMenuLabel className="text-xs font-normal">Theme</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioItem className="cursor-pointer" value="light">
        Light
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem className="cursor-pointer" value="dark">
        Dark
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}
