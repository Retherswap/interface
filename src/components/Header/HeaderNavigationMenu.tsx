import { darken } from 'polished';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
const Menu = styled.div`
  position: relative;
  margin-bottom: 0rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`;
const MenuWrapper = styled.div`
  position: absolute;
  left: 0;
  z-index: 10000;
`;
const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.1rem;
  margin-left: -0.7rem;
  gap: 0.3em;
  padding: 0.5em;
  width: 140px;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text4};
  box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text2};
`;
const MenuTitle = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  width: 100%;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  &.active {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg3};
  }
`;
const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  color: ${({ theme }) => theme.text2};
  font-size: 0.8rem;
  width: 100%;
  padding: 0.3rem 0.6rem;
  font-weight: 500;
  transition: 0.2s;

  &:not(:last-child) {
    margin-right: 0.16rem;
  }

  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg3};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
      border-radius: 10px;
      padding: 0.2rem 5%;
      border: 0px solid ${({ theme }) => theme.bg3};
  
      &:not(:last-child) {
        margin-right: 2%;
      }
    `};
`;

export default function HeaderNavigationMenu({
  title,
  defaultLink,
  content,
}: {
  title: string;
  defaultLink: string;
  content: { title: string; link: string }[];
}) {
  const location = useLocation();

  let active = false;
  if (content.some((item) => location.pathname.includes(item.link))) {
    active = true;
  }
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(true)}
      onTouchEnd={() => setIsOpen(false)}
    >
      <MenuTitle to={defaultLink} className={active ? 'active' : ''}>
        {title}
      </MenuTitle>
      {isOpen && (
        <MenuWrapper onClick={(event) => event.stopPropagation()} onTouchEnd={(event) => event.stopPropagation()}>
          <MenuContent>
            {content.map((item, index) => (
              <StyledNavLink
                onClick={() => {
                  setIsOpen(false);
                }}
                key={item.link}
                id={`swap-nav-link`}
                to={item.link}
              >
                {t(item.title)}
              </StyledNavLink>
            ))}
          </MenuContent>
        </MenuWrapper>
      )}
    </Menu>
  );
}
