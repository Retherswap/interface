import Logo from 'components/Logo';
import useTheme from 'hooks/useTheme';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
const HomeLogoIconLogo = styled(Logo)<{ size: number }>`
  border-radius: 150px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 1);
  background-color: ${({ theme }) => theme.white};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  ${({ theme, size }) => theme.mediaWidth.upToMedium`
  width: ${size / 1.25}px;
  height: ${size / 1.25}px;
`}
  ${({ theme, size }) => theme.mediaWidth.upToSmall`
  width: ${size / 1.5}px;
  height: ${size / 1.5}px;
`}
  ${({ theme, size }) => theme.mediaWidth.upToExtraSmall`
  width: ${size / 2}px;
  height: ${size / 2}px;
`}
`;

const Line = ({ x1, y1, x2, y2 }) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const theme = useTheme();
  return (
    <div
      style={{
        width: `${length}px`,
        position: 'absolute',
        height: '5px',
        backgroundColor: theme.blue2,
        transform: `translate(${x1}px, ${y1}px) rotate(${angle}deg) `,
        transformOrigin: '0 0',
        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.8)',
      }}
    ></div>
  );
};

export default function HomeLogoIcon({
  src,
  size,
  top,
  left,
  link,
  parentRef,
  mainRef,
  setRef,
}: {
  src: string;
  size: number;
  top: number;
  left: number;
  link: boolean;
  parentRef: any;
  mainRef?: any;
  setRef?: (ref: any) => void;
}) {
  const ref = useRef<any>(null);
  const endPositionRef = useRef({ left: Math.random() * 6, top: Math.random() * 6 });
  const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 0 });
  const [elementSize, setElementSize] = useState({ x: 0, y: 0, x2: 0, y2: 0 });
  useEffect(() => {
    let frameId;
    const currentPosition = { left: 0, top: 0 };
    const lerp = (start, end, alpha) => start + (end - start) * alpha;
    const updateEndPosition = () => {
      endPositionRef.current.left = Math.random() * 16 - 8;
      endPositionRef.current.top = Math.random() * 16 - 8;
    };
    const moveElement = () => {
      const isCloseToTarget =
        Math.abs(currentPosition.left - endPositionRef.current.left) < 2 &&
        Math.abs(currentPosition.top - endPositionRef.current.top) < 2;

      if (isCloseToTarget) {
        updateEndPosition();
      }
      currentPosition.left = lerp(currentPosition.left, endPositionRef.current.left, 0.005);
      currentPosition.top = lerp(currentPosition.top, endPositionRef.current.top, 0.005);

      setFloatingPosition({ ...currentPosition });
      if (link && ref.current && mainRef && mainRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const mainCircleRect = mainRef.current.getBoundingClientRect();
        const secondaryCircleRect = ref.current.getBoundingClientRect();
        const mainCircleCenterX = mainCircleRect.left - parentRect.left + mainCircleRect.width / 2;
        const mainCircleCenterY = mainCircleRect.top - parentRect.top + mainCircleRect.height / 2;
        const secondaryCircleCenterX = secondaryCircleRect.left - parentRect.left + secondaryCircleRect.width / 2;
        const secondaryCircleCenterY = secondaryCircleRect.top - parentRect.top + secondaryCircleRect.height / 2;
        const angle = Math.atan2(
          secondaryCircleCenterY - mainCircleCenterY,
          secondaryCircleCenterX - mainCircleCenterX
        );
        const mainCircleRadius = mainCircleRect.width / 2;
        const secondaryCircleRadius = secondaryCircleRect.width / 2;
        const lineEndPointX = mainCircleCenterX + Math.cos(angle) * mainCircleRadius;
        const lineEndPointY = mainCircleCenterY + Math.sin(angle) * mainCircleRadius;
        const lineStartPointX = secondaryCircleCenterX - Math.cos(angle) * secondaryCircleRadius;
        const lineStartPointY = secondaryCircleCenterY - Math.sin(angle) * secondaryCircleRadius;
        setElementSize({
          x: lineEndPointX,
          y: lineEndPointY,
          x2: lineStartPointX,
          y2: lineStartPointY,
        });
      }
      frameId = requestAnimationFrame(moveElement);
    };
    frameId = requestAnimationFrame(moveElement);
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [ref, mainRef, parentRef, link]);
  useEffect(() => {
    if (ref.current) {
      setRef && setRef(ref);
    }
  }, [ref, setRef]);
  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`,
          transform: `translate(${floatingPosition.left - 50}%, ${floatingPosition.top - 50}%)`,
          zIndex: 10,
        }}
      >
        <HomeLogoIconLogo size={size} srcs={[src]}></HomeLogoIconLogo>
      </div>
      {link && <Line x1={elementSize.x} x2={elementSize.x2} y1={elementSize.y} y2={elementSize.y2}></Line>}
    </>
  );
}
