import styled from 'styled-components';
import { TYPE_COLORS, TYPE_ICONS } from "../utils/pokemonTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '../utils/theme';

function getMultiplierString(multiplier: number) {
  if(multiplier === 0.25) return '¼';
  if(multiplier === 0.5) return '½';

  return multiplier;
}

interface TypeIndicatorProps {
  name: string;
  multiplier?: number;
  icon?: boolean;
  onClick?: (event: Event) => void;
  disabled?: boolean;
}

export const TypeIndicator: React.FC<TypeIndicatorProps> = ({ name, multiplier, icon, onClick, disabled }) => name ? (
  <Container
    role={onClick && !disabled ? 'button' : undefined} 
    tabIndex={onClick && !disabled ? 0 : undefined}
    onClick={onClick}
  >
    <Name>{name[0].toUpperCase() + name.substr(1)}</Name>
    <TypeIndicatorThreshold color={TYPE_COLORS[name.toLowerCase()]}>
      {multiplier && <span>&times;{getMultiplierString(multiplier)}</span>}
      {icon && <FontAwesomeIcon icon={TYPE_ICONS[name.toLowerCase()]} />}
    </TypeIndicatorThreshold>
  </Container>
) : null;

const Container = styled.div<{ onClick: unknown }>`
  position: relative;
  display: flex;
  height: 1.75rem;
  flex-direction: row;
  align-items: center;
  text-align: left;
  color: #fff;
  background-color: #333;
  border-radius: 0.125rem;
  padding: 0.125rem 0.125rem 0.125rem 2.25rem;
  overflow: hidden;
  cursor: ${({ onClick }) => onClick && 'pointer'};
`;

const Name = styled.div`
  width: 5rem;
  padding: 0 0.5rem;
  text-align: center;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    font-size: 0.825rem;
    width: 4rem;
  }
`;

const TypeIndicatorThreshold = styled.div<{ color: string }>`
  position: absolute;
  display: flex;
  top: 0;
  left: -1px;
  width: 2.25rem;
  padding-right: 0.5rem;
  height: 100%;
  background-color: ${props => props.color};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  clip-path: polygon(0 -5px, calc(100% + 1px) -5px, 70% calc(100% + 1px), 0% calc(100% + 1px));
`;