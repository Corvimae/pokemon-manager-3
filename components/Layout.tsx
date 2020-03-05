import styled from 'styled-components';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '../utils/theme';
import Tippy from '@tippy.js/react';

interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon: IconDefinition;
  inverse?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ className, icon, inverse, onClick, children, ...props }) => (
  <IconButtonContainer className={className} onClick={onClick} inverse={inverse}>
    <IconButtonCircle inverse={inverse} {...props}>
      <FontAwesomeIcon icon={icon} size="xs" />
    </IconButtonCircle>
    {children && <IconButtonContent>{children}</IconButtonContent>}
  </IconButtonContainer>
);

const IconButtonCircle = styled.div<{ inverse: boolean }>`
  display: flex;
  width: 1.125rem;
  height: 1.125rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background-color: ${props => props.inverse ? '#fff' : '#333'};
  border: none;
`;


const IconButtonContainer = styled.button<{ inverse: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 700;
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  padding: 0;
  line-height: normal;
  color: ${props => props.inverse ? '#fff' : '#333'};
  border: none;
  background-color: transparent;
  cursor: pointer;

  & svg {
    color: ${props => props.inverse ? '#333' : '#fff'};
    font-size: 0.75rem;
  }

  &:hover {
    color: ${props => props.inverse ? '#eee' : '#555'};
  }

  &:hover ${IconButtonCircle} {
    background-color: ${props => props.inverse ? '#eee' : '#555'};
  }

  &:hover svg {
    color: ${props => props.inverse ? '#555' : '#eee'};
  }
  
`;

const IconButtonContent = styled.div`
  margin-left: 0.5rem;
  font-weight: 400;
`;

export const Button = styled.button`
  display: flex;
  height: 1.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #555;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const AddItemButton = styled(Button)`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 0.875rem;
  background-color: transparent;
  border: 1px dashed #333;
  line-height: 1;
  color: #666;

  &:hover:not(:disabled) {
    background-color: #eaeaea;
  }
`

export const StatList = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  box-shadow: ${Theme.dropShadow};
`;

export const StatKey = styled.div`
  display: flex;
  min-width: 8rem;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #dadada;
  padding: 0.25rem 1rem;
  font-size: 0.825rem;
`;

export const StatValue = styled.div`
  display: flex;
  min-width: 12rem;
  flex-direction: row;
  background-color: #fff;
  padding: 0.25rem 1rem;
`;


export const StatRow = styled.div`
  display: contents;

  &:not(:last-of-type) ${StatKey} {
    border-bottom: 1px solid #c0c0c0;
  }

  &:not(:last-of-type) ${StatValue} {
    border-bottom: 1px solid #e0e0e0;
  }
`;

export const StatRowDivider = styled.div`
  height: 0.125rem;
  grid-column: 1 / -1;
`;

export const TextInput = styled.input`
  font-size: 1rem;
  padding: 0.25rem;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  font-family: inherit;

  &:focus,
  &:active {
    outline: none;
    border-bottom: 1px solid rgba(79, 128, 179, 0.5);
  }
`;

export const NumericInput = styled.input`
  font-size: 1rem;
  padding: 0.25rem;
  text-align: center;
  border: none;
  border-bottom: 1px solid #aaa;
  font-family: inherit;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const DropdownHeader = styled.div`
  color: #666;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.125rem;
`;

export const Tooltip = styled(Tippy)`
  background-color: #fff;
  color: #333;

  &[data-placement^='bottom'] {
    .tippy-arrow {
      border-bottom-color: #fff;
    }
  }
`;


export const RightBackgroundStripe = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${Theme.backgroundStripe};
  clip-path: polygon(8rem 0, 100% 0%, 100% 100%, 0 100%);
  z-index: -1;
  pointer-events: none;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    left: 4rem;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.25);
    clip-path: polygon(8rem 0, 100% 0%, 100% 100%, 0 100%);
    z-index: -2;
  }
`;
