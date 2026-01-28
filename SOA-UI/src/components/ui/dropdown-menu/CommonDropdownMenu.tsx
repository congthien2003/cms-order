import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './index';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TriggerProps = {
  children?: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
};

type MenuItem =
  | {
      type?: 'item';
      label?: string | React.ReactNode;
      children?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      shortcut?: string;
    }
  | {
      type: 'separator';
    }
  | {
      type: 'submenu';
      label: string | React.ReactNode;
      items: MenuItem[];
    };

type MenuGroup = {
  label?: string | React.ReactNode;
  items: MenuItem[];
};

type CommonDropdownMenuProps = {
  trigger: TriggerProps;
  groups: MenuGroup[];
  align?: 'start' | 'center' | 'end';
  contentClassName?: string;
};

function CommonDropdownMenu({
  trigger,
  groups,
  align = 'start',
  contentClassName,
}: CommonDropdownMenuProps) {
  const renderTrigger = () => {
    if (trigger.children) return trigger.children;

    return (
      <Button variant="outline" className="flex items-center gap-2">
        {trigger.icon}
        {trigger.label}
      </Button>
    );
  };

  const renderItems = (items: MenuItem[]) =>
    items.map((item, index) => {
      if (item.type === 'separator') {
        return <DropdownMenuSeparator key={index} />;
      }

      if (item.type === 'submenu') {
        return (
          <DropdownMenuSub key={index}>
            <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {renderItems(item.items)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem
          key={index}
          disabled={item.disabled}
          onClick={item.onClick}
        >
          {item.label ?? item.children}
          {item.shortcut && (
            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      );
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{renderTrigger()}</DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className={cn('w-56', contentClassName)}
      >
        {groups.map((group, index) => (
          <React.Fragment key={index}>
            {index > 0 && <DropdownMenuSeparator />}

            <DropdownMenuGroup>
              {group.label && (
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              )}

              {renderItems(group.items)}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CommonDropdownMenu;
