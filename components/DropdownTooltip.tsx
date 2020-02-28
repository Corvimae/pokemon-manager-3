import { useEffect } from "react";
import styled from 'styled-components';
import { useFirstInputFocus, useOnMount } from "../utils/hooks";

interface DropdownTooltipProps {
  visible: boolean;
  onVisibilityChange: (status: boolean) => void;
  className?: string;
}
export const DropdownTooltip: React.FC<DropdownTooltipProps> = ({ visible, onVisibilityChange, className, children }) => {
  const [ref, focus] = useFirstInputFocus();

  useOnMount(() => {
    focus();
  });

  useEffect(() => {
    const hideTooltip = (event: Event) => {
      
      if(!ref.current?.contains(event.target as Node)) {
        onVisibilityChange(false);
      }
    }

    window.addEventListener('click', hideTooltip, true);

    return (): void => {
      window.removeEventListener('click', hideTooltip);
    }
  });

  return visible && (
    <DropdownTooltipContainer ref={ref} className={className}>
      {children}
    </DropdownTooltipContainer>
  );
}

const DropdownTooltipContainer = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  color: #333;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.25);
  transform: translate(-50%, 0);
  z-index: 9999;

  &::after {
    content: '';
    position: absolute;
    top: -0.5rem;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-bottom: 0.5rem solid #fff;
    border-right: 0.5rem solid transparent;
    transform: translate(-50%, 0);
  }
`;