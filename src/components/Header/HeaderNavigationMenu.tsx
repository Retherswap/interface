import { darken } from 'polished';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
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
  z-index: 1000;
`;
const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.1rem;
  margin-left: -0.7rem;
  gap: 0.3rem;
  padding: 0.5rem;
  width: 140px;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text4};
  box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text2};
`;
const MenuTitle = styled(NavLink)`
  font-size: 0.8rem;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onTouchEnd={() => setIsOpen(!isOpen)}
    >
      <MenuTitle to={defaultLink}>{title}</MenuTitle>
      {isOpen && (
        <MenuWrapper>
          <MenuContent>
            {content.map((item, index) => (
              <StyledNavLink key={item.link} id={`swap-nav-link`} to={item.link}>
                {t(item.title)}
              </StyledNavLink>
            ))}
          </MenuContent>
        </MenuWrapper>
      )}
    </Menu>
  );
}
