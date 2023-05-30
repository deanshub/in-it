'use client';
import { useState } from 'react';
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '../basic/dropdown-menu';

export function ThemeDropdownMenuGroup() {
  const [theme, setTheme] = useState('dark');

  return (
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
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
