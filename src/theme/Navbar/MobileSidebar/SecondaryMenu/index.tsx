import React, {type ComponentProps, type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar, useNavbarSecondaryMenu} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';

function SecondaryMenuBackButton(props: ComponentProps<'button'>) {
  return (
    <button {...props} type="button" className="clean-btn navbar-sidebar__back">
      <Translate
        id="theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel"
        description="The label of the button used to return to the main mobile navigation">
        ← Back to main menu
      </Translate>
    </button>
  );
}

function GlobalNavItems() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const globalItems = items.filter((item) => item.type !== 'docSidebar');

  return (
    <ul className="menu__list navbar-sidebar__global-links">
      {globalItems.map((item, index) => (
        <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={index} />
      ))}
    </ul>
  );
}

export default function NavbarMobileSidebarSecondaryMenu(): ReactNode {
  const secondaryMenu = useNavbarSecondaryMenu();

  return (
    <>
      <SecondaryMenuBackButton onClick={() => secondaryMenu.hide()} />
      <GlobalNavItems />
      <div className="navbar-sidebar__docs-menu">{secondaryMenu.content}</div>
    </>
  );
}
