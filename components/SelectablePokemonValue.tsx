import styled from 'styled-components';
import { useTypedSelector } from '../store/store';
import { StatValue } from './Layout';
import { useCallback } from 'react';
import { DefinitionLookahead } from './DefinitionLookahead';

interface SelectablePokemonValueProps {
  id: number;
  value: string;
  path: string;
  onChange: (selection: { label: string, value: number}) => void;
  onClick?: () => void;
  className?: string;
}

export const SelectablePokemonValue: React.FC<SelectablePokemonValueProps> = ({ id, value, path, onChange, onClick, className }) => {
  const editMode = useTypedSelector(state => state.editMode);

  const handleOnClick = useCallback(() => {
    if (!editMode) onClick?.();
  }, [editMode, onClick]);

  return (
    <Container className={className} onClick={handleOnClick}>
      {editMode && (
        <DefinitionLookahead
          path={path}
          onChange={onChange}
          defaultId={id}
          defaultLabel={value}
        />
      )}
      {!editMode && value}
    </Container>
  );
};

const Container = styled(StatValue)`
  & > div {
    width: 100%;
    font-size: 0.875rem;
  }
`;