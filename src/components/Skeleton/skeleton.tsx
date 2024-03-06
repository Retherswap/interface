import React from 'react';
import styled from 'styled-components';

const SkeletonContainer = styled.div`
  background: #eee;
  background: linear-gradient(
    110deg,
    ${({ theme }) => theme.bg3} 8%,
    ${({ theme }) => theme.bg2} 18%,
    ${({ theme }) => theme.bg3} 33%
  );
  border-radius: 5px;
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }
`;
export default function Skeleton({
  width = '100%',
  height = '5px',
  borderRadius = '5px',
}: {
  width: string;
  height: string;
  borderRadius: string;
}) {
  return (
    <SkeletonContainer
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
      }}
    ></SkeletonContainer>
  );
}
