import React, { useState } from 'react';
import { darken } from 'polished';
import { ExternalLink } from 'react-feather';
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
  margin-left: -0.2rem;
  gap: 0.3em;
  padding: 0.5em;
  min-width: 140px;
  width: max-content;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text4};
  box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text2};
`;
const LinkMenuTitle = styled(NavLink)`
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
const MenuTitle = styled('span')`
  user-select: none;
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

const StyledLink = styled('a')`
  ${({ theme }) => theme.flexRowNoWrap}
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  defaultLink?: string;
  content?: { title: string; link?: string; external?: boolean }[];
}) {
  const location = useLocation();

  let active = false;
  if (content && content.some((item) => location.pathname.includes(item.link))) {
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
      {defaultLink ? (
        <LinkMenuTitle to={defaultLink} className={active ? 'active' : ''}>
          {title}
        </LinkMenuTitle>
      ) : (
        <MenuTitle>{title}</MenuTitle>
      )}
      {isOpen && content && content.length > 0 && (
        <MenuWrapper onClick={(event) => event.stopPropagation()} onTouchEnd={(event) => event.stopPropagation()}>
          <MenuContent>
            {content.map((item) =>
              item.link ? (
                item.external ? (
                  <StyledLink
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    key={item.title}
                    href={item.link}
                    target="_blank"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    {t(item.title)}
                    <ExternalLink size={12}></ExternalLink>
                  </StyledLink>
                ) : (
                  <StyledNavLink
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    key={item.title}
                    to={item.link}
                  >
                    {t(item.title)}
                  </StyledNavLink>
                )
              ) : (
                <StyledLink key={item.title} style={{ cursor: 'default' }}>
                  {t(item.title)}
                </StyledLink>
              )
            )}
          </MenuContent>
        </MenuWrapper>
      )}
    </Menu>
  );
}
